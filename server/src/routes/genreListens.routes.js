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
 *     "genreId": 19,
 *     "albums_listened": 7,
 *   },
 *   ...
 * ]
 *
 * Clave lógica: (albumId, user_id)
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

// GET /album-listens/:albumId/:userId - obtener un registro por (albumId, user_id)
router.get("/:albumId/:userId", async (req, res) => {
  try {
    const listens = await readJson(GENRE_LISTENS_FILE);
    const albumId = Number(req.params.albumId);
    const userId = Number(req.params.userId);

    const listen = listens.find(
      (l) => l.albumId === albumId && l.user_id === userId
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
    const { albumId, user_id, times_listened, rating } = req.body;

    // Campos obligatorios según tu formato (rating lo podemos considerar opcional)
    if (
      albumId === undefined ||
      user_id === undefined ||
      times_listened === undefined
    ) {
      return res.status(400).json({
        error:
          "Faltan campos obligatorios. Se espera: albumId, user_id, times_listened (rating es opcional)"
      });
    }

    const listens = await readJson(GENRE_LISTENS_FILE);

    // Evitamos duplicar la combinación (albumId, user_id)
    if (
      listens.some(
        (l) => l.albumId === albumId && l.user_id === user_id
      )
    ) {
      return res.status(409).json({
        error:
          "Ya existe un registro para ese albumId y user_id"
      });
    }

    const newListen = {
      albumId,
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

// PATCH /album-listens/:albumId/:userId - actualizar parcialmente un registro
router.patch("/:albumId/:userId", async (req, res) => {
  try {
    const albumId = Number(req.params.albumId);
    const userId = Number(req.params.userId);
    const updates = req.body;

    const listens = await readJson(GENRE_LISTENS_FILE);
    const index = listens.findIndex(
      (l) => l.albumId === albumId && l.user_id === userId
    );

    if (index === -1) {
      return res.status(404).json({ error: "Registro no encontrado" });
    }

    // No permitimos cambiar albumId ni user_id por simplicidad
    const { albumId: _ignoreAlbumId, user_id: _ignoreUserId, ...restUpdates } =
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
