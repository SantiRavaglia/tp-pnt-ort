import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    // Cambiá la URI por la de tu MongoDB local o Atlas
    const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/music_db";

    await mongoose.connect(uri, {
      // useNewUrlParser y useUnifiedTopology ya no son necesarios en mongoose >= 6
    });

    console.log("Conectado a MongoDB");
  } catch (error) {
    console.error("Error conectando a MongoDB:", error.message);
    process.exit(1);
  }
};
