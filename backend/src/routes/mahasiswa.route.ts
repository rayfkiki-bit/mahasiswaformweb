import { Router, Request, Response } from "express";
import db from "../config/database";

const router = Router();


router.get("/", async (_req: Request, res: Response) => {
  try {
    const [rows] = await db.query(`
      SELECT
        m.id,
        m.nim,
        m.nama,
        m.angkatan,
        m.prodi_id,
        p.nama_prodi AS prodi
      FROM mahasiswa m
      LEFT JOIN prodi p
        ON m.prodi_id = p.id
      ORDER BY m.id DESC
    `);

    res.json({
      message: "Data berhasil diambil",
      data: rows,
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal mengambil data",
      error,
    });
  }
});


router.get("/:id", async (req: Request, res: Response) => {
  const id = req.params.id;

  if (!id || Array.isArray(id)) {
    return res.status(400).json({
      message: "ID mahasiswa tidak valid",
    });
  }

  try {
    const [rows]: any = await db.execute(
      `
      SELECT
        m.id,
        m.nim,
        m.nama,
        m.angkatan,
        m.prodi_id,
        p.nama_prodi AS prodi
      FROM mahasiswa m
      LEFT JOIN prodi p
        ON m.prodi_id = p.id
      WHERE m.id = ?
      `,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message: "Mahasiswa tidak ditemukan",
      });
    }

    res.json({
      message: "Detail mahasiswa",
      data: rows[0],
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal mengambil detail",
      error,
    });
  }
});


router.post("/", async (req: Request, res: Response) => {
  const { nim, nama, prodi_id, angkatan } = req.body;

  if (!nim || !nama || !prodi_id || !angkatan) {
    return res.status(400).json({
      message: "Semua field wajib diisi",
    });
  }

  try {
    await db.execute(
      `
      INSERT INTO mahasiswa
      (nim, nama, prodi_id, angkatan)
      VALUES (?, ?, ?, ?)
      `,
      [nim, nama, prodi_id, angkatan]
    );

    res.status(201).json({
      message: "Mahasiswa berhasil ditambahkan",
    });
  } catch (error: any) {
    res.status(500).json({
      message: "Gagal menambah data",
      error: error.message,
    });
  }
});


router.put("/:id", async (req: Request, res: Response) => {
  const id = req.params.id;

  if (!id || Array.isArray(id)) {
    return res.status(400).json({
      message: "ID mahasiswa tidak valid",
    });
  }

  const { nim, nama, prodi_id, angkatan } = req.body;

  try {
    const [result]: any = await db.execute(
      `
      UPDATE mahasiswa
      SET
        nim = ?,
        nama = ?,
        prodi_id = ?,
        angkatan = ?
      WHERE id = ?
      `,
      [nim, nama, prodi_id, angkatan, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Data tidak ditemukan",
      });
    }

    res.json({
      message: "Data berhasil diupdate",
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal mengupdate",
      error,
    });
  }
});


router.delete("/:id", async (req: Request, res: Response) => {
  const id = req.params.id;

  if (!id || Array.isArray(id)) {
    return res.status(400).json({
      message: "ID mahasiswa tidak valid",
    });
  }

  try {
    const [result]: any = await db.execute(
      "DELETE FROM mahasiswa WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Data tidak ditemukan",
      });
    }

    res.json({
      message: "Data berhasil dihapus",
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal menghapus",
      error,
    });
  }
});

export default router;