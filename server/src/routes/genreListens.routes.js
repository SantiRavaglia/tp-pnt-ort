import { Router } from "express";
import {
  GENRE_LISTENS_FILE,
  readJson,
  writeJson
} from "../storage.js";

const router = Router();

/**
 * FORMATO ESPERADO EN albumListens.json:
 *
 * [
 *   {
 *     "genre_id": 19,
 *     "albums_listened": 7,
 *   },
 *   ...
 * ]
 *
 * Clave lógica: (album_id, user_id)
 */

// GET /album-listens - obtener todos los registros
router.get("/", async (req, res) => {
  try {
    const listens = await readJson(GENRE_LISTENS_FILE);
    res.json(listens);
  } catch (error) {
    console.error("Error al leer album-listens:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// GET /album-listens/:album_id/:user_id - obtener un registro por (album_id, user_id)
router.get("/:album_id/:user_id", async (req, res) => {
  try {
    const listens = await readJson(GENRE_LISTENS_FILE);
    const album_id = Number(req.params.album_id);
    const user_id = Number(req.params.user_id);

    const listen = listens.find(
      (l) => l.album_id === album_id && l.user_id === user_id
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
    const { album_id, user_id, times_listened, rating } = req.body;

    // Campos obligatorios según tu formato (rating lo podemos considerar opcional)
    if (
      album_id === undefined ||
      user_id === undefined ||
      times_listened === undefined
    ) {
      return res.status(400).json({
        error:
          "Faltan campos obligatorios. Se espera: album_id, user_id, times_listened (rating es opcional)"
      });
    }

    const listens = await readJson(GENRE_LISTENS_FILE);

    // Evitamos duplicar la combinación (album_id, user_id)
    if (
      listens.some(
        (l) => l.album_id === album_id && l.user_id === user_id
      )
    ) {
      return res.status(409).json({
        error:
          "Ya existe un registro para ese album_id y user_id"
      });
    }

    const newListen = {
      album_id,
      user_id,
      times_listened,
      // rating puede venir o no en el body
      ...(rating !== undefined ? { rating } : {})
    };

    listens.push(newListen);
    await writeJson(GENRE_LISTENS_FILE, listens);

    res.status(201).json(newListen);
  } catch (error) {
    console.error("Error al crear album-listen:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// PATCH /album-listens/:album_id/:user_id - actualizar parcialmente un registro
router.patch("/:album_id/:user_id", async (req, res) => {
  try {
    const album_id = Number(req.params.album_id);
    const user_id = Number(req.params.user_id);
    const updates = req.body;

    const listens = await readJson(GENRE_LISTENS_FILE);
    const index = listens.findIndex(
      (l) => l.album_id === album_id && l.user_id === user_id
    );

    if (index === -1) {
      return res.status(404).json({ error: "Registro no encontrado" });
    }

    // No permitimos cambiar album_id ni user_id por simplicidad
    const { album_id: _ignoreAlbum_id, user_id: _ignoreUser_id, ...restUpdates } =
      updates;

    const updatedListen = {
      ...listens[index],
      ...restUpdates
      // Permitimos actualizar times_listened y rating principalmente
    };

    listens[index] = updatedListen;
    await writeJson(GENRE_LISTENS_FILE, listens);

    res.json(updatedListen);
  } catch (error) {
    console.error("Error al actualizar album-listen:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

export default router;
