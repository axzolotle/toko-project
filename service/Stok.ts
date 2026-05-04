import { getItemById, insertStok, updateItemQuantity } from "@/database/db2";

export async function createStok(
  itemId: number,
  qty: number,
  jenis: "masuk" | "keluar",
  keterangan: string,
  hargaBeli: number, // Harga beli per unit untuk catatan
  userId: number,
) {
  try {
    insertStok(
      itemId,
      qty,
      jenis,
      keterangan,
      hargaBeli, // Harga beli per unit untuk catatan
      userId,
    );
    const currentQty = getItemById(itemId)?.quantity ?? 0;
    const stokNow = jenis === "masuk" ? currentQty + qty : currentQty - qty;

    updateItemQuantity(itemId, stokNow);
    console.log(
      `✅ Stok berhasil ditambahkan. Item ID: ${itemId}, Qty: ${qty}, Jenis: ${jenis}, Keterangan: ${keterangan}, Harga Beli: ${hargaBeli}, User ID: ${userId}`,
    );
  } catch (error) {
    console.error("❌ Error menambahkan stok:", error);
  }
}
