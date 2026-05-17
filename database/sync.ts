import { db } from "@/database/db2"; // import db kamu
import { supabase } from "@/lib/supabase";
import uuid from "react-native-uuid";

export async function testSupabaseConnection() {
  try {
    const { data, error } = await supabase
      .from("kas")
      .select("*", { count: "exact" })
      .limit(1);

    if (error) throw error;
    console.log("Supabase connected!");
    return true;
  } catch (error) {
    console.error("Supabase error:", error);
    return false;
  }
}

// ============ SYNC USERS ============
export async function syncUsers() {
  console.log("📤 [SYNC] Starting sync USERS...");

  try {
    // 1️⃣ Ambil users yang belum sync
    const unSyncedUsers = db.getAllSync<any>(
      "SELECT * FROM users WHERE synced = 0",
    );

    if (unSyncedUsers.length === 0) {
      console.log("✅ [USERS] No data to sync");
      return { success: true, synced: 0, table: "users" };
    }

    const handleUUID = (user: any) => {
      if (!user.uuid) {
        const newUUID = uuid.v4();
        db.runSync("UPDATE users SET uuid = ? WHERE id = ?", [
          newUUID,
          user.id,
        ]);
        return newUUID;
      }
      return user.uuid;
    };

    console.log(`📝 [USERS] Found ${unSyncedUsers.length} records to sync`);

    // 2️⃣ Prepare data untuk Supabase
    const dataToSync = unSyncedUsers.map((user) => ({
      uuid: handleUUID(user),
      nama: user.nama,
      username: user.username,
      password: user.password,
      role: user.role,
      aktif: user.aktif,
    }));

    console.log("📤 [USERS] Uploading to Supabase...", dataToSync);

    // 3️⃣ Upload dengan conflict resolution
    const { data: syncedData, error } = await supabase
      .from("users")
      .upsert(dataToSync, { onConflict: "uuid" })
      .select();

    if (error) {
      throw new Error(`Supabase error: ${error.message}`);
    }

    console.log("✅ [USERS] Synced from Supabase:", syncedData);

    // 4️⃣ Update synced flag di local
    unSyncedUsers.forEach((user) => {
      // Update uuid jika baru di-generate
      if (!user.uuid && user.uuid) {
        db.runSync("UPDATE users SET uuid = ?, synced = 1 WHERE id = ?", [
          handleUUID(user),
          user.id,
        ]);
      } else {
        db.runSync("UPDATE users SET synced = 1 WHERE id = ?", [user.id]);
      }
    });

    console.log(`✅ [USERS] Marked ${unSyncedUsers.length} records as synced`);

    return { success: true, synced: unSyncedUsers.length, table: "users" };
  } catch (error) {
    console.error("❌ [USERS] Sync error:", error);
    return { success: false, error, table: "users" };
  }
}

// ============ SYNC ITEMS ============
export async function syncItems() {
  console.log("📤 [SYNC] Starting sync ITEMS...");

  try {
    const unSyncedItems = db.getAllSync<any>(
      `SELECT i.*, u.uuid as created_by_uuid 
       FROM items i 
       LEFT JOIN users u ON i.created_by = u.id 
       WHERE i.synced = 0`,
    );

    if (unSyncedItems.length === 0) {
      console.log("✅ [ITEMS] No data to sync");
      return { success: true, synced: 0, table: "items" };
    }

    const dataToSync = [];

    for (const item of unSyncedItems) {
      if (!item.created_by_uuid) {
        console.warn("⚠️ Missing user UUID, skip:", item.id);
        continue;
      }

      // 🔥 1. Generate UUID kalau belum ada
      let itemUUID = item.uuid;

      if (!itemUUID) {
        itemUUID = uuid.v4();

        // 🔥 2. SIMPAN KE SQLITE (INI YANG KEMARIN KURANG)
        db.runSync("UPDATE items SET uuid = ? WHERE id = ?", [
          itemUUID,
          item.id,
        ]);

        console.log(
          `🆕 [ITEMS] UUID generated for item ${item.id}: ${itemUUID}`,
        );
      }

      dataToSync.push({
        uuid: itemUUID,
        nama: item.nama,
        jenis: item.jenis,
        kategori: item.kategori,
        detail: item.detail,
        harga_modal: item.harga_modal,
        harga_jual: item.harga_jual,
        quantity: item.quantity,
        aktif: item.aktif,
        created_by: item.created_by_uuid,
      });
    }

    if (dataToSync.length === 0) {
      console.warn("⚠️ No valid data to sync");
      return { success: false, table: "items" };
    }

    console.log("📤 Uploading items:", dataToSync);

    const { data, error } = await supabase
      .from("items")
      .upsert(dataToSync, { onConflict: "uuid" })
      .select();

    if (error) {
      throw new Error(`Supabase error: ${error.message}`);
    }

    console.log("✅ [ITEMS] Synced:", data);

    // 🔥 3. Mark synced
    unSyncedItems.forEach((item) => {
      db.runSync("UPDATE items SET synced = 1 WHERE id = ?", [item.id]);
    });

    return { success: true, synced: dataToSync.length, table: "items" };
  } catch (error) {
    console.error("❌ [ITEMS] Sync error:", error);
    return { success: false, error, table: "items" };
  }
}

// ============ SYNC TRANSAKSI ============
export async function syncTransaksi() {
  try {
    // 1. Query benar (JOIN 2 tabel)
    const unSyncedTransaksi = db.getAllSync<any>(
      `SELECT 
         t.*, 
         u.uuid as operator_uuid,
         i.uuid as item_uuid
       FROM transaksi t
       LEFT JOIN users u ON t.operator_id = u.id
       LEFT JOIN items i ON t.item_id = i.id
       WHERE t.synced = 0`,
    );
    const dataToSync = [];
    for (const t of unSyncedTransaksi) {
      // 2. Handle UUID transaksi
      let trxUUID = t.uuid;
      if (!trxUUID) {
        trxUUID = uuid.v4();
        db.runSync("UPDATE transaksi SET uuid = ? WHERE id = ?", [
          trxUUID,
          t.id,
        ]);
      }

      dataToSync.push({
        uuid: trxUUID,
        item_id: t.item_uuid,
        operator_id: t.operator_uuid,
        item_nama: t.item_nama,
        item_jenis: t.item_jenis,
        item_kategori: t.item_kategori,
        item_detail: t.item_detail,
        harga_jual: t.harga_jual,
        harga_modal: t.harga_modal,
        quantity: t.quantity,
        total: t.total,
        laba: t.laba,
        tanggal: t.tanggal,
      });
    }
    //  3. Upsert langsung (tanpa mapping)
    const { data, error } = await supabase
      .from("transaksi")
      .upsert(dataToSync, { onConflict: "uuid" })
      .select();

    if (error) {
      throw new Error(`Supabase error: ${error.message}`);
    }
    // 4. Mark synced
    unSyncedTransaksi.forEach((t) => {
      db.runSync("UPDATE transaksi SET synced = 1 WHERE id = ?", [t.id]);
    });
    return {
      success: true,
      synced: dataToSync.length,
      table: "transaksi",
    };
  } catch (error) {
    console.error("[TRANSAKSI] Sync error:", error);
    return { success: false, error, table: "transaksi" };
  }
}

// ============ SYNC KAS ============
export async function syncKas() {
  console.log("📤 [SYNC] Starting sync KAS...");

  try {
    const unSyncedKas = db.getAllSync<any>(
      `SELECT k.*, u.uuid as operator_uuid 
       FROM kas k 
       LEFT JOIN users u ON k.operator_id = u.id 
       WHERE k.synced = 0`,
    );

    if (unSyncedKas.length === 0) {
      console.log("✅ [KAS] No data to sync");
      return { success: true, synced: 0, table: "kas" };
    }

    const dataToSync = [];

    for (const k of unSyncedKas) {
      if (!k.operator_uuid) {
        console.warn("⚠️ Missing operator UUID, skip kas:", k.id);
        continue;
      }

      let kasUUID = k.uuid;

      if (!kasUUID) {
        const newUUID = uuid.v4();
        db.runSync("UPDATE kas SET uuid = ? WHERE id = ?", [newUUID, k.id]);
        k.uuid = newUUID;
        console.log(`🆕 [KAS] UUID generated for kas ${k.id}: ${newUUID}`);
      }

      dataToSync.push({
        uuid: k.uuid,
        nama: k.nama,
        jenis: k.jenis,
        keterangan: k.keterangan,
        jumlah: k.jumlah,
        tanggal: k.tanggal,
        operator_id: k.operator_uuid,
      });
    }

    console.log("📤 Uploading kas:", dataToSync);

    if (dataToSync.length === 0) {
      console.warn("⚠️ No valid kas to sync");
      return { success: false, table: "kas" };
    }

    const { data, error } = await supabase
      .from("kas")
      .upsert(dataToSync, { onConflict: "uuid" })
      .select();

    if (error) throw error;

    console.log("✅ [KAS] Synced:", data);

    unSyncedKas.forEach((k) => {
      db.runSync("UPDATE kas SET synced = 1 WHERE id = ?", [k.id]);
    });

    console.log(`✅ [KAS] Synced ${unSyncedKas.length} records`);
    return { success: true, synced: unSyncedKas.length, table: "kas" };
  } catch (error) {
    console.error("❌ [KAS] Sync error:", error);
    return { success: false, error, table: "kas" };
  }
}

export async function syncStok() {
  console.log("📤 [SYNC] Starting sync STOK...");

  try {
    const unSyncedStok = db.getAllSync<any>(
      `SELECT s.*, 
       u.uuid as operator_uuid, 
       i.uuid as item_uuid 
       FROM stok s 
       LEFT JOIN users u ON s.operator_id = u.id 
       LEFT JOIN items i ON s.item_id = i.id
       WHERE s.synced = 0`,
    );

    if (unSyncedStok.length === 0) {
      console.log("✅ [STOK] No data to sync");
      return { success: true, synced: 0, table: "stok" };
    }

    const dataToSync = [];

    for (const s of unSyncedStok) {
      if (!s.operator_uuid || !s.item_uuid) {
        console.warn("⚠️ Missing FK UUID, skip stok:", s.id);
        continue;
      }

      let stokUUID = s.uuid;

      if (!stokUUID) {
        const newUUID = uuid.v4();
        db.runSync("UPDATE stok SET uuid = ? WHERE id = ?", [newUUID, s.id]);
        s.uuid = newUUID;
        console.log(`🆕 [STOK] UUID generated for stok ${s.id}: ${newUUID}`);
      }

      dataToSync.push({
        uuid: s.uuid,
        quantity: s.quantity,
        jenis: s.jenis,
        keterangan: s.keterangan,
        harga_beli: s.harga_beli,
        tanggal: s.tanggal,

        operator_id: s.operator_uuid,
        item_id: s.item_uuid,
      });
    }

    console.log("📤 Uploading stok:", dataToSync);

    if (dataToSync.length === 0) {
      console.warn("⚠️ No valid stok to sync");
      return { success: false, table: "stok" };
    }

    const { data, error } = await supabase
      .from("stok")
      .upsert(dataToSync, { onConflict: "uuid" })
      .select();

    if (error) throw error;

    console.log("✅ [STOK] Synced:", data);

    unSyncedStok.forEach((s) => {
      db.runSync("UPDATE stok SET synced = 1 WHERE id = ?", [s.id]);
    });

    console.log(`✅ [STOK] Synced ${unSyncedStok.length} records`);
    return { success: true, synced: unSyncedStok.length, table: "stok" };
  } catch (error) {
    console.error("❌ [STOK] Sync error:", error);
    return { success: false, error, table: "stok" };
  }
}

// ============ SYNC ALL TABLES ============
export async function syncAllTables() {
  console.log("\n🔄 ===== STARTING FULL SYNC =====");

  const results = {
    users: await syncUsers(),
    items: await syncItems(),
    transaksi: await syncTransaksi(),
    kas: await syncKas(),
    stok: await syncStok(),
    timestamp: new Date().toISOString(),
  };

  const totalSynced = results.users.synced ?? 0;
  // (results.items.synced ?? 0) +
  // (results.transaksi.synced ?? 0) +
  // (results.kas.synced ?? 0) +
  // (results.stok.synced ?? 0);

  console.log("\n✅ ===== FULL SYNC COMPLETED =====");
  console.log("Total synced:", totalSynced);
  console.log("Results:", results);

  return results;
}
