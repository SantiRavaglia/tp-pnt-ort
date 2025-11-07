import mongoose from "mongoose";

const albumSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true }, // id lógico
    artist: { type: String, required: true },
    album: { type: String, required: true },
    year: { type: Number, required: true },
    duration_s: { type: Number, required: true }
  },
  {
    timestamps: true,
    collection: "albums"
  }
);

export const Album = mongoose.model("Album", albumSchema);
