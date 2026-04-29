import { useLocalSearchParams } from 'expo-router';
import { getBarangById } from '../../database/db';
import BarangForm from '../../components/BarangForm';

export default function EditBarangScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const barang = getBarangById(Number(id));
  return <BarangForm barang={barang ?? undefined} />;
}
