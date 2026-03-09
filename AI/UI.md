UI.md

UI System: Agnonion CSS
Tujuan: Mendefinisikan arsitektur UI agar konsisten, scalable, dan mudah dipahami developer maupun AI agent.

---

1. Overview

UI dirancang menggunakan pendekatan Agnonion CSS System, yaitu sistem desain berlapis yang terdiri dari:

Token → Primitive → Component → Pattern → Page

Pendekatan ini memungkinkan:

- konsistensi desain
- skalabilitas UI
- kemudahan penggantian theme
- kemudahan AI menghasilkan UI

Setiap layer memiliki peran spesifik dalam membangun interface.

---

2. UI Architecture

Layer 1 — Tokens

Token adalah nilai dasar desain yang menjadi sumber semua styling.

Token mencakup:

- warna
- spacing
- typography
- border radius
- shadow

Contoh token:

--color-primary
--color-bg
--space-md
--radius-lg
--font-size-md

Semua komponen UI wajib menggunakan token.

Tujuan:

- konsistensi desain
- mudah mengganti theme
- memudahkan dark mode

---

Layer 2 — Primitives

Primitive adalah class CSS utilitas dasar.

Digunakan untuk:

- layout
- alignment
- spacing
- display

Contoh primitive:

.flex
.flex-col
.grid
.grid-2
.gap-md
.p-md
.text-center
.d-inline

Primitive tidak memiliki styling visual kompleks.
Fungsinya hanya membangun struktur layout.

---

Layer 3 — Components

Component adalah elemen UI reusable yang dibangun dari primitive + token.

Contoh komponen utama dalam sistem:

btn
card
avatar
badge
input
modal
dropdown

Contoh penggunaan:

<button class="btn">Like</button>

<div class="card">
  Post content
</div>

Component dirancang agar:

- reusable
- konsisten
- mudah dimodifikasi

---

Layer 4 — Patterns

Pattern adalah kombinasi beberapa komponen untuk membentuk unit UI yang lebih kompleks.

Contoh pattern dalam social media:

post-card
comment-thread
chat-message
profile-header
notification-item
sidebar-menu

Pattern memudahkan developer membangun halaman tanpa harus merangkai komponen dari awal.

---

Layer 5 — Pages

Page adalah layout halaman lengkap yang terdiri dari berbagai pattern.

Contoh halaman utama:

Home Feed
Profile Page
Group Page
Notifications
Messages
Explore
Settings

---

3. Core UI Components

Button

Digunakan untuk aksi pengguna seperti like, follow, share.

Varian:

btn-primary
btn-secondary
btn-outline
btn-icon

---

Card

Container utama untuk konten.

Digunakan untuk:

- post
- profile preview
- notification
- group preview

---

Avatar

Menampilkan foto profil pengguna.

Ukuran:

avatar-sm
avatar-md
avatar-lg

---

Badge

Digunakan untuk label kecil seperti:

- verified
- moderator
- admin
- new notification

---

Input

Digunakan untuk form dan pencarian.

Jenis:

input-text
input-search
input-textarea

---

4. Social Media UI Patterns

Beberapa pattern khusus yang digunakan dalam aplikasi.

Post Card

Struktur:

avatar + username
timestamp
content
media
action buttons

Action buttons:

like
comment
share
save

---

Comment Thread

Struktur nested:

comment
  reply
    reply

Setiap comment memiliki:

avatar
username
content
reaction
reply button

---

Notification Item

Struktur:

avatar
notification text
timestamp

Contoh:

Alice liked your post
Bob followed you
Charlie commented on your post

---

Chat Message

Struktur:

avatar
message bubble
timestamp

Jenis:

message-sent
message-received

---

5. Layout Structure

Aplikasi menggunakan layout tiga area utama.

Sidebar
Main Feed
Right Panel

Struktur visual:

| Sidebar | Feed | Right Panel |

Isi masing-masing area:

Sidebar

Menu navigasi utama:

Home
Explore
Groups
Messages
Notifications
Profile
Settings

---

Feed

Menampilkan konten utama seperti:

post feed
comments
share activity

---

Right Panel

Menampilkan informasi tambahan:

suggested users
trending topics
active groups

---

6. Responsiveness

UI harus responsif pada tiga ukuran layar.

Mobile
Tablet
Desktop

Breakpoints:

mobile < 640px
tablet < 1024px
desktop >= 1024px

Perubahan layout:

Mobile:

sidebar → hidden
feed → full width

Desktop:

sidebar visible
feed center
right panel visible

---

7. Theming

UI mendukung theme system berbasis token.

Theme yang tersedia:

light
dark
peach

Theme bekerja dengan mengganti nilai token.

Contoh:

--color-bg
--color-text
--color-primary

---

8. Design Principles

Prinsip desain UI:

Consistency
Komponen harus terlihat dan berfungsi sama di seluruh aplikasi.

Clarity
Interface harus mudah dipahami tanpa instruksi.

Efficiency
Aksi penting harus dapat dilakukan dengan cepat.

Accessibility
UI harus tetap dapat digunakan oleh berbagai jenis pengguna.

---

9. Future Extensions

Rencana pengembangan UI di masa depan:

theme marketplace
custom profile themes
animation system
skeleton loading
micro interactions

---

Summary

UI Yuai15 dibangun dengan sistem desain modular:

Token → Primitive → Component → Pattern → Page

Pendekatan ini membuat UI:

- mudah dikembangkan
- mudah dipelihara
- mudah dipahami oleh AI
- scalable untuk aplikasi social media besar
