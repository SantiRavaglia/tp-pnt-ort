import { Router } from "express";
import {
  ALBUM_LISTENS_FILE,
  readJson,
  writeJson
} from "../storage.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const listens = await readJson(ALBUM_LISTENS_FILE);
    res.json(listens);
  } catch (error) {
    console.error("Error al leer album-listens:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

router.get("/:album_id/:user_id", async (req, res) => {
  try {
    const listens = await readJson(ALBUM_LISTENS_FILE);
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

router.post("/", async (req, res) => {
  try {
    let { album_id, user_id, times_listened, rating } = req.body;

    album_id = Number(album_id);
    user_id = Number(user_id);

    if (Number.isNaN(album_id) || Number.isNaN(user_id)) {
      return res.status(400).json({
        error: "album_id y user_id deben ser numéricos"
      });
    }

    const listens = await readJson(ALBUM_LISTENS_FILE);

    const index = listens.findIndex(
      (l) => l.album_id === album_id && l.user_id === user_id
    );

    if (index !== -1) {
      const current = listens[index];

      const updatedListen = {
        ...current,
        times_listened: (current.times_listened || 0) + 1,
        ...(rating !== undefined ? { rating } : {})
      };

      listens[index] = updatedListen;
      await writeJson(ALBUM_LISTENS_FILE, listens);

      return res.status(200).json(updatedListen);
    }

    const newListen = {
      album_id,
      user_id,
      times_listened: times_listened ?? 1, 
      ...(rating !== undefined ? { rating } : {})
    };

    listens.push(newListen);
    await writeJson(ALBUM_LISTENS_FILE, listens);

    res.status(201).json(newListen);
  } catch (error) {
    console.error("Error al crear/actualizar album-listen:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

export default router;
