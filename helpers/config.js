
const perPage = 10;

const language = {
  name: 'Nama',
  lat: 'Latitude',
  lng: 'Longitude',
  avatar: 'Profile Picture',

  address: 'Alamat',
  location: 'Kabupaten / Kota',
  username: 'Username',
  password: 'Password',
  email: 'E-mail',

  description: 'Deskripsi',
  status: 'Persetujuan',
  statusComments: 'Komentar Persetujuan',
  user: 'Pengguna',
  category: 'Kategori',
  stock: 'Stok',
  price: 'Harga',

  title: 'Judul',
  content: 'Konten',

  dateFormat: 'Format Tanggal',
  timeFormat: 'Format Waktu',

  eventDate: 'Tanggal',
  eventTime: 'Waktu',

  deadline: 'Deadline Donasi',
  receiver: 'Penerima',
  goalDonation: 'Target Donasi',

  product: 'Data Produk',
  weightPerUnit: 'Berat per satuan barang',
  pricePerUnit: 'Harga per satuan barang',
  quantity: 'Jumlah Produk',
  donationData: 'ID Donasi',

  // configuration_attr_here
};

const bucketName = 'do-node-storage';

const populator = {
  user: [
    { select: '-__v', path: 'location' },
    // new_user_attr_below
  ],

  location: [
    // new_location_attr_below
  ],

  // new_populator_below
};


module.exports = {
  perPage,
  language,
  bucketName,
  populator,
};