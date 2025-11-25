import { Router } from "express";
import {
  GENRE_LISTENS_FILE,
  readJson,
  writeJson
} from "../storage.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const listens = await readJson(GENRE_LISTENS_FILE);
    console.log(listens);
    res.json(listens);
  } catch (error) {
    console.error("Error al leer album-listens:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

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

router.post("/", async (req, res) => {
  try {
    const { album_id, user_id, times_listened, rating } = req.body;

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

    const { album_id: _ignoreAlbum_id, user_id: _ignoreUser_id, ...restUpdates } =
      updates;

    const updatedListen = {
      ...listens[index],
      ...restUpdates
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
