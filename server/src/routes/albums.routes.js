import { Router } from "express";
import { ALBUMS_FILE, readJson, writeJson } from "../storage.js";

const router = Router();

// GET /albums - obtener todos los álbumes
router.get("/", async (req, res) => {
  try {
    const albums = await readJson(ALBUMS_FILE);
    res.json(albums);
  } catch (error) {
    console.error("Error al leer albums:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// GET /albums/:id - obtener álbum por id lógico (numérico)
router.get("/:id", async (req, res) => {
  try {
    const albums = await readJson(ALBUMS_FILE);
    const id = Number(req.params.id);
    const album = albums.find((a) => a.id === id);

    if (!album) {
      return res.status(404).json({ error: "Álbum no encontrado" });
    }

    res.json(album);
  } catch (error) {
    console.error("Error al leer album:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// POST /albums - crear un álbum nuevo
router.post("/", async (req, res) => {
  try {
    const { id, artist, album, year, duration_s } = req.body;

    if (
      id === undefined ||
      !artist ||
      !album ||
      year === undefined ||
      duration_s === undefined
    ) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    const albums = await readJson(ALBUMS_FILE);

    if (albums.some((a) => a.id === id)) {
      return res.status(409).json({ error: "Ya existe un álbum con ese id" });
    }

    const newAlbum = { id, artist, album, year, duration_s };
    albums.push(newAlbum);
    await writeJson(ALBUMS_FILE, albums);

    res.status(201).json(newAlbum);
  } catch (error) {
    console.error("Error al crear álbum:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// PATCH /albums/:id - actualizar parcialmente un álbum
router.patch("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const updates = req.body;

    const albums = await readJson(ALBUMS_FILE);
    const index = albums.findIndex((a) => a.id === id);

    if (index === -1) {
      return res.status(404).json({ error: "Álbum no encontrado" });
    }

    // No permitimos cambiar el id desde el patch por simplicidad
    const { id: _ignore, ...restUpdates } = updates;

    const updatedAlbum = { ...albums[index], ...restUpdates };
    albums[index] = updatedAlbum;

    await writeJson(ALBUMS_FILE, albums);
    res.json(updatedAlbum);
  } catch (error) {
    console.error("Error al actualizar álbum:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

export default router;
