import { Router } from "express";
import {
  ALBUMS_FILE,
  readJson,
  writeJson
} from "../storage.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const albums = await readJson(ALBUMS_FILE);
    res.json(albums);
  } catch (error) {
    console.error("Error al leer albums:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

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
      return res.status(400).json({
        error:
          "Faltan campos obligatorios. Se espera: id, artist, album, year, duration_s"
      });
    }

    const albums = await readJson(ALBUMS_FILE);

    if (albums.some((a) => a.id === id)) {
      return res
        .status(409)
        .json({ error: "Ya existe un álbum con ese id" });
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

router.patch("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const updates = req.body;

    const albums = await readJson(ALBUMS_FILE);
    const index = albums.findIndex((a) => a.id === id);

    if (index === -1) {
      return res.status(404).json({ error: "Álbum no encontrado" });
    }

    const { id: _ignore, ...restUpdates } = updates;

    const updatedAlbum = {
      ...albums[index],
      ...restUpdates
    };

    albums[index] = updatedAlbum;

    await writeJson(ALBUMS_FILE, albums);
    res.json(updatedAlbum);
  } catch (error) {
    console.error("Error al actualizar álbum:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

export default router;
