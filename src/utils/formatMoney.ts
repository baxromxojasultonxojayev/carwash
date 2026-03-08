export const formatMoney = (n: any) =>
  new Intl.NumberFormat("uz-UZ", { maximumFractionDigits: 0 }).format(
    Number(n) || 0
  );
