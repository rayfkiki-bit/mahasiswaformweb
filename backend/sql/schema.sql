CREATE DATABASE IF NOT EXISTS mahasiswa_db;
USE mahasiswa_db;

CREATE TABLE IF NOT EXISTS mahasiswa (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nim VARCHAR(20) NOT NULL UNIQUE,
  nama VARCHAR(255) NOT NULL,
  prodi VARCHAR(255) NOT NULL,
  angkatan INT NOT NULL
);

-- sample seed
INSERT INTO mahasiswa (nim, nama, prodi, angkatan) VALUES
('2201001', 'Ahmad Fauzi', 'Informatika', 2022),
('2201002', 'Siti Aminah', 'Sistem Informasi', 2022);
