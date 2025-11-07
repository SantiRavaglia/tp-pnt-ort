import express from "express";
import morgan from "morgan";
import cors from "cors";

import albumsRouter from "./routes/albums.routes.js";
import albumListensRouter from "./routes/albumListens.routes.js";
import { initStorage } from "./storage.js";

const app = express();

// Middlewares
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// Inicializar archivos JSON
await initStorage();

// Rutas
app.use("/albums", albumsRouter);
app.use("/album-listens", albumListensRouter);

app.get("/", (req, res) => {
  res.json({ message: "API de música usando filesystem 🎧" });
});

// Levantar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor escuchando en http://localhost:${PORT}`);
});
