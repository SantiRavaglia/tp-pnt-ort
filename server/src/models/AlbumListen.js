import mongoose from "mongoose";

const albumListenSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true }, // ej: 't1'
    name: { type: String, required: true }, // nombre del álbum
    time_listened_s: { type: Number, required: true }, // total de segundos escuchados
    artists: [
      {
        name: { type: String, required: true }
      }
    ]
  },
  {
    timestamps: true,
    collection: "album_listens"
  }
);

export const AlbumListen = mongoose.model("AlbumListen", albumListenSchema);
