-- phpMyAdmin SQL Dump
-- version 4.8.3
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 26 Bulan Mei 2022 pada 11.31
-- Versi server: 10.1.37-MariaDB
-- Versi PHP: 7.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db_ptjulia`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `sequelizemeta`
--

CREATE TABLE `sequelizemeta` (
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data untuk tabel `sequelizemeta`
--

INSERT INTO `sequelizemeta` (`name`) VALUES
('20220324131445-create-tb-user.js'),
('20220324131828-create-tb-arep.js'),
('20220327100346-create-tb-laporan.js'),
('20220327104822-create-tb-catatan.js');

-- --------------------------------------------------------

--
-- Struktur dari tabel `tb_areps`
--

CREATE TABLE `tb_areps` (
  `id` int(11) NOT NULL,
  `id_user` varchar(255) DEFAULT NULL,
  `nik` varchar(255) DEFAULT NULL,
  `tempat_lahir` varchar(255) DEFAULT NULL,
  `tanggal_lahir` date DEFAULT NULL,
  `wilayah` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data untuk tabel `tb_areps`
--

INSERT INTO `tb_areps` (`id`, `id_user`, `nik`, `tempat_lahir`, `tanggal_lahir`, `wilayah`, `createdAt`, `updatedAt`) VALUES
(1, '2', '33221314453', 'Malangke', '1997-03-10', 'Gowa', '2022-03-29 14:40:32', '2022-05-24 20:41:35'),
(4, '9', '111222333444', 'Maros', '1997-05-30', 'Maros', '2022-04-10 16:05:51', '2022-05-24 21:04:49');

-- --------------------------------------------------------

--
-- Struktur dari tabel `tb_catatans`
--

CREATE TABLE `tb_catatans` (
  `id` int(11) NOT NULL,
  `id_laporan` varchar(255) DEFAULT NULL,
  `catatan` text,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Struktur dari tabel `tb_laporans`
--

CREATE TABLE `tb_laporans` (
  `id` int(11) NOT NULL,
  `id_arep` varchar(255) DEFAULT NULL,
  `judul` varchar(255) DEFAULT NULL,
  `file` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `koreksi` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data untuk tabel `tb_laporans`
--

INSERT INTO `tb_laporans` (`id`, `id_arep`, `judul`, `file`, `status`, `koreksi`, `createdAt`, `updatedAt`) VALUES
(1, '4', 'asdfsadfas', 'file-1649065940077.pdf', 'Revisi', 'fdgdfsadf sdfsdf asdf ', '2022-04-04 17:52:20', '2022-05-26 17:18:59'),
(2, '1', 'laporan 1', 'file-1650722728533.pdf', 'Pajak', 'Periksa kembali halaman 5', '2022-04-23 22:05:28', '2022-05-26 17:29:04'),
(3, '1', 'laporan 2', 'file-1650723629370.pdf', 'Pajak', '', '2022-04-23 22:20:29', '2022-04-23 22:20:29'),
(4, '1', 'laporan 3', 'file-1650723653372.pdf', 'Setuju', '', '2022-04-23 22:20:53', '2022-05-26 17:25:20'),
(5, '1', 'laporan 4', 'file-1650872169896.pdf', 'Baru', '', '2022-04-25 15:36:09', '2022-04-25 15:36:09'),
(6, '1', 'laporan 5', 'file-1650872234913.pdf', 'Baru', '', '2022-04-25 15:37:14', '2022-04-25 15:37:14'),
(7, '1', 'laporan 6', 'file-1650873128641.pdf', 'Baru', '', '2022-04-25 15:52:08', '2022-04-25 15:52:08'),
(8, '1', 'laporan 7', 'file-1650873443581.pdf', 'Baru', '', '2022-04-25 15:57:23', '2022-04-25 15:57:23');

-- --------------------------------------------------------

--
-- Struktur dari tabel `tb_users`
--

CREATE TABLE `tb_users` (
  `id` int(11) NOT NULL,
  `nama` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` varchar(255) DEFAULT NULL,
  `foto` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data untuk tabel `tb_users`
--

INSERT INTO `tb_users` (`id`, `nama`, `email`, `password`, `role`, `foto`, `createdAt`, `updatedAt`) VALUES
(1, 'Fajrul', 'fajrul@gmail.com', '123456', 'pimpinan', '3f5a1149-a7ca-4f3f-9e08-dababb33d8e2.jpg', '2022-03-28 15:02:47', '2022-05-26 17:29:39'),
(2, 'Fajrul Hidayat', 'fajrularep@gmail.com', '123456', 'arep', '391eaa7b-f58a-4f60-976e-12110d2ca891.png', '2022-03-29 14:40:32', '2022-05-24 20:41:35'),
(4, 'bambang', 'bambang@gmail.com', '123456', 'operator', '0ac02785-b033-4edd-b355-d638374fa779.jpg', '2022-04-08 23:21:34', '2022-05-24 21:33:37'),
(9, 'Fajrul', 'fajrulknight1@gmail.com', '123', 'arep', 'blankProfile.png', '2022-04-10 16:05:51', '2022-05-24 21:04:49');

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `sequelizemeta`
--
ALTER TABLE `sequelizemeta`
  ADD PRIMARY KEY (`name`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indeks untuk tabel `tb_areps`
--
ALTER TABLE `tb_areps`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `tb_catatans`
--
ALTER TABLE `tb_catatans`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `tb_laporans`
--
ALTER TABLE `tb_laporans`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `tb_users`
--
ALTER TABLE `tb_users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `tb_areps`
--
ALTER TABLE `tb_areps`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT untuk tabel `tb_catatans`
--
ALTER TABLE `tb_catatans`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `tb_laporans`
--
ALTER TABLE `tb_laporans`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT untuk tabel `tb_users`
--
ALTER TABLE `tb_users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
