import * as SQLite from "expo-sqlite";
import uuid from "react-native-uuid";

export const db = SQLite.openDatabaseSync("konter.db");

const ensureColumn = (table: string, column: string, definition: string) => {
  const columns = db.getAllSync<{ name: string }>(`PRAGMA table_info(${table})`);
  const exists = columns.some((col) => col.name === column);

  if (!exists) {
    db.execSync(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`);
  }
};

const ensureKasSchema = () => {
  ensureColumn("kas", "item_id", "INTEGER");
  ensureColumn("kas", "keterangan", "TEXT DEFAULT ''");
  ensureColumn("kas", "jumlah", "REAL DEFAULT 0");
  ensureColumn("kas", "tanggal", "TEXT");
  ensureColumn("kas", "created_at", "TEXT");

  const now = new Date().toISOString();
  db.runSync(
    "UPDATE kas SET tanggal = COALESCE(tanggal, created_at, ?) WHERE tanggal IS NULL OR TRIM(tanggal) = ''",
    [now],
  );
  db.runSync(
    "UPDATE kas SET created_at = COALESCE(created_at, tanggal, ?) WHERE created_at IS NULL OR TRIM(created_at) = ''",
    [now],
  );
};

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
  uuid: string | null;
  item_id: number;
  quantity: number;
  jenis: "masuk" | "keluar";
  keterangan: string;
  harga_beli: number;
  tanggal: string;
  synced: number;
  operator_id: number;
};

export type kas = {
  id: number;
  uuid: string | null;
  item_id: number | null;
  nama: string;
  jenis: string;
  keterangan: string;
  jumlah: number;
  tanggal: string;
  created_at: string;
  synced: number;
  operator_id: number;
};

type HistoriJenis = "rekap_kas" | "operasional" | "kerugian";

interface RekapHarianRow {
  id: number;
  tanggal: string;
  omzet: number;
  hpp: number;
  laba_kotor: number;
  operasional: number;
  kerugian: number;
  laba_bersih: number;
  locked: number;
  created_by: number;
  created_at: string;
  synced?: number;
}

interface RekapKasRow {
  id: number;
  nama: string;
  kas_id: number | null;
  jumlah: number;
  tanggal: string;
  operator_id: number;
}

export interface HistoriItem {
  id: number;
  jenis: HistoriJenis;
  nama: string;
  deskripsi: string;
  nilai: number;
  waktu: string; // sekarang belum punya jam, jadi boleh "-" dulu
}

export interface HistoriGroup {
  tanggal: string;
  labelTanggal: string;
  terkunci: boolean;
  rekap: RekapHarianRow | null;
  items: HistoriItem[];
}

export type RekapKas = {
  id: number;
  uuid: string | null;
  nama: string;
  kas_id: number | null;
  jumlah: number;
  tanggal: string;
  synced: number;
  operator_id: number;
};

interface CreateRekapHarianParams {
  tanggal: string;
  omzet: number;
  hpp: number;
  labaKotor: number;
  operasional: number;
  kerugian: number;
  labaBersih: number;
  createdBy: number;
}

export function initDB() {
  db.execSync(
    "CREATE TABLE IF NOT EXISTS users (" +
      "  id          INTEGER PRIMARY KEY AUTOINCREMENT," +
      "  uuid        TEXT UNIQUE," +
      "  nama        TEXT NOT NULL," +
      "  username    TEXT NOT NULL UNIQUE," +
      "  password    TEXT NOT NULL," +
      "  role        TEXT NOT NULL CHECK(role IN ('admin', 'operator'))," +
      "  aktif       INTEGER DEFAULT 1," +
      "  synced      INTEGER DEFAULT 0" +
      ")",
  );

  db.execSync(
    "CREATE TABLE IF NOT EXISTS items (" +
      "  id          INTEGER PRIMARY KEY AUTOINCREMENT," +
      "  uuid        TEXT UNIQUE," +
      "  nama        TEXT NOT NULL," +
      "  jenis       TEXT NOT NULL," +
      "  kategori    TEXT NOT NULL," +
      "  detail      TEXT DEFAULT ''," +
      "  harga_modal REAL NOT NULL DEFAULT 0," +
      "  harga_jual  REAL NOT NULL DEFAULT 0," +
      "  quantity    INTEGER NOT NULL DEFAULT 0," +
      "  aktif       INTEGER DEFAULT 1," +
      "  synced      INTEGER DEFAULT 0," +
      "  created_by  INTEGER NOT NULL," +
      "  FOREIGN KEY (created_by) REFERENCES users(id)" +
      ")",
  );

  db.execSync(
    "CREATE TABLE IF NOT EXISTS transaksi (" +
      "  id           INTEGER PRIMARY KEY AUTOINCREMENT," +
      "  uuid         TEXT UNIQUE," +
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
      "  operator_id  INTEGER NOT NULL," +
      "  FOREIGN KEY (item_id) REFERENCES items(id)," +
      "  FOREIGN KEY (operator_id) REFERENCES users(id)" +
      ")",
  );

  db.execSync(
    "CREATE TABLE IF NOT EXISTS stok (" +
      "  id           INTEGER PRIMARY KEY AUTOINCREMENT," +
      "  uuid         TEXT UNIQUE," +
      "  item_id      INTEGER NOT NULL," +
      "  quantity      INTEGER NOT NULL," +
      "  jenis         TEXT NOT NULL CHECK(jenis IN ('masuk', 'keluar'))," +
      "  keterangan     TEXT DEFAULT ''," +
      "  harga_beli    REAL DEFAULT 0," +
      "  tanggal        TEXT NOT NULL," +
      "  operator_id    INTEGER NOT NULL," +
      "  synced        INTEGER DEFAULT 0," +
      "  FOREIGN KEY (item_id) REFERENCES items(id)," +
      "  FOREIGN KEY (operator_id) REFERENCES users(id)" +
      ")",
  );

  db.execSync(
    "CREATE TABLE IF NOT EXISTS kas (" +
      "  id           INTEGER PRIMARY KEY AUTOINCREMENT," +
      "  uuid         TEXT UNIQUE," +
      "  item_id      INTEGER," +
      "  nama         TEXT NOT NULL," +
      "  jenis        TEXT NOT NULL," +
      "  keterangan   TEXT DEFAULT ''," +
      "  jumlah        REAL DEFAULT 0," +
      "  tanggal       TEXT," +
      "  operator_id   INTEGER NOT NULL," +
      "  created_at     TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP," +
      "  synced        INTEGER DEFAULT 0," +
      "  FOREIGN KEY (item_id) REFERENCES items(id)," +
      "  FOREIGN KEY (operator_id) REFERENCES users(id)" +
      ")",
  );
  ensureKasSchema();
  db.execSync(
    "CREATE TABLE IF NOT EXISTS RekapKas (" +
      "  id           INTEGER PRIMARY KEY AUTOINCREMENT," +
      "  uuid         TEXT UNIQUE," +
      "  nama         TEXT NOT NULL," +
      "  kas_id       INTEGER," +
      "  jumlah        REAL NOT NULL," +
      "  tanggal       TEXT NOT NULL," +
      "  operator_id   INTEGER NOT NULL," +
      "  synced        INTEGER DEFAULT 0," +
      "  FOREIGN KEY (kas_id) REFERENCES kas(id)," +
      "  FOREIGN KEY (operator_id) REFERENCES users(id)" +
      ")",
  );
  db.execSync(
    "CREATE TABLE IF NOT EXISTS kerugian (" +
      "  id           INTEGER PRIMARY KEY AUTOINCREMENT," +
      "  keterangan   TEXT DEFAULT ''," +
      "  jumlah        REAL NOT NULL," +
      "  operator_id   INTEGER NOT NULL," +
      "  tanggal       TEXT NOT NULL," +
      "  FOREIGN KEY (operator_id) REFERENCES users(id)" +
      ")",
  );
  db.execSync(
    "CREATE TABLE IF NOT EXISTS operasional (" +
      "  id           INTEGER PRIMARY KEY AUTOINCREMENT," +
      "  keterangan   TEXT DEFAULT ''," +
      "  jumlah        REAL NOT NULL," +
      "  operator_id   INTEGER NOT NULL," +
      "  tanggal       TEXT NOT NULL," +
      "  FOREIGN KEY (operator_id) REFERENCES users(id)" +
      ")",
  );
  db.execSync(
    "CREATE TABLE IF NOT EXISTS rekap_harian (" +
      "  id           INTEGER PRIMARY KEY AUTOINCREMENT," +
      "  tanggal      TEXT NOT NULL," +
      "  omzet        REAL NOT NULL," +
      "  hpp          REAL NOT NULL," +
      "  laba_kotor   REAL NOT NULL," +
      "  operasional  REAL NOT NULL," +
      "  kerugian     REAL NOT NULL," +
      "  laba_bersih  REAL NOT NULL," +
      "  locked       INTEGER DEFAULT 0," +
      "  created_by   INTEGER NOT NULL," +
      "  created_at   TEXT NOT NULL," +
      "  synced        INTEGER DEFAULT 0," +
      "  FOREIGN KEY (created_by) REFERENCES users(id)" +
      ")",
  );
}

const formatLocalDate = (date: Date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const labelTanggalPanjang = (iso: string) =>
  new Date(iso + "T00:00:00").toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

export const db_getHistori = async (): Promise<HistoriGroup[]> => {
  try {
    const dates = db.getAllSync<{ tanggal: string }>(
      `
      SELECT tanggal
      FROM (
        SELECT tanggal FROM rekap_harian
        UNION
        SELECT tanggal FROM operasional
        UNION
        SELECT tanggal FROM kerugian
        UNION
        SELECT tanggal FROM RekapKas
      )
      ORDER BY tanggal DESC
      `,
    );

    const groups: HistoriGroup[] = dates.map(({ tanggal }) => {
      const rekap = getRekapHarianByTanggal(tanggal) as RekapHarianRow | null;
      const kasRows = getRekapKasHarian(tanggal) as RekapKasRow[];
      const operasionalRows = getOperasionalByTanggal(tanggal) as Array<{
        id: number;
        keterangan: string;
        jumlah: number;
        operator_id: number;
        tanggal: string;
      }>;
      const kerugianRows = getKerugianByTanggal(tanggal) as Array<{
        id: number;
        keterangan: string;
        jumlah: number;
        operator_id: number;
        tanggal: string;
      }>;

      const items: HistoriItem[] = [
        ...kasRows.map((row) => ({
          id: row.id,
          jenis: "rekap_kas" as const,
          nama: row.nama,
          deskripsi:
            row.kas_id !== null ? `Kas ID: ${row.kas_id}` : "Tanpa kas tujuan",
          nilai: row.jumlah,
          waktu: "-",
        })),
        ...operasionalRows.map((row) => ({
          id: row.id,
          jenis: "operasional" as const,
          nama: "Operasional",
          deskripsi: row.keterangan || "Tanpa keterangan",
          nilai: -Math.abs(row.jumlah),
          waktu: "-",
        })),
        ...kerugianRows.map((row) => ({
          id: row.id,
          jenis: "kerugian" as const,
          nama: "Kerugian",
          deskripsi: row.keterangan || "Tanpa keterangan",
          nilai: -Math.abs(row.jumlah),
          waktu: "-",
        })),
      ];

      return {
        tanggal,
        labelTanggal: labelTanggalPanjang(tanggal),
        terkunci: !!rekap?.locked,
        rekap,
        items,
      };
    });

    return groups;
  } catch (error) {
    console.error("db_getHistori error:", error);
    return [];
  }
};

// ============================================================
// KERUGIAN
// ============================================================

export const createKerugian = (
  keterangan: string,
  jumlah: number,
  operatorId: number,
) => {
  try {
    const tanggal = new Date().toISOString().split("T")[0]; // Format YYYY-MM-DD
    const result = db.runSync(
      `INSERT INTO kerugian (
        keterangan,
        jumlah,
        operator_id,
        tanggal
      ) VALUES (?, ?, ?, ?)`,
      [keterangan, jumlah, operatorId, tanggal],
    );

    return result.lastInsertRowId;
  } catch (error) {
    console.error("createKerugian error:", error);
    throw error;
  }
};

export const getKerugianByTanggal = (tanggal: string) => {
  try {
    return db.getAllSync(
      `SELECT *
       FROM kerugian
       WHERE tanggal = ?
       ORDER BY id DESC`,
      [tanggal],
    );
  } catch (error) {
    console.error("getKerugianByTanggal error:", error);
    return [];
  }
};

export const getTotalKerugianByTanggal = (tanggal: string): number => {
  try {
    const result = db.getFirstSync<{
      total: number;
    }>(
      `SELECT COALESCE(SUM(jumlah), 0) as total
       FROM kerugian
       WHERE tanggal = ?`,
      [tanggal],
    );

    return result?.total ?? 0;
  } catch (error) {
    console.error("getTotalKerugianByTanggal error:", error);
    return 0;
  }
};

// ============================================================
// OPERASIONAL
// ============================================================

export const createOperasional = (
  keterangan: string,
  jumlah: number,
  operatorId: number,
) => {
  try {
    const tanggal = new Date().toISOString().split("T")[0];
    const result = db.runSync(
      `INSERT INTO operasional (
        keterangan,
        jumlah,
        operator_id,
        tanggal
      ) VALUES (?, ?, ?, ?)`,
      [keterangan, jumlah, operatorId, tanggal],
    );

    return result.lastInsertRowId;
  } catch (error) {
    console.error("createOperasional error:", error);
    throw error;
  }
};

export const getOperasionalByTanggal = (tanggal: string) => {
  try {
    return db.getAllSync(
      `SELECT *
       FROM operasional
       WHERE tanggal = ?
       ORDER BY id DESC`,
      [tanggal],
    );
  } catch (error) {
    console.error("getOperasionalByTanggal error:", error);
    return [];
  }
};

export const getTotalOperasionalByTanggal = (tanggal: string): number => {
  try {
    const result = db.getFirstSync<{
      total: number;
    }>(
      `SELECT COALESCE(SUM(jumlah), 0) as total
       FROM operasional
       WHERE tanggal = ?`,
      [tanggal],
    );

    return result?.total ?? 0;
  } catch (error) {
    console.error("getTotalOperasionalByTanggal error:", error);
    return 0;
  }
};

// ============================================================
// REKAP HARIAN
// ============================================================

export const createRekapHarian = (params: CreateRekapHarianParams) => {
  try {
    const existing = db.getFirstSync<{
      id: number;
      locked: number;
    }>(
      `SELECT id, locked
       FROM rekap_harian
       WHERE tanggal = ?
       ORDER BY locked DESC, id DESC
       LIMIT 1`,
      [params.tanggal],
    );

    if (existing?.locked === 1) {
      throw new Error("Rekap harian sudah dikunci");
    }

    const now = new Date().toISOString();

    if (existing) {
      db.runSync(
        `UPDATE rekap_harian
         SET omzet = ?,
             hpp = ?,
             laba_kotor = ?,
             operasional = ?,
             kerugian = ?,
             laba_bersih = ?,
             locked = 1,
             created_by = ?,
             created_at = ?,
             synced = 0
         WHERE id = ?`,
        [
          params.omzet,
          params.hpp,
          params.labaKotor,
          params.operasional,
          params.kerugian,
          params.labaBersih,
          params.createdBy,
          now,
          existing.id,
        ],
      );

      return existing.id;
    }

    const result = db.runSync(
      `INSERT INTO rekap_harian (
        tanggal,
        omzet,
        hpp,
        laba_kotor,
        operasional,
        kerugian,
        laba_bersih,
        locked,
        created_by,
        created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        params.tanggal,
        params.omzet,
        params.hpp,
        params.labaKotor,
        params.operasional,
        params.kerugian,
        params.labaBersih,
        1,
        params.createdBy,
        now,
      ],
    );

    return result.lastInsertRowId;
  } catch (error) {
    console.error("createRekapHarian error:", error);
    throw error;
  }
};

export const getRekapHarianByTanggal = (tanggal: string) => {
  try {
    return db.getFirstSync(
      `SELECT *
       FROM rekap_harian
       WHERE tanggal = ?
       ORDER BY locked DESC, id DESC
       LIMIT 1`,
      [tanggal],
    );
  } catch (error) {
    console.error("getRekapHarianByTanggal error:", error);
    return null;
  }
};

export const getStokMasukByTanggal = (tanggal: string) => {
  try {
    return db.getAllSync<{
      id: number;
      item_id: number;
      item_nama: string | null;
      quantity: number;
      harga_beli: number;
      harga_jual: number | null;
      tanggal: string;
    }>(
      `SELECT
         s.id,
         s.item_id,
         i.nama AS item_nama,
         s.quantity,
         s.harga_beli,
         i.harga_jual,
         s.tanggal
       FROM stok s
       LEFT JOIN items i ON i.id = s.item_id
       WHERE s.jenis = 'masuk'
         AND s.tanggal LIKE ?
       ORDER BY s.tanggal DESC`,
      [`${tanggal}%`],
    );
  } catch (error) {
    console.error("getStokMasukByTanggal error:", error);
    return [];
  }
};

export const isRekapLocked = (tanggal: string): boolean => {
  try {
    const result = db.getFirstSync<{
      locked: number;
    }>(
      `SELECT locked
       FROM rekap_harian
       WHERE tanggal = ?
       LIMIT 1`,
      [tanggal],
    );

    return result?.locked === 1;
  } catch (error) {
    console.error("isRekapLocked error:", error);
    return false;
  }
};

export const getAllRekapHarian = () => {
  try {
    return db.getAllSync(
      `SELECT *
       FROM rekap_harian
       ORDER BY tanggal DESC`,
    );
  } catch (error) {
    console.error("getAllRekapHarian error:", error);
    return [];
  }
};

export function getRekapKasHarian(tanggal: string) {
  return db.getAllSync<RekapKas>("SELECT * FROM RekapKas WHERE tanggal = ?", [
    tanggal,
  ]);
}

export function createRekapKas(
  nama: string,
  kas_id: number | null,
  jumlah: number,
  operator_id: number,
): number {
  const tanggal = new Date().toISOString().split("T")[0]; // Format YYYY-MM-DD
  const result = db.runSync(
    "INSERT INTO RekapKas (nama, kas_id, jumlah, tanggal, operator_id) VALUES (?, ?, ?, ?, ?)",
    [nama, kas_id, jumlah, tanggal, operator_id],
  );
  return result.lastInsertRowId;
}

export function insertTestData() {
  try {
    console.log("🧪 Inserting test data...");

    // Insert test user
    db.runSync(
      `INSERT INTO users (uuid, nama, username, password, role, aktif, synced)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        uuid.v4(),
        "Admin Test",
        "admin_test",
        "password123",
        "admin",
        1,
        0, // synced = 0 (belum sync)
      ],
    );
    console.log("✅ User inserted");

    // Verify
    const users = db.getAllSync<User>("SELECT * FROM users WHERE synced = 0");
    console.log("Users to sync:", users);

    // Insert test item
    const adminId = users[0]?.id || 1;
    db.runSync(
      `INSERT INTO items (uuid, nama, jenis, kategori, harga_modal, harga_jual, created_by, synced)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        uuid.v4(),
        "Item Test A",
        "Barang",
        "Elektronik",
        100000,
        150000,
        adminId,
        0,
      ],
    );
    console.log("✅ Item inserted");

    // Verify
    const items = db.getAllSync("SELECT * FROM items WHERE synced = 0");
    console.log("Items to sync:", items);
  } catch (error) {
    console.error("❌ Insert test data error:", error);
  }
}

export function seedDummyKonterData() {
  try {
    // db.execSync("PRAGMA foreign_keys = ON;");

    // db.execSync("BEGIN TRANSACTION;");

    // =========================
    // USERS
    // =========================
    // db.execSync(`
    //   INSERT INTO users (uuid, nama, username, password, role, aktif, synced)
    //   VALUES
    //   (NULL, 'Fadillah Akbar', 'fadiell', '123456', 'admin', 1, 0),
    //   (NULL, 'Rizky Pratama', 'rizky', '123456', 'operator', 1, 0),
    //   (NULL, 'Nadia Putri', 'nadia', '123456', 'operator', 1, 0);
    // `);

    // =========================
    // ITEMS KONTER
    // =========================
    // db.execSync(`
    //   INSERT INTO items
    //   (uuid, nama, jenis, kategori, detail, harga_modal, harga_jual, quantity, aktif, synced, created_by)
    //   VALUES
    //   (NULL, 'Pulsa Telkomsel 5K', 'Pulsa', 'Telkomsel', 'Reguler', 4800, 6000, 50, 1, 0, 1),
    //   (NULL, 'Pulsa Telkomsel 10K', 'Pulsa', 'Telkomsel', 'Reguler', 9500, 11000, 45, 1, 0, 1),
    //   (NULL, 'Pulsa XL 10K', 'Pulsa', 'XL', 'Reguler', 9500, 11000, 35, 1, 0, 2),
    //   (NULL, 'Pulsa Indosat 10K', 'Pulsa', 'Indosat', 'Reguler', 9600, 11000, 30, 1, 0, 2),

    //   (NULL, 'Paket Axis 1.5GB', 'Data', 'Axis', '3 Hari', 12000, 15000, 20, 1, 0, 2),
    //   (NULL, 'Paket XL 5GB', 'Data', 'XL', '7 Hari', 25000, 30000, 15, 1, 0, 1),
    //   (NULL, 'Paket Telkomsel 3GB', 'Data', 'Telkomsel', '5 Hari', 22000, 27000, 18, 1, 0, 1),

    //   (NULL, 'Lampu LED 10 Watt', 'Lampu', 'LED', 'Putih', 7000, 10000, 20, 1, 0, 1),
    //   (NULL, 'Lampu LED 20 Watt', 'Lampu', 'LED', 'Putih', 17000, 20000, 15, 1, 0, 1),
    //   (NULL, 'Lampu LED 30 Watt', 'Lampu', 'LED', 'Putih', 27000, 30000, 10, 1, 0, 1),

    //   (NULL, 'Kabel Type-C', 'Kabel', 'Charger', '1 Meter', 12000, 15000, 25, 1, 0, 2),
    //   (NULL, 'Kabel Lightning', 'Kabel', 'Charger', 'iPhone', 22000, 25000, 12, 1, 0, 2),
    //   (NULL, 'Charger 2A', 'Charger', 'Adaptor', 'Android', 27000, 30000, 10, 1, 0, 3),

    //   (NULL, 'Headset Kabel', 'Headset', 'Audio', 'Bass', 17000, 20000, 18, 1, 0, 3),
    //   (NULL, 'TWS F9', 'TWS', 'Audio', 'Bluetooth', 47000, 50000, 12, 1, 0, 3),

    //   (NULL, 'Case Samsung A14', 'Case HP', 'Samsung', 'Softcase', 12000, 15000, 10, 1, 0, 2),
    //   (NULL, 'Case iPhone 11', 'Case HP', 'iPhone', 'Silicon', 17000, 20000, 8, 1, 0, 2),

    //   (NULL, 'Free Fire 70 Diamond', 'Top Up Game', 'Free Fire', 'Instant', 9000, 12000, 999, 1, 0, 1),
    //   (NULL, 'Mobile Legends 86 Diamond', 'Top Up Game', 'Mobile Legends', 'Instant', 17000, 20000, 999, 1, 0, 1),

    //   (NULL, 'Token PLN 20K', 'Token', 'PLN', 'Prabayar', 20000, 23000, 999, 1, 0, 2),
    //   (NULL, 'Token PLN 50K', 'Token', 'PLN', 'Prabayar', 50000, 53000, 999, 1, 0, 2),

    //   (NULL, 'Transfer BCA', 'Transfer', 'Bank', 'Jasa transfer', 2000, 5000, 999, 1, 0, 1),
    //   (NULL, 'Transfer DANA', 'Transfer', 'E-Wallet', 'Jasa transfer', 1000, 3000, 999, 1, 0, 1);
    // `);

    // =========================
    // TRANSAKSI
    // =========================
    // db.execSync(`
    //   INSERT INTO transaksi
    //   (uuid, item_id, item_nama, item_jenis, item_kategori, item_detail,
    //    harga_jual, harga_modal, quantity, total, laba, tanggal, synced, operator_id)
    //   VALUES
    //   (NULL, 1, 'Pulsa Telkomsel 5K', 'Pulsa', 'Telkomsel', 'Reguler', 6000, 4800, 2, 12000, 2400, '2026-05-17 08:10:00', 0, 2),
    //   (NULL, 8, 'Lampu LED 10 Watt', 'Lampu', 'LED', 'Putih', 10000, 7000, 1, 10000, 3000, '2026-05-17 08:45:00', 0, 3),
    //   (NULL, 11, 'Kabel Type-C', 'Kabel', 'Charger', '1 Meter', 15000, 12000, 1, 15000, 3000, '2026-05-17 09:20:00', 0, 2),
    //   (NULL, 18, 'Free Fire 70 Diamond', 'Top Up Game', 'Free Fire', 'Instant', 12000, 9000, 1, 12000, 3000, '2026-05-17 10:00:00', 0, 2),
    //   (NULL, 20, 'Token PLN 20K', 'Token', 'PLN', 'Prabayar', 23000, 20000, 1, 23000, 3000, '2026-05-17 11:30:00', 0, 3),
    //   (NULL, 22, 'Transfer BCA', 'Transfer', 'Bank', 'Jasa transfer', 5000, 2000, 1, 5000, 3000, '2026-05-17 13:00:00', 0, 2);
    // `);

    // =========================
    // STOK
    // =========================
    // db.execSync(`
    //   INSERT INTO stok
    //   (uuid, item_id, quantity, jenis, keterangan, harga_beli, tanggal, operator_id, synced)
    //   VALUES
    //   (NULL, 8, 20, 'masuk', 'Restok lampu 10 watt', 7000, '2026-05-16 08:00:00', 1, 0),
    //   (NULL, 9, 15, 'masuk', 'Restok lampu 20 watt', 17000, '2026-05-16 08:15:00', 1, 0),
    //   (NULL, 11, 25, 'masuk', 'Restok kabel Type-C', 12000, '2026-05-16 09:00:00', 1, 0),
    //   (NULL, 15, 12, 'masuk', 'Restok TWS', 47000, '2026-05-16 10:00:00', 1, 0),

    //   (NULL, 8, 1, 'keluar', 'Penjualan', 7000, '2026-05-17 08:45:00', 3, 0),
    //   (NULL, 11, 1, 'keluar', 'Penjualan', 12000, '2026-05-17 09:20:00', 2, 0);
    // `);

    // =========================
    // KAS
    // =========================
    // db.execSync(`
    //   INSERT INTO kas
    //   (uuid, nama, jenis, keterangan, jumlah, tanggal, operator_id, synced)
    //   VALUES
    //   (NULL, 'Penjualan Pulsa Telkomsel 5K', 'masuk', 'Transaksi penjualan', 12000, '2026-05-17 08:10:00', 2, 0),
    //   (NULL, 'Penjualan Lampu LED 10 Watt', 'masuk', 'Transaksi penjualan', 10000, '2026-05-17 08:45:00', 3, 0),
    //   (NULL, 'Penjualan Kabel Type-C', 'masuk', 'Transaksi penjualan', 15000, '2026-05-17 09:20:00', 2, 0),
    //   (NULL, 'Top Up Free Fire', 'masuk', 'Transaksi penjualan', 12000, '2026-05-17 10:00:00', 2, 0),
    //   (NULL, 'Beli plastik kecil', 'keluar', 'Operasional toko', 10000, '2026-05-17 12:30:00', 1, 0);
    // `);

    // =========================
    // REKAP KAS
    // =========================
    // db.execSync(`
    //   INSERT INTO RekapKas
    //   (uuid, nama, kas_id, jumlah, tanggal, operator_id, synced)
    //   VALUES
    //   (NULL, 'Rekap kas penjualan pulsa', 1, 12000, '2026-05-17', 2, 0),
    //   (NULL, 'Rekap kas penjualan lampu', 2, 10000, '2026-05-17', 3, 0),
    //   (NULL, 'Rekap kas penjualan kabel', 3, 15000, '2026-05-17', 2, 0),
    //   (NULL, 'Rekap kas top up game', 4, 12000, '2026-05-17', 2, 0),
    //   (NULL, 'Rekap kas operasional', 5, 10000, '2026-05-17', 1, 0);
    // `);

    // =========================
    // KERUGIAN
    // =========================
    // db.execSync(`
    //   INSERT INTO kerugian
    //   (keterangan, jumlah, operator_id, tanggal)
    //   VALUES
    //   ('Selisih uang kas kecil', 5000, 1, '2026-05-17 18:00:00');
    // `);

    // =========================
    // OPERASIONAL
    // =========================
    // db.execSync(`
    //   INSERT INTO operasional
    //   (keterangan, jumlah, operator_id, tanggal)
    //   VALUES
    //   ('Beli plastik kecil', 10000, 1, '2026-05-17 12:30:00'),
    //   ('Beli pulpen nota', 8000, 1, '2026-05-17 13:00:00');
    // `);

    // =========================
    // REKAP HARIAN
    // =========================
    db.execSync(`
      INSERT INTO rekap_harian
      (tanggal, omzet, hpp, laba_kotor, operasional, kerugian, laba_bersih, locked, created_by, created_at, synced)
      VALUES
      ('2026-05-17', 84000, 67500, 16500, 18000, 5000, -6500, 0, 1, '2026-05-17 23:00:00', 0);
    `);

    // db.execSync("COMMIT;");
    console.log("✅ Dummy data konter berhasil ditambahkan");
  } catch (error) {
    // db.execSync("ROLLBACK;");
    console.error("❌ Error seed dummy konter data:", error);
  }
}

export function clearData(
  database: "users" | "items" | "transaksi" | "stok" | "kas",
) {
  db.execSync(`DELETE FROM ${database}`);
}

export function dropAllTables() {
  // db.execSync("DROP TABLE IF EXISTS users");
  // db.execSync("DROP TABLE IF EXISTS items");
  // db.execSync("DROP TABLE IF EXISTS transaksi");
  // db.execSync("DROP TABLE IF EXISTS stok");
  db.execSync("DROP TABLE IF EXISTS kas");
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
  item_id?: number,
): number {
  const tanggal = new Date().toISOString();
  const result = db.runSync(
    "INSERT INTO kas (item_id, nama, jenis, keterangan, jumlah, tanggal, created_at, operator_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [
      item_id || null,
      nama,
      jenis,
      keterangan,
      jumlah,
      tanggal,
      tanggal,
      operator_id,
    ],
  );
  return result.lastInsertRowId;
}

export function createAkunKas(
  nama: string,
  jenis: "cash" | "bank" | "ewallet",
  keterangan: string,
  operator_id: number,
): number {
  const normalizedName = nama.trim();
  const existing = db.getFirstSync<{ id: number }>(
    `SELECT id
     FROM kas
     WHERE item_id IS NULL
       AND LOWER(nama) = LOWER(?)
       AND LOWER(jenis) = LOWER(?)
     LIMIT 1`,
    [normalizedName, jenis],
  );

  if (existing) {
    throw new Error("Kas sudah ada");
  }

  return createKas(normalizedName, jenis, keterangan.trim(), 0, operator_id);
}

export function updateKasQuantity(
  item_id: number,
  quantity: number,
  jenis: "masuk" | "keluar",
  operator_id: number,
  keterangan: string = "",
): number {
  const tanggal = new Date().toISOString();

  // Update items.quantity
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

  // Log to kas table for history
  const result = db.runSync(
    "INSERT INTO kas (item_id, nama, jenis, keterangan, jumlah, tanggal, created_at, operator_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [item_id, "", jenis, keterangan, quantity, tanggal, tanggal, operator_id],
  );
  return result.lastInsertRowId;
}

export function createStokForItem(
  item_id: number,
  item_nama: string,
  operator_id: number,
): number {
  return createKas(
    item_nama,
    "inventory",
    "Item baru",
    0,
    operator_id,
    item_id,
  );
}

export function createUser(
  nama: string,
  username: string,
  password: string,
  role: "admin" | "operator",
): number {
  const result = db.runSync(
    "INSERT INTO users (uuid, nama, username, password, role, aktif, synced) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [uuid.v4(), nama, username, password, role, 1, 0],
  );
  return result.lastInsertRowId;
}

export function deactivateUser(id: number) {
  db.runSync("UPDATE users SET aktif = 0, synced = 0 WHERE id = ?", [id]);
}

export function insertStok(
  item_id: number,
  quantity: number,
  jenis: "masuk" | "keluar",
  keterangan: string,
  harga_beli: number,
  operator_id: number,
): number {
  const tanggal = new Date().toISOString();
  const result = db.runSync(
    "INSERT INTO stok (item_id, quantity, jenis, keterangan, harga_beli, tanggal, operator_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [item_id, quantity, jenis, keterangan, harga_beli, tanggal, operator_id],
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

export function updateItemQuantity(id: number, quantity: number) {
  db.runSync("UPDATE items SET quantity=?, synced=0 WHERE id=?", [
    quantity,
    id,
  ]);
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

export function deleteItem(id: number) {
  db.runSync("UPDATE items SET aktif=0, synced=0 WHERE id=?", [id]);
}

export function deleteTransaksi(id: number) {
  const transaksi = db.getFirstSync<Transaksi>(
    "SELECT * FROM transaksi WHERE id = ?",
    [id],
  );

  if (!transaksi) {
    throw new Error("Transaksi tidak ditemukan");
  }

  db.withTransactionSync(() => {
    db.runSync("DELETE FROM transaksi WHERE id = ?", [id]);
    db.runSync(
      "UPDATE items SET quantity = quantity + ?, synced = 0 WHERE id = ?",
      [transaksi.quantity, transaksi.item_id],
    );
  });
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

export function getUserById(id: number): User | null {
  const result = db.getFirstSync<User>(
    "SELECT * FROM users WHERE id = ? AND aktif = 1",
    [id],
  );
  return result || null;
}

export function authenticateUser(
  username: string,
  password: string,
): User | null {
  const result = db.getFirstSync<User>(
    "SELECT * FROM users WHERE username = ? AND password = ? AND aktif = 1",
    [username, password],
  );
  return result || null;
}

export function checkUsernameExists(username: string): boolean {
  const result = db.getFirstSync<User>(
    "SELECT id FROM users WHERE username = ?",
    [username],
  );
  return result !== null;
}

export function ensureDefaultUser(): number {
  // Check if default user already exists
  const existingUser = db.getFirstSync<User>(
    "SELECT * FROM users WHERE username = ?",
    ["fadiel"],
  );

  if (existingUser) {
    return existingUser.id;
  }

  // Create default user
  const result = db.runSync(
    "INSERT INTO users (uuid, nama, username, password, role, aktif, synced) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [uuid.v4(), "User Default", "fadiel", "default123", "operator", 1, 0],
  );

  console.log("✅ Default user created with id:", result.lastInsertRowId);
  return result.lastInsertRowId;
}

export function getAllKas(): kas[] {
  const result = db.getAllSync("SELECT * FROM kas");
  return result as kas[];
}

export function getDaftarKas(): kas[] {
  const result = db.getAllSync<kas>(
    `SELECT *
     FROM kas
     WHERE item_id IS NULL
       AND LOWER(jenis) IN ('cash', 'bank', 'ewallet', 'e-wallet', 'tunai', 'rekening')
     ORDER BY
       CASE LOWER(jenis)
         WHEN 'cash' THEN 1
         WHEN 'tunai' THEN 1
         WHEN 'bank' THEN 2
         WHEN 'rekening' THEN 2
         WHEN 'ewallet' THEN 3
         WHEN 'e-wallet' THEN 3
         ELSE 4
       END,
       nama ASC`,
  );
  return result as kas[];
}

export function getRiwayatStok(limit = 50) {
  return db.getAllSync<
    Stok & {
      item_nama: string | null;
    }
  >(
    `SELECT
       s.*,
       i.nama AS item_nama
     FROM stok s
     LEFT JOIN items i ON i.id = s.item_id
     ORDER BY s.tanggal DESC, s.id DESC
     LIMIT ?`,
    [limit],
  );
}

export function getPilihanKas(): Array<{
  id: number;
  nama: string;
  jenis: string;
}> {
  return getDaftarKas().map((row) => ({
    id: row.id,
    nama: row.nama,
    jenis: row.jenis,
  }));
}

export function getAllTransaksi(): Transaksi[] {
  const result = db.getAllSync("SELECT * FROM transaksi");
  return result as Transaksi[];
}

export function getAllStok(): Stok[] {
  const result = db.getAllSync("SELECT * FROM stok");
  return result as Stok[];
}
