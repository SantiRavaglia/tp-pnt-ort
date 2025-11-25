import express from "express";
import morgan from "morgan";
import cors from "cors";

import albumsRouter from "./routes/albums.routes.js";
import albumListensRouter from "./routes/albumListens.routes.js";
import genresRouter from "./routes/genres.routes.js";
import genreListensRouter from "./routes/genreListens.routes.js";
import { initStorage } from "./storage.js";
import songsRouter from './routes/songs.routes.js'

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

await initStorage();

app.use("/albums", albumsRouter);
app.use("/album-listens", albumListensRouter);
app.use("/genres", genresRouter);
app.use("/genre-listens", genreListensRouter);
app.use('/songs', songsRouter)

app.get("/", (req, res) => {
  res.json({ message: "API de música usando filesystem 🎧" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor escuchando en http://localhost:${PORT}`);
});
