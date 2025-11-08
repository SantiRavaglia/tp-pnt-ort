import { Router } from "express";
import {
  ALBUM_LISTENS_FILE,
  readJson,
  writeJson
} from "../storage.js";

const router = Router();

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

// GET /album-listens/:id - obtener registro por id lógico (string, ej 't1')
router.get("/:id", async (req, res) => {
  try {
    const listens = await readJson(ALBUM_LISTENS_FILE);
    const { id } = req.params;
    const listen = listens.find((l) => l.id === id);

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
    const { id, name, time_listened_s, artists } = req.body;

    if (
      !id ||
      !name ||
      time_listened_s === undefined ||
      !Array.isArray(artists) ||
      artists.length === 0
    ) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    const listens = await readJson(ALBUM_LISTENS_FILE);

    if (listens.some((l) => l.id === id)) {
      return res
        .status(409)
        .json({ error: "Ya existe un registro con ese id" });
    }

    const newListen = { id, name, time_listened_s, artists };
    listens.push(newListen);

    await writeJson(ALBUM_LISTENS_FILE, listens);
    res.status(201).json(newListen);
  } catch (error) {
    console.error("Error al crear album-listen:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// PATCH /album-listens/:id - actualizar parcialmente el registro
router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const listens = await readJson(ALBUM_LISTENS_FILE);
    const index = listens.findIndex((l) => l.id === id);

    if (index === -1) {
      return res.status(404).json({ error: "Registro no encontrado" });
    }

    // No permitimos cambiar el id desde el patch por simplicidad
    const { id: _ignore, ...restUpdates } = updates;

    const updatedListen = { ...listens[index], ...restUpdates };
    listens[index] = updatedListen;

    await writeJson(ALBUM_LISTENS_FILE, listens);
    res.json(updatedListen);
  } catch (error) {
    console.error("Error al actualizar album-listen:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

export default router;
