"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [mahasiswa, setMahasiswa] = useState<any[]>([]);
  const [prodiList, setProdiList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [formData, setFormData] = useState({
    nim: "",
    nama: "",
    prodi_id: "",
    angkatan: 2024,
  });

  const [editId, setEditId] = useState<number | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);

      const res = await fetch("http://localhost:3000/api/mahasiswa");
      const json = await res.json();

      setMahasiswa(json.data || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProdi = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/prodi");
      const json = await res.json();

      setProdiList(json.data || []);
    } catch (err) {
      console.log(err);
    }
  };

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
    const res = await fetch("http://localhost:3000/api/mahasiswa", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nim: formData.nim,
        nama: formData.nama,
        prodi_id: Number(formData.prodi_id),
        angkatan: Number(formData.angkatan),
      }),
    });

    const json = await res.json();

    if (res.ok) {
      setFormData({
        nim: "",
        nama: "",
        prodi_id: "",
        angkatan: 2024,
      });
      
      setEditId(null);
      
      await fetchData();

      alert(json.message);
    } else {
      alert(json.message);
    }

  } catch (err) {
    console.log(err);
    alert("Gagal menyimpan data");
  }
};

  const handleDelete = async (id: number) => {

  if (!confirm("Yakin ingin menghapus data?")) return;

  try {

    const res = await fetch(
      `http://localhost:3000/api/mahasiswa/${id}`,
      {
        method: "DELETE",
      }
    );

    const json = await res.json();

    if (res.ok) {

      await fetchData();

      alert(json.message);

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
    <main className="min-h-screen bg-gray-100 p-10">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-5xl font-bold mb-10">
          Data Akademik Mahasiswa
        </h1>

        {/* FORM */}

        <section className="bg-white rounded-xl shadow-lg p-6 mb-8">

          <h2 className="text-2xl font-bold mb-5">
            Tambah Mahasiswa
          </h2>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-5 gap-4"
          >

            <input
              className="border rounded p-3"
              placeholder="NIM"
              value={formData.nim}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  nim: e.target.value,
                })
              }
            />

            <input
              className="border rounded p-3"
              placeholder="Nama Mahasiswa"
              value={formData.nama}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  nama: e.target.value,
                })
              }
            />

            <select
              className="border rounded p-3"
              value={formData.prodi_id}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  prodi_id: e.target.value,
                })
              }
            >
              <option value="">
                Pilih Program Studi
              </option>

              {prodiList.map((item: any) => (
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
              className="border rounded p-3"
              value={formData.angkatan}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  angkatan: Number(e.target.value),
                })
              }
            />

<button
  type="submit"
  className="bg-blue-600 hover:bg-blue-700 text-white rounded font-bold"
>
  {editId ? "Update" : "Simpan"}
</button>

          </form>

        </section>

        {/* SEARCH */}

        <section className="bg-white rounded-xl shadow-lg p-6">

          <input
            className="border rounded p-3 w-full mb-6"
            placeholder="Cari Nama Mahasiswa..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

          {loading ? (
            <p>Loading...</p>
          ) : (
            <table className="w-full">

              <thead>

                <tr className="bg-blue-600 text-white">

                  <th className="p-3">NIM</th>
                  <th className="p-3">Nama</th>
                  <th className="p-3">Program Studi</th>
                  <th className="p-3">Angkatan</th>
                  <th className="p-3">Aksi</th>

                </tr>

              </thead>

              <tbody>

                {mahasiswa
                  .filter((item: any) =>
                    item.nama
                      .toLowerCase()
                      .includes(search.toLowerCase())
                  )
                  .map((item: any) => (

                    <tr
                      key={item.id}
                      className="border-b hover:bg-gray-100"
                    >

                      <td className="p-3">
                        {item.nim}
                      </td>

                      <td className="p-3">
                        {item.nama}
                      </td>

                      <td className="p-3">
                        {item.prodi}
                      </td>

                      <td className="p-3">
                        {item.angkatan}
                      </td>

                      <td className="p-3 flex gap-2">

  <button
    onClick={() => {
      setEditId(item.id);

      setFormData({
        nim: item.nim,
        nama: item.nama,
        prodi_id: String(item.prodi_id),
        angkatan: item.angkatan,
      });
    }}
    className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
  >
    Edit
  </button>

  <button
    onClick={() => handleDelete(item.id)}
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