export const getCurrencyDigits = (value: string) =>
  value.replace(/\D/g, "").replace(/^0+(?=\d)/, "");

export const parseCurrencyInput = (value: string) => {
  const digits = getCurrencyDigits(value);
  return digits ? Number(digits) : 0;
};

export const formatCurrencyInput = (value: string) => {
  const digits = getCurrencyDigits(value);

  if (!digits) {
    return "";
  }

  return `Rp ${Number(digits).toLocaleString("id-ID")}`;
};

export const formatRp = (num: number) => `Rp ${num.toLocaleString("id-ID")}`;
