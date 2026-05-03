/**
 * RekapHarian.tsx — Modul rekap harian toko konter (React Native/Expo + TypeScript)
 *
 * Perubahan v2:
 * - Penambahan stok: uang keluar dari akun kas, stok masuk dengan HPP
 * - Biaya admin per transaksi penjualan (potong dari laba per unit)
 * - Biaya admin transfer/akun (tercatat sebagai pengeluaran ops)
 */

import { Picker } from "@react-native-picker/picker";
import {
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  useMemo,
  useState,
} from "react";
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// ─── TYPES ───────────────────────────────────────────────────────────────────

interface Transaction {
  id: number;
  item: string;
  qty: number;
  hargaJual: number;
  hpp: number;
  biayaAdmin?: number;
}

interface TransactionRow extends Transaction {
  admin: number;
  totalJual: number;
  totalHpp: number;
  totalAdmin: number;
  totalLaba: number;
}

interface KasAccount {
  id: number;
  nama: string;
  jenis: "cash" | "bank" | "ewallet";
  saldoSistem: number;
  icon: string;
}

interface StockPurchase {
  id: number;
  nama: string;
  hargaBeli: number;
  hargaJual: number;
  qty: number;
  akunKas: string;
  biayaAdmin: number;
}

interface StockRow extends StockPurchase {
  totalBeli: number;
  potensLaba: number;
}

interface AdminFee {
  id: number;
  keterangan: string;
  nominal: number;
  akun: string;
}

interface Expense {
  id: number;
  keterangan: string;
  nominal: number;
}

interface Penarikan {
  id: number;
  akun: string;
  nominal: number;
  keterangan: string;
  waktu: string;
}

interface SaldoFisikMap {
  [key: number]: number;
}

interface RekapHarianProps {
  transactions?: Transaction[];
  kasAccounts?: KasAccount[];
  stockPurchases?: StockPurchase[];
  adminFees?: AdminFee[];
  expenses?: Expense[];
  yesterdayMasterKas?: number;
}

// ─── MOCK DATA ───────────────────────────────────────────────────────────────

const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 1,
    item: "Pulsa Telkomsel 50k",
    qty: 4,
    hargaJual: 52000,
    hpp: 50000,
    biayaAdmin: 500,
  },
  {
    id: 2,
    item: "Paket Data XL 1GB",
    qty: 3,
    hargaJual: 15000,
    hpp: 13000,
    biayaAdmin: 0,
  },
  {
    id: 3,
    item: "Paket Data Indosat 2GB",
    qty: 2,
    hargaJual: 25000,
    hpp: 22000,
    biayaAdmin: 0,
  },
  {
    id: 4,
    item: "Token Listrik 100k",
    qty: 5,
    hargaJual: 102500,
    hpp: 100000,
    biayaAdmin: 1500,
  },
  {
    id: 5,
    item: "Aksesori Casing HP",
    qty: 1,
    hargaJual: 35000,
    hpp: 20000,
    biayaAdmin: 0,
  },
  {
    id: 6,
    item: "Voucher Tri 15k",
    qty: 3,
    hargaJual: 16000,
    hpp: 12000,
    biayaAdmin: 250,
  },
];

const MOCK_KAS_ACCOUNTS: KasAccount[] = [
  { id: 1, nama: "Cash", jenis: "cash", saldoSistem: 450000, icon: "💵" },
  { id: 2, nama: "BCA", jenis: "bank", saldoSistem: 1850000, icon: "🏦" },
  { id: 3, nama: "GoPay", jenis: "ewallet", saldoSistem: 320000, icon: "💚" },
  { id: 4, nama: "OVO", jenis: "ewallet", saldoSistem: 185000, icon: "💜" },
  { id: 5, nama: "Dana", jenis: "ewallet", saldoSistem: 95000, icon: "🔵" },
];

const MOCK_STOCK_PURCHASES: StockPurchase[] = [
  {
    id: 1,
    nama: "Perdana Tsel",
    hargaBeli: 20000,
    hargaJual: 28000,
    qty: 10,
    akunKas: "BCA",
    biayaAdmin: 0,
  },
  {
    id: 2,
    nama: "Kabel Data",
    hargaBeli: 20000,
    hargaJual: 25000,
    qty: 30,
    akunKas: "Cash",
    biayaAdmin: 0,
  },
];

const MOCK_ADMIN_FEES: AdminFee[] = [
  {
    id: 1,
    keterangan: "Admin transfer BCA ke GoPay",
    nominal: 6500,
    akun: "BCA",
  },
  { id: 2, keterangan: "Admin top up OVO", nominal: 1000, akun: "OVO" },
];

const MOCK_EXPENSES: Expense[] = [
  { id: 1, keterangan: "Listrik", nominal: 50000 },
  { id: 2, keterangan: "Air minum", nominal: 5000 },
];

const YESTERDAY_MASTER_KAS: number = 2600000;

// ─── HELPERS ─────────────────────────────────────────────────────────────────

const rp = (n: number | undefined | null): string =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(n ?? 0);

const sum = (arr: any[], key?: string): number =>
  arr.reduce((acc, x) => acc + (key ? (x[key] ?? 0) : x), 0);

// ─── KOMPONEN UTAMA ──────────────────────────────────────────────────────────

const RekapHarian: FC<RekapHarianProps> = ({
  transactions = MOCK_TRANSACTIONS,
  kasAccounts = MOCK_KAS_ACCOUNTS,
  stockPurchases = MOCK_STOCK_PURCHASES,
  adminFees = MOCK_ADMIN_FEES,
  expenses = MOCK_EXPENSES,
  yesterdayMasterKas = YESTERDAY_MASTER_KAS,
}) => {
  const [saldoFisik, setSaldoFisik] = useState<SaldoFisikMap>(() =>
    Object.fromEntries(kasAccounts.map((k) => [k.id, k.saldoSistem])),
  );
  const [tarikNominal, setTarikNominal] = useState<string>("");
  const [tarikAkun, setTarikAkun] = useState<string | number>(
    kasAccounts[0]?.id || "",
  );
  const [tarikKet, setTarikKet] = useState<string>("");
  const [penarikanList, setPenarikanList] = useState<Penarikan[]>([]);

  // ── Kalkulasi Penjualan ──────────────────────────────────────────────────

  const rows = useMemo<TransactionRow[]>(
    () =>
      transactions.map((t) => {
        const admin = t.biayaAdmin ?? 0;
        return {
          ...t,
          admin,
          totalJual: t.qty * t.hargaJual,
          totalHpp: t.qty * t.hpp,
          totalAdmin: t.qty * admin,
          totalLaba: t.qty * (t.hargaJual - t.hpp - admin),
        };
      }),
    [transactions],
  );

  const omzet = sum(rows, "totalJual");
  const totalHpp = sum(rows, "totalHpp");
  const totalAdminTrx = sum(rows, "totalAdmin");
  const labaKotor = omzet - totalHpp;
  const labaKotorBersih = labaKotor - totalAdminTrx;

  // ── Kalkulasi Stok ───────────────────────────────────────────────────────

  const stockRows = useMemo<StockRow[]>(
    () =>
      stockPurchases.map((s) => ({
        ...s,
        totalBeli: s.hargaBeli * s.qty,
        potensLaba: (s.hargaJual - s.hargaBeli) * s.qty,
      })),
    [stockPurchases],
  );
  const totalBeliStok = sum(stockRows, "totalBeli");

  // ── Pengeluaran ──────────────────────────────────────────────────────────

  const totalOps = sum(expenses, "nominal");
  const totalAdminFee = sum(adminFees, "nominal");
  const totalTarik = sum(penarikanList, "nominal");
  const labaBersih = labaKotorBersih - totalOps - totalAdminFee;

  // ── Master Kas ───────────────────────────────────────────────────────────

  const masterKasSistem = sum(kasAccounts, "saldoSistem");
  const masterKasFisik = sum(Object.values(saldoFisik));
  const totalPengeluaran =
    totalBeliStok + totalOps + totalAdminFee + totalTarik;
  const masterKasSeharusnya = yesterdayMasterKas + omzet - totalPengeluaran;
  const selisihSistem = masterKasFisik - masterKasSistem;
  const selisihRekon = masterKasFisik - masterKasSeharusnya;

  // ── Penarikan ────────────────────────────────────────────────────────────

  const handleTarik = (): void => {
    const nominal = parseInt(tarikNominal.replace(/\D/g, ""), 10);
    if (!nominal || nominal <= 0) return;
    setPenarikanList((prev) => [
      ...prev,
      {
        id: Date.now(),
        akun: kasAccounts.find((k) => k.id === Number(tarikAkun))?.nama || "-",
        nominal,
        keterangan: tarikKet || "Penarikan laba pemilik",
        waktu: new Date().toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
    setTarikNominal("");
    setTarikKet("");
  };

  const today = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <ScrollView style={s.container}>
      {/* Header */}
      <View style={s.header}>
        <Text style={s.headerLabel}>Rekap Harian</Text>
        <Text style={s.headerTitle}>{today}</Text>
      </View>

      {/* 1. Summary */}
      <SectionTitle>Ringkasan Penjualan</SectionTitle>
      <FlatList
        scrollEnabled={false}
        data={[
          {
            label: "Omzet",
            value: rp(omzet),
            color: "#185FA5",
            bg: "#E6F1FB",
          },
          {
            label: "HPP",
            value: rp(totalHpp),
            color: "#993C1D",
            bg: "#FAECE7",
          },
          {
            label: "Laba Kotor",
            value: rp(labaKotor),
            color: "#0F6E56",
            bg: "#E1F5EE",
          },
          {
            label: "Admin Transaksi",
            value: rp(totalAdminTrx),
            color: "#854F0B",
            bg: "#FAEEDA",
          },
          {
            label: "Ops + Admin",
            value: rp(totalOps + totalAdminFee),
            color: "#854F0B",
            bg: "#FAEEDA",
          },
          {
            label: "Laba Bersih",
            value: rp(labaBersih),
            color: labaBersih >= 0 ? "#0F6E56" : "#993C1D",
            bg: labaBersih >= 0 ? "#E1F5EE" : "#FAECE7",
          },
        ]}
        numColumns={2}
        columnWrapperStyle={s.metricRow}
        keyExtractor={(item) => item.label}
        renderItem={({ item }) => (
          <MetricCard
            label={item.label}
            value={item.value}
            color={item.color}
            bg={item.bg}
          />
        )}
        style={{ marginBottom: 20 }}
      />

      {/* 2. Tabel Penjualan */}
      <SectionTitle>Transaksi Penjualan — {rows.length} item</SectionTitle>
      <Text style={s.description}>
        Biaya admin transaksi = potongan provider per unit. Laba/unit = Harga
        Jual − HPP − Admin.
      </Text>

      <View style={s.table}>
        <FlatList
          scrollEnabled={false}
          data={rows}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item, index }) => (
            <TransactionRow
              row={item}
              isLast={index === rows.length - 1}
              totalJual={omzet}
              totalHpp={totalHpp}
              totalAdmin={totalAdminTrx}
              totalLaba={labaKotorBersih}
            />
          )}
        />
      </View>

      {/* 3. Penambahan Stok */}
      <SectionTitle style={{ marginTop: 20 }}>Penambahan Stok</SectionTitle>
      <Text style={s.description}>
        Uang keluar dari kas saat beli stok. HPP = harga beli per unit.
      </Text>

      <View style={s.table}>
        <FlatList
          scrollEnabled={false}
          data={stockRows}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item, index }) => (
            <StockPurchaseRow
              row={item}
              isLast={index === stockRows.length - 1}
              totalBeli={totalBeliStok}
            />
          )}
        />
      </View>

      {/* 4. Biaya Admin & Operasional */}
      <SectionTitle style={{ marginTop: 20 }}>
        Biaya Admin & Operasional
      </SectionTitle>

      <View style={s.twoColumn}>
        {/* Admin Fees */}
        <View style={{ flex: 1, marginRight: 6 }}>
          <Text style={s.subSectionLabel}>Admin Transfer / Akun</Text>
          <View style={s.table}>
            <FlatList
              scrollEnabled={false}
              data={adminFees}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item, index }) => (
                <AdminFeeRow
                  fee={item}
                  isLast={index === adminFees.length - 1}
                />
              )}
            />
            <TotalRow label="Total" value={rp(totalAdminFee)} />
          </View>
        </View>

        {/* Expenses */}
        <View style={{ flex: 1, marginLeft: 6 }}>
          <Text style={s.subSectionLabel}>Operasional Harian</Text>
          <View style={s.table}>
            <FlatList
              scrollEnabled={false}
              data={expenses}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item, index }) => (
                <ExpenseRow
                  expense={item}
                  isLast={index === expenses.length - 1}
                />
              )}
            />
            <TotalRow label="Total" value={rp(totalOps)} />
          </View>
        </View>
      </View>

      {/* 5. Master Kas */}
      <SectionTitle style={{ marginTop: 20 }}>
        Master Kas — Total Semua Uang Bisnis
      </SectionTitle>

      <FlatList
        scrollEnabled={false}
        data={kasAccounts}
        numColumns={2}
        columnWrapperStyle={s.kasRow}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <KasAccountCard account={item} saldoFisik={saldoFisik[item.id]} />
        )}
        style={{ marginBottom: 12 }}
      />

      <View
        style={[
          s.masterKasBox,
          { backgroundColor: "#185FA5", paddingVertical: 14 },
        ]}
      >
        <Text style={s.masterKasLabel}>Total Master Kas (sistem)</Text>
        <Text style={s.masterKasValue}>{rp(masterKasSistem)}</Text>
      </View>

      {/* 6. Rekonsiliasi */}
      <SectionTitle style={{ marginTop: 20 }}>Rekonsiliasi</SectionTitle>
      <Text style={s.description}>
        Input saldo fisik tiap akun. Sistem hitung selisih otomatis.
      </Text>

      <View style={s.table}>
        <FlatList
          scrollEnabled={false}
          data={kasAccounts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <RekonRow
              kasAccount={item}
              saldoFisik={saldoFisik}
              setSaldoFisik={setSaldoFisik}
            />
          )}
        />
      </View>

      <View style={s.rekonBoxContainer}>
        <RekonBox
          label="Selisih fisik vs sistem"
          desc="Fisik vs saldo di aplikasi"
          value={selisihSistem}
          okMsg="Semua akun cocok"
          errMsg="Ada transaksi belum tercatat"
        />
        <RekonBox
          label="Selisih fisik vs perhitungan"
          desc="Kas kemarin + omzet − semua pengeluaran"
          value={selisihRekon}
          okMsg="Arus kas seimbang"
          errMsg="Ada arus uang tidak tercatat"
        />
      </View>

      {/* 7. Penarikan Laba */}
      <SectionTitle style={{ marginTop: 20 }}>
        Penarikan Laba Pemilik
      </SectionTitle>
      <Text style={s.description}>
        Laba bersih tersedia hari ini:{" "}
        <Text
          style={{
            fontWeight: "700",
            color: labaBersih >= 0 ? "#0F6E56" : "#993C1D",
          }}
        >
          {rp(labaBersih)}
        </Text>
      </Text>

      <View style={s.withdrawalForm}>
        <TextInput
          style={[s.input, { flex: 1 }]}
          placeholder="Nominal (Rp)"
          value={tarikNominal}
          onChangeText={setTarikNominal}
          keyboardType="numeric"
          placeholderTextColor="#ccc"
        />
        <Picker
          style={[s.picker, { flex: 1, marginHorizontal: 8 }]}
          selectedValue={tarikAkun}
          onValueChange={(value: SetStateAction<string | number>) =>
            setTarikAkun(value)
          }
        >
          {kasAccounts.map((k) => (
            <Picker.Item
              key={k.id}
              label={`${k.icon} ${k.nama}`}
              value={k.id}
            />
          ))}
        </Picker>
        <TextInput
          style={[s.input, { flex: 1.5 }]}
          placeholder="Keterangan"
          value={tarikKet}
          onChangeText={setTarikKet}
          placeholderTextColor="#ccc"
        />
        <TouchableOpacity style={s.tarikBtn} onPress={handleTarik}>
          <Text style={s.tarikBtnText}>Catat</Text>
        </TouchableOpacity>
      </View>

      {penarikanList.length > 0 && (
        <View style={s.table}>
          <FlatList
            scrollEnabled={false}
            data={penarikanList}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item, index }) => (
              <PenarikanRow
                penarikan={item}
                isLast={index === penarikanList.length - 1}
              />
            )}
            ListFooterComponent={
              <TotalRow label="Total ditarik" value={rp(totalTarik)} red />
            }
          />
        </View>
      )}

      {/* 8. Ringkasan Akhir */}
      <SectionTitle style={{ marginTop: 20 }}>
        Ringkasan Akhir Hari
      </SectionTitle>

      <View style={s.summaryBox}>
        <WRow
          label="Master Kas awal (kemarin)"
          value={rp(yesterdayMasterKas)}
        />
        <WRow
          label="+ Omzet penjualan"
          value={`+${rp(omzet)}`}
          color="#0F6E56"
        />
        <View style={s.divider} />
        <WRow
          label="− Beli stok"
          value={`−${rp(totalBeliStok)}`}
          color="#993C1D"
        />
        <WRow
          label="− Biaya admin transaksi"
          value={`−${rp(totalAdminTrx)}`}
          color="#993C1D"
        />
        <WRow
          label="− Biaya admin transfer"
          value={`−${rp(totalAdminFee)}`}
          color="#993C1D"
        />
        <WRow
          label="− Biaya operasional"
          value={`−${rp(totalOps)}`}
          color="#993C1D"
        />
        <WRow
          label="− Penarikan pemilik"
          value={`−${rp(totalTarik)}`}
          color="#993C1D"
        />

        <View style={s.dividerBold}>
          <WRow
            label="Master Kas seharusnya"
            value={rp(masterKasSeharusnya)}
            bold
          />
          <WRow label="Master Kas fisik" value={rp(masterKasFisik)} bold />
        </View>

        <View
          style={[
            s.finalStatus,
            {
              backgroundColor:
                Math.abs(selisihRekon) < 500 ? "#E1F5EE" : "#FAECE7",
            },
          ]}
        >
          <Text
            style={{
              color: Math.abs(selisihRekon) < 500 ? "#0F6E56" : "#993C1D",
              fontSize: 14,
              fontWeight: "600",
              textAlign: "center",
            }}
          >
            {Math.abs(selisihRekon) < 500
              ? `✓ Rekap seimbang — laba bersih: ${rp(labaBersih)}`
              : `⚠ Selisih ${rp(Math.abs(selisihRekon))} — ada arus uang yang belum tercatat`}
          </Text>
        </View>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

export default RekapHarian;

// ─── SUB-KOMPONEN ─────────────────────────────────────────────────────────────

interface SectionTitleProps {
  children: ReactNode;
  style?: any;
}

const SectionTitle: FC<SectionTitleProps> = ({ children, style }) => (
  <Text style={[s.sectionTitle, style]}>{children}</Text>
);

interface MetricCardProps {
  label: string;
  value: string;
  color: string;
  bg: string;
}

const MetricCard: FC<MetricCardProps> = ({ label, value, color, bg }) => (
  <View style={[s.metricCard, { backgroundColor: bg }]}>
    <Text style={[s.metricLabel, { color }]}>{label}</Text>
    <Text style={[s.metricValue, { color }]}>{value}</Text>
  </View>
);

interface TransactionRowProps {
  row: TransactionRow;
  isLast: boolean;
  totalJual: number;
  totalHpp: number;
  totalAdmin: number;
  totalLaba: number;
}

const TransactionRow: FC<TransactionRowProps> = ({
  row,
  isLast,
  totalJual,
  totalHpp,
  totalAdmin,
  totalLaba,
}) => (
  <View>
    <View
      style={[
        s.tableRow,
        { borderBottomWidth: 1, borderBottomColor: "#e0e0e0" },
      ]}
    >
      <Text style={[s.tableCell, { flex: 2 }]}>{row.item}</Text>
      <Text style={[s.tableCell, { flex: 0.8, textAlign: "right" }]}>
        ×{row.qty}
      </Text>
      <Text style={[s.tableCell, { flex: 1.2, textAlign: "right" }]}>
        {rp(row.hargaJual)}
      </Text>
      <Text style={[s.tableCell, s.red, { flex: 1, textAlign: "right" }]}>
        {rp(row.hpp)}
      </Text>
      <Text
        style={[s.tableCell, { flex: 0.8, textAlign: "right", fontSize: 11 }]}
      >
        {row.admin > 0 ? rp(row.admin) : "—"}
      </Text>
      <Text style={[s.tableCell, s.green, { flex: 1, textAlign: "right" }]}>
        {rp(row.totalLaba)}
      </Text>
    </View>
    {isLast && (
      <View style={[s.tableRow, s.footerRow]}>
        <Text style={[s.tableCell, { flex: 4, fontWeight: "700" }]}>Total</Text>
        <Text
          style={[
            s.tableCell,
            { flex: 1.2, textAlign: "right", fontWeight: "700" },
          ]}
        >
          {rp(totalJual)}
        </Text>
        <Text
          style={[
            s.tableCell,
            s.red,
            { flex: 1, textAlign: "right", fontWeight: "700" },
          ]}
        >
          {rp(totalHpp)}
        </Text>
        <Text
          style={[
            s.tableCell,
            { flex: 0.8, textAlign: "right", fontWeight: "700" },
          ]}
        >
          {rp(totalAdmin)}
        </Text>
        <Text
          style={[
            s.tableCell,
            s.green,
            { flex: 1, textAlign: "right", fontWeight: "700" },
          ]}
        >
          {rp(totalLaba)}
        </Text>
      </View>
    )}
  </View>
);

interface StockPurchaseRowProps {
  row: StockRow;
  isLast: boolean;
  totalBeli: number;
}

const StockPurchaseRow: FC<StockPurchaseRowProps> = ({
  row,
  isLast,
  totalBeli,
}) => (
  <View>
    <View
      style={[
        s.tableRow,
        { borderBottomWidth: 1, borderBottomColor: "#e0e0e0" },
      ]}
    >
      <Text style={[s.tableCell, { flex: 2 }]}>{row.nama}</Text>
      <Text style={[s.tableCell, s.red, { flex: 1, textAlign: "right" }]}>
        {rp(row.hargaBeli)}
      </Text>
      <Text style={[s.tableCell, { flex: 0.6, textAlign: "right" }]}>
        ×{row.qty}
      </Text>
      <Text
        style={[
          s.tableCell,
          s.red,
          { flex: 1.2, textAlign: "right", fontWeight: "700" },
        ]}
      >
        {rp(row.totalBeli)}
      </Text>
      <Text style={[s.tableCell, s.green, { flex: 1, textAlign: "right" }]}>
        {rp(row.potensLaba)}
      </Text>
      <Text style={s.kasTag}>{row.akunKas}</Text>
    </View>
    {isLast && (
      <View style={[s.tableRow, s.footerRow]}>
        <Text style={[s.tableCell, { flex: 4, fontWeight: "700" }]}>
          Total Uang Keluar
        </Text>
        <Text
          style={[
            s.tableCell,
            s.red,
            { flex: 3.2, textAlign: "right", fontWeight: "700" },
          ]}
        >
          {rp(totalBeli)}
        </Text>
      </View>
    )}
  </View>
);

interface AdminFeeRowProps {
  fee: AdminFee;
  isLast: boolean;
}

const AdminFeeRow: FC<AdminFeeRowProps> = ({ fee, isLast }) => (
  <View
    style={[s.tableRow, { borderBottomWidth: 1, borderBottomColor: "#e0e0e0" }]}
  >
    <Text style={[s.tableCell, { flex: 2, fontSize: 12 }]}>
      {fee.keterangan}
    </Text>
    <Text style={[s.kasTag, { flex: 1 }]}>{fee.akun}</Text>
    <Text
      style={[s.tableCell, { flex: 1, textAlign: "right", color: "#854F0B" }]}
    >
      {rp(fee.nominal)}
    </Text>
  </View>
);

interface ExpenseRowProps {
  expense: Expense;
  isLast: boolean;
}

const ExpenseRow: FC<ExpenseRowProps> = ({ expense, isLast }) => (
  <View
    style={[s.tableRow, { borderBottomWidth: 1, borderBottomColor: "#e0e0e0" }]}
  >
    <Text style={[s.tableCell, { flex: 2, fontSize: 12 }]}>
      {expense.keterangan}
    </Text>
    <Text
      style={[s.tableCell, { flex: 1, textAlign: "right", color: "#854F0B" }]}
    >
      {rp(expense.nominal)}
    </Text>
  </View>
);

interface KasAccountCardProps {
  account: KasAccount;
  saldoFisik: number;
}

const KasAccountCard: FC<KasAccountCardProps> = ({ account, saldoFisik }) => (
  <View style={s.kasCard}>
    <Text style={s.kasIcon}>{account.icon}</Text>
    <Text style={s.kasName}>{account.nama}</Text>
    <Text style={s.kasBalance}>{rp(saldoFisik || account.saldoSistem)}</Text>
  </View>
);

interface RekonRowProps {
  kasAccount: KasAccount;
  saldoFisik: SaldoFisikMap;
  setSaldoFisik: Dispatch<SetStateAction<SaldoFisikMap>>;
}

const RekonRow: FC<RekonRowProps> = ({
  kasAccount,
  saldoFisik,
  setSaldoFisik,
}) => {
  const fisik = saldoFisik[kasAccount.id] ?? kasAccount.saldoSistem;
  const diff = fisik - kasAccount.saldoSistem;

  return (
    <View style={s.rekonRowContainer}>
      <Text style={s.tableCell}>
        {kasAccount.icon} {kasAccount.nama}
      </Text>
      <Text style={[s.tableCell, { color: "#888" }]}>
        {rp(kasAccount.saldoSistem)}
      </Text>
      <TextInput
        style={s.rekonInput}
        value={fisik.toString()}
        onChangeText={(text) =>
          setSaldoFisik((p) => ({
            ...p,
            [kasAccount.id]: Number(text) || 0,
          }))
        }
        keyboardType="numeric"
        placeholderTextColor="#ccc"
      />
      <Text
        style={[
          s.tableCell,
          {
            color: diff === 0 ? "#0F6E56" : diff > 0 ? "#185FA5" : "#993C1D",
            fontWeight: "700",
          },
        ]}
      >
        {diff === 0 ? "✓ Pas" : (diff > 0 ? "+" : "") + rp(diff)}
      </Text>
    </View>
  );
};

interface RekonBoxProps {
  label: string;
  desc: string;
  value: number;
  okMsg: string;
  errMsg: string;
}

const RekonBox: FC<RekonBoxProps> = ({ label, desc, value, okMsg, errMsg }) => {
  const ok = Math.abs(value) < 500;

  return (
    <View
      style={[
        s.rekonBox,
        {
          borderColor: ok ? "#9FE1CB" : "#F5C4B3",
          backgroundColor: ok ? "#E1F5EE" : "#FAECE7",
        },
      ]}
    >
      <Text style={[s.rekonBoxLabel, { color: ok ? "#0F6E56" : "#993C1D" }]}>
        {label}
      </Text>
      <Text style={[s.description, { marginBottom: 6 }]}>{desc}</Text>
      <Text style={[s.rekonBoxValue, { color: ok ? "#0F6E56" : "#993C1D" }]}>
        {value === 0 ? "Rp 0" : (value > 0 ? "+" : "") + rp(value)}
      </Text>
      <Text style={{ fontSize: 12, color: ok ? "#0F6E56" : "#993C1D" }}>
        {ok ? `✓ ${okMsg}` : `⚠ ${errMsg}`}
      </Text>
    </View>
  );
};

interface WRowProps {
  label: string;
  value: string;
  color?: string;
  bold?: boolean;
}

const WRow: FC<WRowProps> = ({ label, value, color, bold }) => (
  <View style={s.wRow}>
    <Text style={[s.wRowLabel, { fontWeight: bold ? "700" : "400" }]}>
      {label}
    </Text>
    <Text
      style={[
        s.wRowValue,
        { color: color || "#1a1a1a", fontWeight: bold ? "700" : "400" },
      ]}
    >
      {value}
    </Text>
  </View>
);

interface TotalRowProps {
  label: string;
  value: string;
  red?: boolean;
}

const TotalRow: FC<TotalRowProps> = ({ label, value, red }) => (
  <View style={[s.tableRow, s.footerRow]}>
    <Text style={[s.tableCell, { fontWeight: "700" }]}>{label}</Text>
    <Text
      style={[
        s.tableCell,
        {
          textAlign: "right",
          fontWeight: "700",
          color: red ? "#993C1D" : "#000",
        },
      ]}
    >
      {value}
    </Text>
  </View>
);

interface PenarikanRowProps {
  penarikan: Penarikan;
  isLast: boolean;
}

const PenarikanRow: FC<PenarikanRowProps> = ({ penarikan, isLast }) => (
  <View
    style={[s.tableRow, { borderBottomWidth: 1, borderBottomColor: "#e0e0e0" }]}
  >
    <Text style={[s.tableCell, { flex: 1, fontSize: 12, color: "#888" }]}>
      {penarikan.waktu}
    </Text>
    <Text style={[s.tableCell, { flex: 1.2, fontSize: 12 }]}>
      {penarikan.akun}
    </Text>
    <Text style={[s.tableCell, { flex: 1.5, fontSize: 12, color: "#888" }]}>
      {penarikan.keterangan}
    </Text>
    <Text
      style={[
        s.tableCell,
        { flex: 1, textAlign: "right", color: "#993C1D", fontWeight: "700" },
      ]}
    >
      {rp(penarikan.nominal)}
    </Text>
  </View>
);

// ─── STYLES ──────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    paddingHorizontal: 14,
    paddingTop: 12,
  },
  header: {
    marginBottom: 20,
  },
  headerLabel: {
    fontSize: 11,
    color: "#999",
    marginBottom: 4,
    textTransform: "uppercase",
    fontWeight: "600",
    letterSpacing: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1a1a1a",
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#888",
    textTransform: "uppercase",
    letterSpacing: 0.7,
    marginBottom: 10,
    paddingBottom: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: "#efefef",
  },
  description: {
    fontSize: 12,
    color: "#888",
    marginBottom: 10,
    lineHeight: 18,
  },
  metricRow: {
    gap: 10,
    marginBottom: 10,
  },
  metricCard: {
    flex: 1,
    borderRadius: 10,
    padding: 12,
    marginHorizontal: 5,
  },
  metricLabel: {
    fontSize: 11,
    opacity: 0.8,
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 15,
    fontWeight: "700",
  },
  table: {
    borderWidth: 0.5,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  tableCell: {
    fontSize: 13,
    color: "#1a1a1a",
  },
  footerRow: {
    backgroundColor: "#f0f0f0",
    borderTopWidth: 0.5,
    borderTopColor: "#e0e0e0",
  },
  red: {
    color: "#993C1D",
  },
  green: {
    color: "#0F6E56",
  },
  twoColumn: {
    flexDirection: "row",
    gap: 8,
  },
  subSectionLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666",
    marginBottom: 8,
  },
  kasRow: {
    gap: 10,
    marginBottom: 8,
  },
  kasCard: {
    flex: 1,
    borderWidth: 0.5,
    borderColor: "#e0e0e0",
    borderRadius: 10,
    padding: 12,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  kasIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  kasName: {
    fontSize: 11,
    color: "#888",
    marginBottom: 2,
  },
  kasBalance: {
    fontSize: 15,
    fontWeight: "600",
    color: "#000",
  },
  kasTag: {
    fontSize: 11,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: "#E6F1FB",
    color: "#185FA5",
    marginLeft: 8,
  },
  masterKasBox: {
    backgroundColor: "#185FA5",
    borderRadius: 10,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  masterKasLabel: {
    fontSize: 14,
    color: "#fff",
    opacity: 0.9,
  },
  masterKasValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
  },
  rekonRowContainer: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 0.5,
    borderBottomColor: "#e0e0e0",
    alignItems: "center",
    gap: 8,
  },
  rekonInput: {
    flex: 1,
    borderWidth: 0.5,
    borderColor: "#ccc",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    fontSize: 13,
    color: "#000",
  },
  rekonBoxContainer: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
  },
  rekonBox: {
    flex: 1,
    borderWidth: 0.5,
    borderRadius: 10,
    padding: 12,
  },
  rekonBoxLabel: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 2,
  },
  rekonBoxValue: {
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 4,
  },
  withdrawalForm: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
    alignItems: "center",
  },
  input: {
    borderWidth: 0.5,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 13,
    backgroundColor: "#fff",
    color: "#000",
  },
  picker: {
    borderWidth: 0.5,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  tarikBtn: {
    backgroundColor: "#185FA5",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    justifyContent: "center",
  },
  tarikBtnText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },
  summaryBox: {
    borderWidth: 0.5,
    borderColor: "#e0e0e0",
    borderRadius: 10,
    padding: 16,
    backgroundColor: "#fff",
    marginBottom: 20,
  },
  divider: {
    borderTopWidth: 0.5,
    borderTopColor: "#eee",
    marginVertical: 8,
  },
  dividerBold: {
    borderTopWidth: 1.5,
    borderTopColor: "#ddd",
    marginVertical: 8,
    paddingTop: 10,
  },
  wRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
    fontSize: 13,
  },
  wRowLabel: {
    color: "#666",
    flex: 1,
  },
  wRowValue: {
    flex: 1,
    textAlign: "right",
  },
  finalStatus: {
    marginTop: 10,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
});
