import { db } from "@/database/db2"; // import db kamu
import { supabase } from "@/lib/supabase";
import uuid from "react-native-uuid";

export async function testSupabaseConnection() {
  try {
    const { data, error } = await supabase
      .from("transaksi")
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
  console.log("🔄 Starting sync users...");

  try {
    // Ambil users yang belum di-sync (synced = 0)
    const unSyncedUsers = db.getAllSync<any>(
      "SELECT * FROM users WHERE synced = 0",
    );

    if (unSyncedUsers.length === 0) {
      console.log("No users to sync");
      return { success: true, synced: 0 };
    }

    // Siapkan data untuk upload
    const dataToSync = unSyncedUsers.map((user) => ({
      uuid: user.uuid || uuid.v4().toString(), // generate uuid jika belum ada
      nama: user.nama,
      username: user.username,
      password: user.password,
      role: user.role,
      aktif: user.aktif,
    }));

    // Upload ke Supabase
    const { error } = await supabase
      .from("users")
      .upsert(dataToSync, { onConflict: "uuid" });

    if (error) throw error;

    // Update flag synced di SQLite
    db.runSync("UPDATE users SET synced = 1 WHERE synced = 0");

    console.log(`Synced ${unSyncedUsers.length} users`);
    return { success: true, synced: unSyncedUsers.length };
  } catch (error) {
    console.error("Sync users error:", error);
    return { success: false, error };
  }
}

// Tambahkan ke file sebelumnya

export async function syncItems() {
  console.log("🔄 Starting sync items...");

  try {
    const unSyncedItems = db.getAllSync<any>(
      "SELECT * FROM items WHERE synced = 0",
    );

    if (unSyncedItems.length === 0) {
      console.log("No items to sync");
      return { success: true, synced: 0 };
    }

    const dataToSync = unSyncedItems.map((item) => ({
      uuid: item.uuid || uuid.v4().toString(),
      nama: item.nama,
      jenis: item.jenis,
      kategori: item.kategori,
      detail: item.detail,
      harga_modal: item.harga_modal,
      harga_jual: item.harga_jual,
      quantity: item.quantity,
      aktif: item.aktif,
      created_by: item.created_by,
    }));

    const { error } = await supabase
      .from("items")
      .upsert(dataToSync, { onConflict: "uuid" });

    if (error) throw error;

    db.runSync("UPDATE items SET synced = 1 WHERE synced = 0");

    console.log(`Synced ${unSyncedItems.length} items`);
    return { success: true, synced: unSyncedItems.length };
  } catch (error) {
    console.error("Sync items error:", error);
    return { success: false, error };
  }
}

export async function syncTransaksi() {
  console.log("🔄 Starting sync transaksi...");

  try {
    const unSyncedTransaksi = db.getAllSync<any>(
      "SELECT * FROM transaksi WHERE synced = 0",
    );

    if (unSyncedTransaksi.length === 0) {
      console.log("No transaksi to sync");
      return { success: true, synced: 0 };
    }

    const dataToSync = unSyncedTransaksi.map((t) => ({
      uuid: t.uuid || uuid.v4().toString(),
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

    const { error } = await supabase
      .from("transaksi")
      .upsert(dataToSync, { onConflict: "uuid" });

    if (error) throw error;

    db.runSync("UPDATE transaksi SET synced = 1 WHERE synced = 0");

    console.log(`Synced ${unSyncedTransaksi.length} transaksi`);
    return { success: true, synced: unSyncedTransaksi.length };
  } catch (error) {
    console.error("Sync transaksi error:", error);
    return { success: false, error };
  }
}

export async function syncKas() {
  console.log("🔄 Starting sync kas...");

  try {
    const unSyncedKas = db.getAllSync<any>(
      "SELECT * FROM kas WHERE synced = 0",
    );

    if (unSyncedKas.length === 0) {
      console.log("No kas to sync");
      return { success: true, synced: 0 };
    }

    const dataToSync = unSyncedKas.map((k) => ({
      uuid: k.uuid || uuid.v4().toString(),
      nama: k.nama,
      jenis: k.jenis,
      keterangan: k.keterangan,
      jumlah: k.jumlah,
      tanggal: k.tanggal,
      operator_id: k.operator_id,
    }));

    const { error } = await supabase
      .from("kas")
      .upsert(dataToSync, { onConflict: "uuid" });

    if (error) throw error;

    db.runSync("UPDATE kas SET synced = 1 WHERE synced = 0");

    console.log(`Synced ${unSyncedKas.length} kas`);
    return { success: true, synced: unSyncedKas.length };
  } catch (error) {
    console.error("Sync kas error:", error);
    return { success: false, error };
  }
}

// SYNC SEMUA SEKALIGUS
export async function syncAllTables() {
  console.log("🔄 Starting full sync...");

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

  console.log(`Full sync completed. Total synced: ${totalSynced}`);

  return results;
}
