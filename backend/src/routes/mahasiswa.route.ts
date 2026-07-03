import { Router, Request, Response } from "express";
import db from "../config/database";
import upload from "../middlewares/upload.middleware";
import fs from "fs";
import path from "path";

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
        m.foto,
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
        m.foto,
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


router.post(
  "/",
  upload.single("foto"),
  async (req: Request, res: Response) => {
    const { nim, nama, prodi_id, angkatan } = req.body;
    const foto = req.file ? req.file.filename : null;

    if (!nim || !nama || !prodi_id || !angkatan) {
      return res.status(400).json({
        message: "Semua field wajib diisi",
      });
    }

    try {
      
      await db.execute(
        `
      INSERT INTO mahasiswa
      (nim, nama, prodi_id, angkatan, foto)
      VALUES (?, ?, ?, ?, ?)
      `,
        [nim, nama, prodi_id, angkatan, foto]
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
  }
);


router.put(
  "/:id",
  upload.single("foto"),
  async (req: Request, res: Response) => {

    const id = req.params.id;

    if (!id || Array.isArray(id)) {
      return res.status(400).json({
        message: "ID mahasiswa tidak valid",
      });
    }

    const { nim, nama, prodi_id, angkatan } = req.body;

    const fotoBaru = req.file ? req.file.filename : null;

    try {

      const [lama]: any = await db.execute(
        "SELECT foto FROM mahasiswa WHERE id = ?",
        [id]
      );

      let namaFoto = lama[0]?.foto;

      if (fotoBaru) {

        if (namaFoto) {

          const lokasi = path.join(
            __dirname,
            "../../uploads/mahasiswa",
            namaFoto
          );

          if (fs.existsSync(lokasi)) {
            fs.unlinkSync(lokasi);
          }

        }

        namaFoto = fotoBaru;

      }

      const [result]: any = await db.execute(
        `
        UPDATE mahasiswa
        SET
          nim = ?,
          nama = ?,
          prodi_id = ?,
          angkatan = ?,
          foto = ?
        WHERE id = ?
        `,
        [
          nim,
          nama,
          prodi_id,
          angkatan,
          namaFoto,
          id,
        ]
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

  }
);


router.delete("/:id", async (req: Request, res: Response) => {

  const id = req.params.id;

  if (!id || Array.isArray(id)) {
    return res.status(400).json({
      message: "ID mahasiswa tidak valid",
    });
  }

  try {

    const [rows]: any = await db.execute(
      "SELECT foto FROM mahasiswa WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message: "Data tidak ditemukan",
      });
    }

    const foto = rows[0].foto;

    if (foto) {

      const lokasi = path.join(
        __dirname,
        "../../uploads/mahasiswa",
        foto
      );

      if (fs.existsSync(lokasi)) {
        fs.unlinkSync(lokasi);
      }

    }

    await db.execute(
      "DELETE FROM mahasiswa WHERE id = ?",
      [id]
    );

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