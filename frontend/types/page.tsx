"use client";

import { useEffect, useState } from "react";

const API = "http://localhost:3000/api";

export default function Home() {
  const [mahasiswa, setMahasiswa] = useState<any[]>([]);
  const [prodiList, setProdiList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const [editId, setEditId] = useState<number | null>(null);

  const [foto, setFoto] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    nim: "",
    nama: "",
    prodi_id: "",
    angkatan: 2024,
  });

  // ===========================
  // GET DATA MAHASISWA
  // ===========================
  const fetchData = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${API}/mahasiswa`);
      const json = await res.json();

      setMahasiswa(json.data || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // ===========================
  // GET DATA PRODI
  // ===========================
  const fetchProdi = async () => {
    try {
      const res = await fetch(`${API}/prodi`);
      const json = await res.json();

      setProdiList(json.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  // ===========================
  // SIMPAN / UPDATE
  // ===========================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.nim ||
      !formData.nama ||
      !formData.prodi_id ||
      !formData.angkatan
    ) {
      alert("Semua field wajib diisi");
      return;
    }

    try {
      const data = new FormData();

      data.append("nim", formData.nim);
      data.append("nama", formData.nama);
      data.append("prodi_id", formData.prodi_id);
      data.append("angkatan", String(formData.angkatan));

      if (foto) {
        data.append("foto", foto);
      }

      const url = editId
        ? `${API}/mahasiswa/${editId}`
        : `${API}/mahasiswa`;

      const method = editId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        body: data,
      });

      const json = await res.json();

      if (res.ok) {
        alert(json.message);

        setFormData({
          nim: "",
          nama: "",
          prodi_id: "",
          angkatan: 2024,
        });

        setFoto(null);
        setEditId(null);

        fetchData();
      } else {
        alert(json.message);
      }
    } catch (err) {
      console.log(err);
      alert("Gagal menyimpan data");
    }
  };

  // ===========================
  // EDIT
  // ===========================
  const handleEdit = (item: any) => {
    setEditId(item.id);

    setFormData({
      nim: item.nim,
      nama: item.nama,
      prodi_id: String(item.prodi_id),
      angkatan: item.angkatan,
    });

    setFoto(null);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ===========================
  // DELETE
  // ===========================
  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus data?")) return;

    try {
      const res = await fetch(`${API}/mahasiswa/${id}`, {
        method: "DELETE",
      });

      const json = await res.json();

      if (res.ok) {
        alert(json.message);
        fetchData();
      } else {
        alert(json.message);
      }
    } catch (err) {
      console.log(err);
      alert("Gagal menghapus data");
    }
  };

  useEffect(() => {
    fetchData();
    fetchProdi();
  }, []);
  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">

        <h1 className="text-4xl font-bold mb-8">
          Manajemen Mahasiswa
        </h1>

        {/* FORM */}

        <section className="bg-white rounded-xl shadow-lg p-6 mb-8">

          <h2 className="text-2xl font-semibold mb-6">
            {editId ? "Edit Mahasiswa" : "Tambah Mahasiswa"}
          </h2>

          <form
            onSubmit={handleSubmit}
            className="grid md:grid-cols-6 gap-4"
          >

            <input
              className="border rounded-lg p-3"
              placeholder="NIM"
              value={formData.nim}
              onChange={(e)=>
                setFormData({
                  ...formData,
                  nim:e.target.value
                })
              }
            />

            <input
              className="border rounded-lg p-3"
              placeholder="Nama Mahasiswa"
              value={formData.nama}
              onChange={(e)=>
                setFormData({
                  ...formData,
                  nama:e.target.value
                })
              }
            />

            <select
              className="border rounded-lg p-3"
              value={formData.prodi_id}
              onChange={(e)=>
                setFormData({
                  ...formData,
                  prodi_id:e.target.value
                })
              }
            >

              <option value="">
                Pilih Program Studi
              </option>

              {prodiList.map((item:any)=>(
                <option
                  key={item.id}
                  value={item.id}
                >
                  {item.nama_prodi}
                </option>
              ))}

            </select>

            <input
              type="number"
              className="border rounded-lg p-3"
              value={formData.angkatan}
              onChange={(e)=>
                setFormData({
                  ...formData,
                  angkatan:Number(e.target.value)
                })
              }
            />

            <input
              type="file"
              accept="image/*"
              className="border rounded-lg p-2"
              onChange={(e)=>{
                if(e.target.files){
                  setFoto(e.target.files[0]);
                }
              }}
            />

            <button
              className="bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
              type="submit"
            >
              {editId ? "Update" : "Simpan"}
            </button>

          </form>

        </section>

        {/* SEARCH */}

        <section className="bg-white rounded-xl shadow-lg p-6">

          <input
            className="border rounded-lg p-3 w-full mb-6"
            placeholder="Cari mahasiswa..."
            value={search}
            onChange={(e)=>setSearch(e.target.value)}
          />

          {loading ? (

            <p>Loading...</p>

          ) : (

            <table className="w-full border-collapse">

              <thead>

                <tr className="bg-blue-600 text-white">

                  <th className="p-3">NIM</th>
                  <th className="p-3">Foto</th>
                  <th className="p-3">Nama</th>
                  <th className="p-3">Program Studi</th>
                  <th className="p-3">Angkatan</th>
                  <th className="p-3">Aksi</th>

                </tr>

              </thead>

              <tbody>

                {mahasiswa
                  .filter((m:any)=>
                    m.nama
                      .toLowerCase()
                      .includes(search.toLowerCase())
                  )
                  .map((m:any)=>(

                    <tr
                      key={m.id}
                      className="border-b hover:bg-gray-50"
                    >

                      <td className="p-3">
                        {m.nim}
                      </td>

                      <td className="p-3">

                        {m.foto ? (

                          <img
                            src={`http://localhost:3000/uploads/mahasiswa/${m.foto}`}
                            alt={m.nama}
                            className="w-16 h-16 rounded-full object-cover border"
                          />

                        ) : (

                          <span>Tidak ada</span>

                        )}

                      </td>

                      <td className="p-3">
                        {m.nama}
                      </td>

                      <td className="p-3">
                        {m.prodi}
                      </td>

                      <td className="p-3">
                        {m.angkatan}
                      </td>

                      <td className="p-3 flex gap-2">

                        <button
                          onClick={()=>handleEdit(m)}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
                        >
                          Edit
                        </button>

                        <button
                          onClick={()=>handleDelete(m.id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                        >
                          Hapus
                        </button>

                      </td>

                    </tr>

                  ))}

              </tbody>

            </table>

          )}

        </section>

      </div>
    </main>
  );
}