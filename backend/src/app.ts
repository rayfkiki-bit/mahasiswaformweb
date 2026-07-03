import express from "express";
import cors from "cors";
import path from "path";

import mahasiswaRoutes from "./routes/mahasiswa.route";
import prodiRoutes from "./routes/prodi.route";

const app = express();

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

app.use(
  "/uploads", express.static(path.join(__dirname, "../uploads")));

app.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "Backend API Mahasiswa Aktif",
    endpoints: {
      getMahasiswa: "/api/mahasiswa"
    }
  });
});

app.use("/api/mahasiswa", mahasiswaRoutes);
app.use("/api/prodi", prodiRoutes);

export default app;