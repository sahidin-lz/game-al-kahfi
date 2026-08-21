export const INVENTORY_ITEMS = [
  {
    id: 'sepatu_kasual',
    name: 'Sepatu Kasual Sporty',
    type: 'alasKaki',
    effect: { maxEnergi: 15 },
    description: 'Efek: +15 Energi maksimal'
  },
  {
    id: 'jaket_antipeluh',
    name: 'Jaket Antipeluh',
    type: 'pakaian',
    effect: { ukhuwah: 10 },
    description: 'Efek: +10 Ukhuwah'
  },
  {
    id: 'pakaian_formal',
    name: 'Pakaian Formal/Koko',
    type: 'pakaian',
    effect: { faham: 20 },
    description: 'Efek: +20 Faham/Karismatik'
  }
];

export const SHOP_ITEMS = [
  {
    id: 'nasi_timbel',
    name: 'Nasi Timbel Tradisional',
    price: 25000,
    effect: { energi: 30, ukhuwah: 10 },
    description: 'Makanan lokal yang menghangatkan suasana.'
  },
  {
    id: 'ayam_geprek',
    name: 'Ayam Geprek Ekstra Pedas',
    price: 45000,
    effect: { energi: 60, ukhuwah: 0 },
    description: 'Pemulihan energi instan untuk debat panjang.'
  }
];
