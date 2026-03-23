🎛️ Minimal Reactive UI — Design System Specification

1. Overview

Minimal Reactive UI adalah design system yang berfokus pada:

Kejelasan (clarity)

Konsistensi (consistency)

Performa tinggi

Minim dekorasi


System ini dirancang untuk:

Dashboard

Social media UI

Chat / messaging UI


Bukan untuk UI dekoratif atau animasi-heavy.


---

2. Core Principles

2.1 Clarity Over Decoration

Tidak ada efek visual tanpa fungsi.

DILARANG:

Shadow

Ripple

Animasi dekoratif

Blur berlebihan



---

2.2 Structure Over Effects

Hierarki dibuat dari:

Spacing

Border

Warna


Bukan dari:

Shadow

Depth illusion



---

2.3 Minimal Motion

Animasi hanya digunakan untuk:

State change

Muncul / hilang

Feedback interaksi



---

2.4 Consistent State Feedback

Semua komponen harus menggunakan sistem state yang sama. Tidak boleh custom state per komponen.


---

2.5 Theme First

Semua warna berasal dari token. Tidak boleh hardcode warna di komponen.


---

3. Design Tokens

3.1 Colors

--bg: #0f0f0f;
--surface: #151515;

--text: #ffffff;
--text-muted: #888888;

--border: #2a2a2a;
--border-hover: #3a3a3a;
--border-focus: #ffffff;

--primary-bg: #ffffff;
--primary-text: #000000;


---

3.2 Opacity

--opacity-active: 0.7;
--opacity-disabled: 0.5;


---

3.3 Size

--radius: 8px;
--padding-y: 10px;
--padding-x: 14px;
--border-width: 1px;


---

3.4 Motion

--motion-fast: 80ms;
--motion-normal: 120ms;


---

4. State System

4.1 State Priority

1. disabled


2. active


3. hover


4. focus




---

4.2 State Rules

Hover

Border lebih terang


border-color: var(--border-hover);

Active (Pressed)

Opacity turun


opacity: var(--opacity-active);

Disabled

Opacity turun

Warna muted

Tidak interaktif


opacity: var(--opacity-disabled);
color: var(--text-muted);
pointer-events: none;

Focus

Border terang


border-color: var(--border-focus);
outline: none;


---

5. Motion Rules

DIIZINKAN:

Opacity fade

Scale kecil (optional, untuk appear)

Rotate (hanya loader)


DILARANG:

Slide

Bounce

Elastic

Complex easing


Durasi:

80ms – 120ms



---

6. Component Rules

6.1 Base Component

Semua komponen harus:

Menggunakan surface

Memiliki border

Menggunakan radius global

Menggunakan padding standar



---

6.2 No Custom Styling Per Component

DILARANG:

Token khusus button

Token khusus card


Semua harus pakai global token.


---

6.3 Variants

Variants hanya boleh override warna.

Contoh:

.button.primary {
  background: var(--primary-bg);
  color: var(--primary-text);
}


---

7. Core Components

Button

Default & Primary

Active = opacity



---

Input

Border + surface

Focus = border terang



---

Checkbox

Bentuk: lingkaran (dot)

Active: putih

Disabled: abu



---

Radio

Sama seperti checkbox, tapi single select



---

Card

Container utama

Tanpa shadow



---

List Item

Layout horizontal

Gap kecil



---

Message Bubble

User vs system



---

Badge

Label kecil



---

Tabs

Navigasi horizontal



---

Sidebar

Navigasi vertikal



---

Snackbar

Fade only



---

Loader

Rotate sederhana



---

Divider

Garis tipis



---

Empty State

Text muted



---

8. Composition Rules

Komponen kompleks harus dibangun dari komponen dasar.

Contoh:

Chat Input = Input + Button

Feed Item = Card + Text + Action

Dashboard Widget = Card + Text



---

9. Anti-Patterns (WAJIB DIHINDARI)

Shadow

Ripple effect

Animasi berlebihan

Warna random

Component-specific token

Layout tanpa spacing system



---

10. Golden Rule

> Jika bisa diselesaikan dengan border, warna, atau opacity — jangan gunakan efek lain.




---

11. Notes for AI Agents

Saat generate UI:

Gunakan token yang tersedia

Jangan menambahkan warna baru

Jangan menambahkan animasi baru

Jangan menggunakan shadow

Gunakan state system global

Prioritaskan keterbacaan dan struktur


Jika ragu:

Pilih solusi paling sederhana

Hindari dekorasi

