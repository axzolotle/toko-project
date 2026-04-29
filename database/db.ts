import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabaseSync("toko.db");

export type Barang = {
  id: number;
  uuid: string | null;
  nama: string;
  detail: string;
  jenis: string;
  harga_modal: number;
  harga_jual: number;
  aktif: number;
  synced: number;
};

export type Transaksi = {
  id: number;
  uuid: string | null;
  barang_id: number;
  barang_nama: string;
  barang_jenis: string;
  jumlah: number;
  harga_jual: number;
  harga_modal: number;
  total: number;
  laba: number;
  tanggal: string;
  synced: number;
};

export type RingkasanHarian = {
  total_transaksi: number;
  total_omset: number;
  total_laba: number;
};

// FIX: Pisah per execSync agar tidak error di expo-sqlite v14+
export function initDatabase() {
  db.execSync(
    "CREATE TABLE IF NOT EXISTS barang (" +
      "  id          INTEGER PRIMARY KEY AUTOINCREMENT," +
      "  uuid        TEXT," +
      "  nama        TEXT NOT NULL," +
      '  detail      TEXT DEFAULT "",' +
      "  jenis       TEXT NOT NULL," +
      "  harga_modal REAL NOT NULL DEFAULT 0," +
      "  harga_jual  REAL NOT NULL DEFAULT 0," +
      "  aktif       INTEGER DEFAULT 1," +
      "  synced      INTEGER DEFAULT 0" +
      ")",
  );

  db.execSync(
    "CREATE TABLE IF NOT EXISTS transaksi (" +
      "  id           INTEGER PRIMARY KEY AUTOINCREMENT," +
      "  uuid         TEXT," +
      "  barang_id    INTEGER NOT NULL," +
      "  barang_nama  TEXT NOT NULL," +
      "  barang_jenis TEXT NOT NULL," +
      "  jumlah       INTEGER NOT NULL DEFAULT 1," +
      "  harga_jual   REAL NOT NULL," +
      "  harga_modal  REAL NOT NULL," +
      "  total        REAL NOT NULL," +
      "  laba         REAL NOT NULL," +
      "  tanggal      TEXT NOT NULL," +
      "  synced       INTEGER DEFAULT 0," +
      "  FOREIGN KEY (barang_id) REFERENCES barang(id)" +
      ")",
  );
}

export function getAllBarang(): Barang[] {
  return db.getAllSync<Barang>(
    "SELECT * FROM barang WHERE aktif = 1 ORDER BY jenis, nama",
  );
}

export function getBarangByJenis(jenis: string): Barang[] {
  return db.getAllSync<Barang>(
    "SELECT * FROM barang WHERE aktif = 1 AND jenis = ? ORDER BY nama",
    [jenis],
  );
}

export function getJenisBarang(): string[] {
  const rows = db.getAllSync<{ jenis: string }>(
    "SELECT DISTINCT jenis FROM barang WHERE aktif = 1 ORDER BY jenis",
  );
  return rows.map((r) => r.jenis);
}

export function getBarangById(id: number): Barang | null {
  return (
    db.getFirstSync<Barang>("SELECT * FROM barang WHERE id = ?", [id]) ?? null
  );
}

export function createBarang(
  nama: string,
  detail: string,
  jenis: string,
  harga_modal: number,
  harga_jual: number,
): number {
  const result = db.runSync(
    "INSERT INTO barang (nama, detail, jenis, harga_modal, harga_jual) VALUES (?, ?, ?, ?, ?)",
    [nama, detail, jenis, harga_modal, harga_jual],
  );
  return result.lastInsertRowId;
}

export function updateBarang(
  id: number,
  nama: string,
  detail: string,
  jenis: string,
  harga_modal: number,
  harga_jual: number,
) {
  db.runSync(
    "UPDATE barang SET nama=?, detail=?, jenis=?, harga_modal=?, harga_jual=?, synced=0 WHERE id=?",
    [nama, detail, jenis, harga_modal, harga_jual, id],
  );
}

export function deleteBarang(id: number) {
  db.runSync("UPDATE barang SET aktif=0, synced=0 WHERE id=?", [id]);
}

export function catatTransaksi(barang: Barang, jumlah: number = 1): number {
  const tanggal = new Date().toISOString().slice(0, 10);
  const total = barang.harga_jual * jumlah;
  const laba = (barang.harga_jual - barang.harga_modal) * jumlah;
  const result = db.runSync(
    "INSERT INTO transaksi (barang_id,barang_nama,barang_jenis,jumlah,harga_jual,harga_modal,total,laba,tanggal) VALUES (?,?,?,?,?,?,?,?,?)",
    [
      barang.id,
      barang.nama,
      barang.jenis,
      jumlah,
      barang.harga_jual,
      barang.harga_modal,
      total,
      laba,
      tanggal,
    ],
  );
  return result.lastInsertRowId;
}

export function getTransaksiHarian(tanggal: string): Transaksi[] {
  return db.getAllSync<Transaksi>(
    "SELECT * FROM transaksi WHERE tanggal = ? ORDER BY id DESC",
    [tanggal],
  );
}

export function getRingkasanHarian(tanggal: string): RingkasanHarian {
  const row = db.getFirstSync<RingkasanHarian>(
    "SELECT COUNT(*) AS total_transaksi, SUM(total) AS total_omset, SUM(laba) AS total_laba FROM transaksi WHERE tanggal = ?",
    [tanggal],
  );
  return row ?? { total_transaksi: 0, total_omset: 0, total_laba: 0 };
}

export function getUnsyncedBarang(): Barang[] {
  return db.getAllSync<Barang>("SELECT * FROM barang WHERE synced = 0");
}

export function getUnsyncedTransaksi(): Transaksi[] {
  return db.getAllSync<Transaksi>("SELECT * FROM transaksi WHERE synced = 0");
}

export function markBarangSynced(id: number, uuid: string) {
  db.runSync("UPDATE barang SET synced=1, uuid=? WHERE id=?", [uuid, id]);
}

export function markTransaksiSynced(id: number, uuid: string) {
  db.runSync("UPDATE transaksi SET synced=1, uuid=? WHERE id=?", [uuid, id]);
}
