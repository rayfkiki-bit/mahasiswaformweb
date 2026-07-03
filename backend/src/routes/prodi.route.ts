import { Router } from "express";
import db from "../config/database";

const router = Router();

// GET semua prodi
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT id, nama_prodi
      FROM prodi
      ORDER BY nama_prodi ASC
    `);

    res.json({
      message: "Data prodi berhasil diambil",
      data: rows,
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal mengambil data prodi",
      error,
    });
  }
});

export default router;