# Setup Supabase untuk Kos Pak Gunawan

Login tidak menyediakan pendaftaran publik. Buat hanya satu pengguna pemilik dengan email yang ditetapkan di layar login. Kata sandi dibuat dan dikelola di Supabase, tidak disimpan di repository.

## 1. Amankan kata sandi

Kata sandi yang dikirim melalui chat sebaiknya dianggap sudah terekspos. Jangan gunakan lagi. Buat kata sandi baru yang unik dan kuat langsung saat membuat pengguna di Supabase, lalu simpan di password manager.

## 2. Buat proyek dan pengguna pemilik

1. Buat proyek di [Supabase](https://supabase.com/dashboard). Catat database password di password manager, jangan masukkan ke source code.
2. Buka **Authentication → Users → Add user → Create new user**.
3. Isi email pemilik yang ditentukan pada halaman login, set kata sandi baru, dan aktifkan konfirmasi email bila tersedia.
4. Buka **Authentication → Providers → Email** dan nonaktifkan **Allow new users to sign up**. Jangan menambahkan alur sign-up ke aplikasi.
5. Di **Authentication → URL Configuration**, tambahkan URL GitHub Pages sebagai **Site URL** dan **Redirect URL**, misalnya `https://NAMA-USER.github.io/NAMA-REPO/`. Gunakan URL tepat repository Pages.

## 3. Buat tabel dengan Row Level Security

1. Buka **SQL Editor → New query** pada proyek.
2. Salin dan jalankan isi file [`supabase/schema.sql`](./supabase/schema.sql).
3. Pastikan `public.owner_data` memiliki RLS aktif dan tidak ada policy akses publik tambahan. Policy yang disediakan membatasi akses ke ID sesi yang sedang login dan email pemilik yang ditetapkan.

Aplikasi menyimpan satu dokumen JSON pada baris pemilik. Hak akses hanya memakai Supabase Auth dan RLS; jangan pernah memakai `service_role` key di browser.

## 4. Hubungkan aplikasi ke proyek

1. Di dashboard Supabase, buka **Project Settings → API** (atau **Connect**) dan salin **Project URL** dan **publishable key** (`sb_publishable_...`; pada proyek lama dapat berupa anon/public key).
2. Buka file [`js/supabase-config.js`](./js/supabase-config.js) pada proyek Anda dan isi dua nilai yang masih kosong. Contohnya:

   ```js
   window.KOS_SUPABASE_CONFIG = {
     url: "https://abcdefghijklmnop.supabase.co",
     publishableKey: "sb_publishable_isi_dengan_key_proyek_anda"
   };
   ```

   Ganti kedua contoh tersebut dengan nilai dari proyek Supabase Anda sendiri. URL harus URL Project, bukan URL dashboard Supabase.
3. Nilai publishable/anon key memang digunakan di browser; RLS yang melindungi data. **Jangan** memasukkan `service_role`/secret key, kata sandi pengguna, atau database password ke file tersebut.
4. Commit perubahan konfigurasi publik tersebut ke repository Anda setelah memeriksa bahwa tidak ada secret key di dalamnya.

## 5. Deploy dan verifikasi

1. Push perubahan ke branch `main`, lalu buka **GitHub repository → Settings → Pages**.
2. Pilih **Deploy from a branch**, branch `main`, folder `/ (root)`, lalu simpan. Tunggu URL Pages aktif.
3. Pastikan URL Pages sudah ditambahkan ke Supabase **URL Configuration**, kemudian buka melalui HTTPS.
4. Login menggunakan akun pemilik, buat perubahan uji yang tidak sensitif, lalu cek baris pada **Table Editor → owner_data** dan pastikan nilai `owner_id` sama dengan ID akun pemilik.
5. Login dari browser/perangkat lain dan pastikan perubahan terlihat. Setelah migrasi awal, salinan browser lokal tetap dipakai sebagai cache/cadangan; unduh backup JSON berkala.

## Apakah UUID pengguna perlu dimasukkan?

Tidak. Jangan masukkan UUID pengguna secara manual ke `js/supabase-config.js`, HTML, atau kode aplikasi. Setelah pemilik login, Supabase Auth menyediakan ID pengguna sesi secara otomatis. Aplikasi menggunakan ID tersebut sebagai `owner_id`, sedangkan policy RLS membandingkannya dengan `auth.uid()` dan sekaligus memeriksa email pemilik. UUID dapat dilihat di **Authentication → Users** atau di kolom `owner_id` pada `public.owner_data` untuk pemeriksaan, tetapi tidak diperlukan untuk konfigurasi.

## Catatan operasional

- Saat login pertama, jika browser memiliki data lokal aplikasi, data tersebut akan disalin ke cloud hanya bila baris cloud belum ada. Jika cloud sudah memiliki data, data cloud menjadi sumber utama dan mengganti salinan lokal di browser itu.
- Service worker mengambil ulang `js/supabase-config.js` dari jaringan agar URL dan publishable key terbaru tidak tertahan cache lama.
- Perubahan disimpan lokal lebih dahulu, lalu disinkronkan ke Supabase. Jika offline, status sinkronisasi menampilkan kegagalan dan aplikasi mencoba ulang ketika koneksi kembali.
- Hindari mengedit dari beberapa perangkat secara bersamaan. Aplikasi menyimpan satu snapshot penuh, bukan menggabungkan perubahan bersamaan.
- Supabase Auth memakai sesi browser. Keluar dari akun untuk mengakhiri sesi pada perangkat tersebut.
- Backup JSON aplikasi bukan pengganti backup database Supabase. Atur backup database secara terpisah sesuai kebutuhan.
