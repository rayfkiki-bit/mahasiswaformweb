import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

// If DB_HOST is not set we provide an in-memory fallback so the app
// can run without a MySQL server during development.
const useFallback = !process.env.DB_HOST;

let db: any;

if (!useFallback) {
  db = mysql.createPool({
    host: process.env.DB_HOST ?? "localhost",
    user: process.env.DB_USER ?? "root",
    password: process.env.DB_PASSWORD ?? "",
    database: process.env.DB_NAME ?? "mahasiswa_db",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });
} else {
  console.warn("DB_HOST not set — using in-memory fallback database (no MySQL required)");

  type Row = { id: number; nim: string; nama: string; prodi: string; angkatan: number };
  const data: Row[] = [
    { id: 1, nim: "2201001", nama: "Ahmad Fauzi", prodi: "Informatika", angkatan: 2022 },
    { id: 2, nim: "2201002", nama: "Siti Aminah", prodi: "Sistem Informasi", angkatan: 2022 },
  ];

  db = {
    // SELECT queries
    query: async (_sql: string) => {
      return [data, []] as any;
    },
    // execute for insert/update/delete
    execute: async (sql: string, params?: any[]) => {
      const s = sql.trim().toLowerCase();
      if (s.startsWith("insert")) {
        const id = data.length ? data[data.length - 1]!.id + 1 : 1;
        const [nim, nama, prodi, angkatan] = params ?? [];
        const item: any = { id, nim, nama, prodi, angkatan };
        data.push(item);
        return [{ insertId: id, affectedRows: 1 }, []] as any;
      }

      if (s.startsWith("update")) {
        const id = params ? params[params.length - 1] : undefined;
        const item = data.find((d) => String(d.id) === String(id));
        if (!item) return [{ affectedRows: 0 }, []] as any;
        const p = params ?? [];
        item.nim = p[0];
        item.nama = p[1];
        item.prodi = p[2];
        item.angkatan = p[3];
        return [{ affectedRows: 1 }, []] as any;
      }

      if (s.startsWith("delete")) {
        const id = params ? params[0] : undefined;
        const idx = data.findIndex((d) => String(d.id) === String(id));
        if (idx === -1) return [{ affectedRows: 0 }, []] as any;
        data.splice(idx, 1);
        return [{ affectedRows: 1 }, []] as any;
      }

      // default
      return [[], []] as any;
    },
  };
}

export default db;
