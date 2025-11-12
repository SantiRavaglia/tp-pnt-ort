import { Router } from "express";
import {
  ALBUM_LISTENS_FILE,
  readJson,
  writeJson
} from "../storage.js";

const router = Router();

/**
 * FORMATO ESPERADO EN albumListens.json:
 *
 * [
 *   {
 *     "album_id": 19,
 *     "user_id": 110,
 *     "times_listened": 1,
 *     "rating": 4
 *   },
 *   ...
 * ]
 *
 * Clave lógica: (album_id, user_id)
 */

// GET /album-listens - obtener todos los registros
router.get("/", async (req, res) => {
  try {
    const listens = await readJson(ALBUM_LISTENS_FILE);
    res.json(listens);
  } catch (error) {
    console.error("Error al leer album-listens:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// GET /album-listens/:album_id/:userId - obtener un registro por (album_id, user_id)
router.get("/:album_id/:userId", async (req, res) => {
  try {
    const listens = await readJson(ALBUM_LISTENS_FILE);
    const album_id = Number(req.params.album_id);
    const userId = Number(req.params.userId);

    const listen = listens.find(
      (l) => l.album_id === album_id && l.user_id === userId
    );

    if (!listen) {
      return res.status(404).json({ error: "Registro no encontrado" });
    }

    res.json(listen);
  } catch (error) {
    console.error("Error al leer album-listen:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// POST /album-listens - crear registro de escucha
router.post("/", async (req, res) => {
  try {
    let { album_id, user_id, times_listened, rating } = req.body;

    // Normalizamos a número por las dudas vengan como string
    album_id = Number(album_id);
    user_id = Number(user_id);

    if (Number.isNaN(album_id) || Number.isNaN(user_id)) {
      return res.status(400).json({
        error: "album_id y user_id deben ser numéricos"
      });
    }

    const listens = await readJson(ALBUM_LISTENS_FILE);

    // Buscamos si ya existe la combinación (album_id, user_id)
    const index = listens.findIndex(
      (l) => l.album_id === album_id && l.user_id === user_id
    );

    // ✅ Si ya existe: incrementamos times_listened en 1
    if (index !== -1) {
      const current = listens[index];

      const updatedListen = {
        ...current,
        times_listened: (current.times_listened || 0) + 1,
        // si te mandan un rating nuevo, lo actualizás; si no, se mantiene
        ...(rating !== undefined ? { rating } : {})
      };

      listens[index] = updatedListen;
      await writeJson(ALBUM_LISTENS_FILE, listens);

      // 200 OK porque estamos actualizando
      return res.status(200).json(updatedListen);
    }

    // 🆕 Si no existe: lo creamos como nuevo registro
    const newListen = {
      album_id,
      user_id,
      times_listened: times_listened ?? 1, // si no mandan, arranca en 1
      ...(rating !== undefined ? { rating } : {})
    };

    listens.push(newListen);
    await writeJson(ALBUM_LISTENS_FILE, listens);

    // 201 Created porque es un registro nuevo
    res.status(201).json(newListen);
  } catch (error) {
    console.error("Error al crear/actualizar album-listen:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

export default router;
