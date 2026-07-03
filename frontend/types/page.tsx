"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [mahasiswa, setMahasiswa] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ nim: "", nama: "", prodi: "", angkatan: 2024 });

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:3000/api/mahasiswa");
      const json = await res.json();
      setMahasiswa(json.data);
    } catch (err) {
      console.error("Gagal ambil data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("http://localhost:3000/api/mahasiswa", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    if (res.ok) {
      setFormData({ nim: "", nama: "", prodi: "", angkatan: 2024 });
      fetchData();
    } else {
      alert("Gagal simpan data, cek terminal backend!");
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Hapus data ini?")) {
      await fetch(`http://localhost:3000/api/mahasiswa/${id}`, { method: "DELETE" });
      fetchData();
    }
  };

  useEffect(() => { fetchData(); }, []);

  return (
    <main className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Manajemen Mahasiswa</h1>

      {/* Form Input */}
      <form onSubmit={handleSubmit} className="bg-gray-100 p-4 rounded mb-6 grid grid-cols-2 gap-4">
        <input className="border p-2" placeholder="NIM" value={formData.nim} onChange={e => setFormData({...formData, nim: e.target.value})} required />
        <input className="border p-2" placeholder="Nama" value={formData.nama} onChange={e => setFormData({...formData, nama: e.target.value})} required />
        <input className="border p-2" placeholder="Prodi" value={formData.prodi} onChange={e => setFormData({...formData, prodi: e.target.value})} required />
        <input type="number" className="border p-2" placeholder="Angkatan" value={formData.angkatan} onChange={e => setFormData({...formData, angkatan: parseInt(e.target.value)})} required />
        <button type="submit" className="col-span-2 bg-blue-500 text-white p-2 rounded">Simpan Data</button>
      </form>

      {/* Tabel Data */}
      {loading ? <p>Memuat...</p> : (
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">NIM</th>
              <th className="border p-2">Nama</th>
              <th className="border p-2">Prodi</th>
              <th className="border p-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {mahasiswa?.map((m: any) => (
              <tr key={m.id} className="text-center">
                <td className="border p-2">{m.nim}</td>
                <td className="border p-2">{m.nama}</td>
                <td className="border p-2">{m.prodi}</td>
                <td className="border p-2">
                  <button onClick={() => handleDelete(m.id)} className="text-red-500">Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}