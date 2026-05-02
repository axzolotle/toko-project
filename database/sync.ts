import { db } from "@/database/db2"; // import db kamu
import { supabase } from "@/lib/supabase";
import uuid from "react-native-uuid";

export async function testSupabaseConnection() {
  try {
    const { data, error } = await supabase
      .from("user")
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

    console.log(`📝 [USERS] Found ${unSyncedUsers.length} records to sync`);

    // 2️⃣ Prepare data untuk Supabase
    const dataToSync = unSyncedUsers.map((user) => ({
      uuid: user.uuid || uuid.v4(),
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
          user.uuid,
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
    // 1️⃣ Ambil items yang belum sync (dengan user uuid untuk FK mapping)
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

    console.log(`📝 [ITEMS] Found ${unSyncedItems.length} records to sync`);

    // 2️⃣ Prepare data (FK tetap ID lokal dulu)
    const dataToSync = unSyncedItems.map((item) => ({
      uuid: item.uuid || uuid.v4(),
      nama: item.nama,
      jenis: item.jenis,
      kategori: item.kategori,
      detail: item.detail,
      harga_modal: item.harga_modal,
      harga_jual: item.harga_jual,
      quantity: item.quantity,
      aktif: item.aktif,
      created_by: item.created_by, // FK lokal dulu
    }));

    console.log("📤 [ITEMS] Uploading to Supabase...", dataToSync);

    // 3️⃣ Upload ke Supabase
    const { data: syncedData, error } = await supabase
      .from("items")
      .upsert(dataToSync, { onConflict: "uuid" })
      .select();

    if (error) {
      throw new Error(`Supabase error: ${error.message}`);
    }

    console.log("✅ [ITEMS] Synced from Supabase:", syncedData);

    // 4️⃣ FIX FK: Update created_by ke ID Supabase
    for (let i = 0; i < unSyncedItems.length; i++) {
      const localItem = unSyncedItems[i];
      const itemUUID = localItem.uuid;

      // Cari user di Supabase dengan uuid yang sama
      const { data: matchedUser, error: userError } = await supabase
        .from("users")
        .select("id")
        .eq("uuid", localItem.created_by_uuid)
        .single();

      if (userError) {
        console.warn(
          `⚠️ [ITEMS] User not found for uuid=${localItem.created_by_uuid}`,
        );
        continue;
      }

      if (matchedUser) {
        // Update FK ke ID Supabase
        const { error: updateError } = await supabase
          .from("items")
          .update({ created_by: matchedUser.id })
          .eq("uuid", itemUUID);

        if (updateError) {
          throw updateError;
        }

        console.log(
          `✅ [ITEMS] Updated FK: uuid=${itemUUID}, created_by: ${localItem.created_by} → ${matchedUser.id}`,
        );
      }
    }

    // 5️⃣ Mark synced di local
    unSyncedItems.forEach((item) => {
      db.runSync("UPDATE items SET synced = 1 WHERE id = ?", [item.id]);
    });

    console.log(`✅ [ITEMS] Marked ${unSyncedItems.length} records as synced`);

    return { success: true, synced: unSyncedItems.length, table: "items" };
  } catch (error) {
    console.error("❌ [ITEMS] Sync error:", error);
    return { success: false, error, table: "items" };
  }
}

// ============ SYNC TRANSAKSI ============
export async function syncTransaksi() {
  console.log("📤 [SYNC] Starting sync TRANSAKSI...");

  try {
    const unSyncedTransaksi = db.getAllSync<any>(
      `SELECT t.*, u.uuid as operator_uuid 
       FROM transaksi t 
       LEFT JOIN users u ON t.operator_id = u.id 
       WHERE t.synced = 0`,
    );

    if (unSyncedTransaksi.length === 0) {
      console.log("✅ [TRANSAKSI] No data to sync");
      return { success: true, synced: 0, table: "transaksi" };
    }

    const dataToSync = unSyncedTransaksi.map((t) => ({
      uuid: t.uuid || uuid.v4(),
      item_id: t.item_id,
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
      operator_id: t.operator_id,
    }));

    const { data: syncedData, error } = await supabase
      .from("transaksi")
      .upsert(dataToSync, { onConflict: "uuid" })
      .select();

    if (error) throw error;

    // Update FK operator_id ke Supabase ID
    for (let i = 0; i < unSyncedTransaksi.length; i++) {
      const localT = unSyncedTransaksi[i];

      const { data: matchedUser } = await supabase
        .from("users")
        .select("id")
        .eq("uuid", localT.operator_uuid)
        .single();

      if (matchedUser) {
        await supabase
          .from("transaksi")
          .update({ operator_id: matchedUser.id })
          .eq("uuid", localT.uuid);
      }
    }

    unSyncedTransaksi.forEach((t) => {
      db.runSync("UPDATE transaksi SET synced = 1 WHERE id = ?", [t.id]);
    });

    console.log(`✅ [TRANSAKSI] Synced ${unSyncedTransaksi.length} records`);
    return {
      success: true,
      synced: unSyncedTransaksi.length,
      table: "transaksi",
    };
  } catch (error) {
    console.error("❌ [TRANSAKSI] Sync error:", error);
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

    const dataToSync = unSyncedKas.map((k) => ({
      uuid: k.uuid || uuid.v4(),
      nama: k.nama,
      jenis: k.jenis,
      keterangan: k.keterangan,
      jumlah: k.jumlah,
      tanggal: k.tanggal,
      operator_id: k.operator_id,
    }));

    const { data: syncedData, error } = await supabase
      .from("kas")
      .upsert(dataToSync, { onConflict: "uuid" })
      .select();

    if (error) throw error;

    // Update FK operator_id
    for (let i = 0; i < unSyncedKas.length; i++) {
      const localK = unSyncedKas[i];

      const { data: matchedUser } = await supabase
        .from("users")
        .select("id")
        .eq("uuid", localK.operator_uuid)
        .single();

      if (matchedUser) {
        await supabase
          .from("kas")
          .update({ operator_id: matchedUser.id })
          .eq("uuid", localK.uuid);
      }
    }

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

// ============ SYNC ALL TABLES ============
export async function syncAllTables() {
  console.log("\n🔄 ===== STARTING FULL SYNC =====");

  const results = {
    users: await syncUsers(),
    items: await syncItems(),
    transaksi: await syncTransaksi(),
    kas: await syncKas(),
    timestamp: new Date().toISOString(),
  };

  const totalSynced =
    (results.users.synced ?? 0) +
    (results.items.synced ?? 0) +
    (results.transaksi.synced ?? 0) +
    (results.kas.synced ?? 0);

  console.log("\n✅ ===== FULL SYNC COMPLETED =====");
  console.log("Total synced:", totalSynced);
  console.log("Results:", results);

  return results;
}
