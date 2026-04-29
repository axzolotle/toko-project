import * as SQLite from "expo-sqlite";

export const db = SQLite.openDatabaseSync("konter.db");

export type User = {
  id: number;
  uuid: string | null;
  nama: string;
  username: string;
  password: string;
  role: "admin" | "operator";
  synced: number;
  aktif: number;
};

export type Item = {
  id: number;
  uuid: string | null;
  nama: string;
  jenis: string;
  kategori: string;
  detail: string;
  harga_modal: number;
  harga_jual: number;
  quantity: number;
  aktif: number;
  synced: number;
  created_by: number;
};

export type Transaksi = {
  id: number;
  uuid: string | null;
  item_id: number;
  item_nama: string;
  item_jenis: string;
  item_kategori: string;
  item_detail: string;
  harga_jual: number;
  harga_modal: number;
  quantity: number;
  total: number;
  laba: number;
  tanggal: string;
  synced: number;
  operator_id: number;
};

export type Stok = {
  id: number;
  item_id: number;
  quantity: number;
  jenis: "masuk" | "keluar";
  keterangan: string;
  tanggal: string;
  synced: number;
  operator_id: number;
};

export type kas = {
  id: number;
  uuid: string | null;
  nama: string;
  jenis: string;
  keterangan: string;
  jumlah: number;
  tanggal: string;
  synced: number;
  operator_id: number;
};

export function initDB() {
  db.execSync(
    "CREATE TABLE IF NOT EXISTS users (" +
      "  id          INTEGER PRIMARY KEY AUTOINCREMENT," +
      "  uuid        TEXT," +
      "  nama        TEXT NOT NULL," +
      "  username    TEXT NOT NULL UNIQUE," +
      "  password    TEXT NOT NULL," +
      "  role        TEXT NOT NULL CHECK(role IN ('admin', 'operator'))," +
      "  aktif       INTEGER DEFAULT 1" +
      ")",
  );

  db.execSync(
    "CREATE TABLE IF NOT EXISTS items (" +
      "  id          INTEGER PRIMARY KEY AUTOINCREMENT," +
      "  uuid        TEXT," +
      "  nama        TEXT NOT NULL," +
      "  jenis       TEXT NOT NULL," +
      "  kategori    TEXT NOT NULL," +
      "  detail      TEXT DEFAULT ''," +
      "  harga_modal REAL NOT NULL DEFAULT 0," +
      "  harga_jual  REAL NOT NULL DEFAULT 0," +
      "  quantity    INTEGER NOT NULL DEFAULT 0," +
      "  aktif       INTEGER DEFAULT 1," +
      "  synced      INTEGER DEFAULT 0," +
      "  created_by  INTEGER NOT NULL" +
      ")",
  );

  db.execSync(
    "CREATE TABLE IF NOT EXISTS transaksi (" +
      "  id           INTEGER PRIMARY KEY AUTOINCREMENT," +
      "  uuid         TEXT," +
      "  item_id      INTEGER NOT NULL," +
      "  item_nama    TEXT NOT NULL," +
      "  item_jenis   TEXT NOT NULL," +
      "  item_kategori TEXT NOT NULL," +
      "  item_detail   TEXT NOT NULL," +
      "  harga_jual   REAL NOT NULL," +
      "  harga_modal  REAL NOT NULL," +
      "  quantity     INTEGER NOT NULL DEFAULT 1," +
      "  total        REAL NOT NULL," +
      "  laba         REAL NOT NULL," +
      "  tanggal      TEXT NOT NULL," +
      "  synced       INTEGER DEFAULT 0," +
      "  operator_id  INTEGER NOT NULL" +
      ")",
  );

  db.execSync(
    "CREATE TABLE IF NOT EXISTS stok (" +
      "  id           INTEGER PRIMARY KEY AUTOINCREMENT," +
      "  item_id      INTEGER NOT NULL," +
      "  quantity      INTEGER NOT NULL," +
      "  jenis         TEXT NOT NULL CHECK(jenis IN ('masuk', 'keluar'))," +
      "  keterangan     TEXT DEFAULT ''," +
      "  tanggal        TEXT NOT NULL," +
      "  operator_id    INTEGER NOT NULL" +
      ")",
  );

  db.execSync(
    "CREATE TABLE IF NOT EXISTS kas (" +
      "  id           INTEGER PRIMARY KEY AUTOINCREMENT," +
      "  uuid         TEXT," +
      "  nama         TEXT NOT NULL," +
      "jenis        TEXT NOT NULL," +
      "keterangan    TEXT DEFAULT ''," +
      "jumlah        REAL NOT NULL," +
      "tanggal       TEXT NOT NULL," +
      "operator_id   INTEGER NOT NULL" +
      ")",
  );
}

export function createItem(
  nama: string,
  jenis: string,
  kategori: string,
  detail: string,
  harga_modal: number,
  harga_jual: number,
  quantity: number,
  created_by: number,
): number {
  const result = db.runSync(
    "INSERT INTO items (nama, jenis, kategori, detail, harga_modal, harga_jual, quantity, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [
      nama,
      jenis,
      kategori,
      detail,
      harga_modal,
      harga_jual,
      quantity,
      created_by,
    ],
  );
  return result.lastInsertRowId;
}

export function catatTransaksi(
  item: Item,
  quantity: number,
  operator_id: number,
): number {
  const total = item.harga_jual * quantity;
  const laba = (item.harga_jual - item.harga_modal) * quantity;
  const tanggal = new Date().toISOString();

  const result = db.runSync(
    "INSERT INTO transaksi (item_id, item_nama, item_jenis, item_kategori, item_detail, harga_jual, harga_modal, quantity, total, laba, tanggal, operator_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [
      item.id,
      item.nama,
      item.jenis,
      item.kategori,
      item.detail,
      item.harga_jual,
      item.harga_modal,
      quantity,
      total,
      laba,
      tanggal,
      operator_id,
    ],
  );
  return result.lastInsertRowId;
}

export function createKas(
  nama: string,
  jenis: string,
  keterangan: string,
  jumlah: number,
  operator_id: number,
): number {
  const tanggal = new Date().toISOString();
  const result = db.runSync(
    "INSERT INTO kas (nama, jenis, keterangan, jumlah, tanggal, operator_id) VALUES (?, ?, ?, ?, ?, ?)",
    [nama, jenis, keterangan, jumlah, tanggal, operator_id],
  );
  return result.lastInsertRowId;
}

export function createUser(
  nama: string,
  username: string,
  password: string,
  role: "admin" | "operator",
): number {
  const result = db.runSync(
    "INSERT INTO users (nama, username, password, role) VALUES (?, ?, ?, ?)",
    [nama, username, password, role],
  );
  return result.lastInsertRowId;
}

export function createStok(
  item_id: number,
  quantity: number,
  jenis: "masuk" | "keluar",
  keterangan: string,
  operator_id: number,
): number {
  const tanggal = new Date().toISOString();
  const result = db.runSync(
    "INSERT INTO stok (item_id, quantity, jenis, keterangan, tanggal, operator_id) VALUES (?, ?, ?, ?, ?, ?)",
    [item_id, quantity, jenis, keterangan, tanggal, operator_id],
  );
  return result.lastInsertRowId;
}

export function updateItem(
  id: number,
  nama: string,
  jenis: string,
  kategori: string,
  detail: string,
  harga_modal: number,
  harga_jual: number,
  quantity: number,
) {
  db.runSync(
    "UPDATE items SET nama=?, jenis=?, kategori=?, detail=?, harga_modal=?, harga_jual=?, quantity=?, synced=0 WHERE id=?",
    [nama, jenis, kategori, detail, harga_modal, harga_jual, quantity, id],
  );
}

export function getAllItems(): Item[] {
  const result = db.getAllSync("SELECT * FROM items WHERE aktif = 1");
  return result as Item[];
}

export function getJenisItems(): string[] {
  const result = db.getAllSync(
    "SELECT DISTINCT jenis FROM items WHERE aktif = 1",
  );
  return result.map((row: any) => row.jenis);
}

export function getKategoriItems(jenis: string): string[] {
  const result = db.getAllSync(
    "SELECT DISTINCT kategori FROM items WHERE aktif = 1 AND jenis = ?",
    [jenis],
  );
  return result.map((row: any) => row.kategori);
}

export function getItemByjenisandKategori(
  jenis: string,
  kategori: string,
): Item[] {
  const result = db.getAllSync(
    "SELECT * FROM items WHERE aktif = 1 AND jenis = ? AND kategori = ?",
    [jenis, kategori],
  );
  return result as Item[];
}

// export function getItemBykategori(jenis: string, kategori: string): Item[] {
//   const result = db.getAllSync(
//     "SELECT * FROM items WHERE aktif = 1 AND jenis = ? AND kategori = ?",
//     [jenis, kategori],
//   );
//   return result as Item[];
// }

export function getItemById(id: number): Item | null {
  const result = db.getFirstSync("SELECT * FROM items WHERE id = ?", [id]);
  return (result as Item) || null;
}

export function updateStok(
  item_id: number,
  quantity: number,
  jenis: "masuk" | "keluar",
) {
  if (jenis === "masuk") {
    db.runSync("UPDATE items SET quantity = quantity + ? WHERE id = ?", [
      quantity,
      item_id,
    ]);
  } else {
    db.runSync("UPDATE items SET quantity = quantity - ? WHERE id = ?", [
      quantity,
      item_id,
    ]);
  }
}

export function deleteItem(id: number) {
  db.runSync("UPDATE items SET aktif=0, synced=0 WHERE id=?", [id]);
}

export function getTransaksiHarian(tanggal: string): Transaksi[] {
  const result = db.getAllSync(
    "SELECT * FROM transaksi WHERE tanggal LIKE ? ORDER BY tanggal DESC",
    [`${tanggal}%`],
  );
  return result as Transaksi[];
}

export function getRingkasanHarian(tanggal: string) {
  const result = db.getFirstSync(
    "SELECT COUNT(*) AS total_transaksi, SUM(total) AS total_omset, SUM(laba) AS total_laba FROM transaksi WHERE tanggal LIKE ?",
    [`${tanggal}%`],
  );
  return {
    total_transaksi: (result as any).total_transaksi || 0,
    total_omset: (result as any).total_omset || 0,
    total_laba: (result as any).total_laba || 0,
  };
}

export function getAllUsers(): User[] {
  const result = db.getAllSync("SELECT * FROM users WHERE aktif = 1");
  return result as User[];
}

export function getAllKas(): kas[] {
  const result = db.getAllSync("SELECT * FROM kas");
  return result as kas[];
}

export function getAllTransaksi(): Transaksi[] {
  const result = db.getAllSync("SELECT * FROM transaksi");
  return result as Transaksi[];
}

export function getAllStok(): Stok[] {
  const result = db.getAllSync("SELECT * FROM stok");
  return result as Stok[];
}
