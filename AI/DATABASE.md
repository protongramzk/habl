DATABASE.md

Project: HAVL
Database: PostgreSQL (Supabase)

Dokumen ini menjelaskan seluruh struktur database yang digunakan oleh sistem social network Yuai15.
Tujuannya agar developer maupun AI agent dapat memahami:

- Struktur tabel
- Relasi antar tabel
- Makna setiap kolom
- Cara data saling berhubungan

Database ini dirancang dengan beberapa pola arsitektur:

- Adjacency List Tree → Hierarki groups
- Polymorphic Relations → reactions ke post atau comment
- Social Graph → relations (friend/follower)
- Access Control Table → group_members
- Threaded Comments → comments.parent_id

---

Entity Relationship Overview

accounts
  │
  ├── posts
  │     └── comments
  │            └── reactions
  │
  ├── relations
  │
  └── group_members
          │
          └── groups (hierarchical)

---

1. accounts

Menyimpan profil pengguna atau halaman (page).

Setiap user Supabase Auth memiliki satu record di accounts.

Columns

Column| Type| Description
id| uuid| Primary key akun
auth_id| uuid| Referensi ke "auth.users.id" dari Supabase Auth
username| text| Username unik untuk profil
email| text| Email pengguna
display_name| text| Nama yang ditampilkan
avatar_url| text| URL gambar profil
bio| text| Deskripsi singkat profil
is_verified| boolean| Apakah akun terverifikasi
is_page| boolean| Menandakan akun adalah halaman/organisasi
badges| text[]| Badge atau role tambahan (admin, vip, dll)
privacy_setting| text| Pengaturan privasi profil
created_at| timestamptz| Waktu akun dibuat
updated_at| timestamptz| Waktu terakhir update profil

Relations

accounts.id -> posts.author_id
accounts.id -> comments.author_id
accounts.id -> reactions.account_id
accounts.id -> relations.from_account_id
accounts.id -> relations.to_account_id
accounts.id -> groups.owner_id
accounts.id -> group_members.account_id

---

2. groups

Menyimpan komunitas dan organisasi sosial dalam platform.

Groups memiliki struktur hierarki.

Level hierarki:

1 = Subgroup
2 = Group
3 = Federation
4 = Alliance

Hierarki dibangun menggunakan self reference parent_id.

Columns

Column| Type| Description
id| uuid| Primary key group
name| text| Nama group
description| text| Deskripsi group
slug| text| Identifier URL-friendly
avatar_url| text| Logo group
banner_url| text| Banner group
level| integer| Level hierarki group
parent_id| uuid| Parent group (untuk struktur pohon)
owner_id| uuid| Pemilik group
is_public| boolean| Apakah group publik
is_moderated| boolean| Apakah posting harus dimoderasi
member_count| integer| Jumlah member
created_at| timestamptz| Waktu group dibuat
updated_at| timestamptz| Waktu update terakhir

Relations

groups.parent_id -> groups.id
groups.owner_id -> accounts.id
groups.id -> posts.group_id
groups.id -> group_members.group_id

---

3. posts

Menyimpan semua konten yang dipost oleh user atau group.

Post dapat berisi teks dan media.

Columns

Column| Type| Description
id| uuid| Primary key post
author_id| uuid| Penulis post
group_id| uuid| Group tempat post dibuat
content| text| Isi teks post
media_urls| text[]| Daftar URL media
media_types| text[]| Tipe media (image/video/etc)
privacy| text| Level privasi post
is_pinned| boolean| Apakah post dipin
is_edited| boolean| Apakah post pernah diedit
edited_at| timestamptz| Waktu edit terakhir
reaction_count| integer| Jumlah reaksi
comment_count| integer| Jumlah komentar
share_count| integer| Jumlah share
created_at| timestamptz| Waktu post dibuat
updated_at| timestamptz| Waktu update terakhir

Privacy Values

public
friends_only
private
group_only

Relations

posts.author_id -> accounts.id
posts.group_id -> groups.id
posts.id -> comments.post_id
posts.id -> reactions.post_id

---

4. comments

Menyimpan komentar pada sebuah post.

Komentar memiliki sistem threaded replies menggunakan "parent_id".

Columns

Column| Type| Description
id| uuid| Primary key comment
post_id| uuid| Post yang dikomentari
author_id| uuid| Penulis komentar
parent_id| uuid| Komentar parent (untuk reply)
content| text| Isi komentar
is_edited| boolean| Apakah komentar pernah diedit
edited_at| timestamptz| Waktu edit terakhir
reaction_count| integer| Jumlah reaksi
created_at| timestamptz| Waktu komentar dibuat
updated_at| timestamptz| Waktu update terakhir

Relations

comments.post_id -> posts.id
comments.author_id -> accounts.id
comments.parent_id -> comments.id
comments.id -> reactions.comment_id

---

5. reactions

Menyimpan reaksi emosional pada post atau comment.

Desain ini menggunakan polymorphic relation.

Satu reaction hanya bisa menunjuk post atau comment, tidak keduanya.

Columns

Column| Type| Description
id| uuid| Primary key reaction
account_id| uuid| User yang memberi reaction
post_id| uuid| Post yang direact
comment_id| uuid| Comment yang direact
reaction_type| text| Jenis reaction
created_at| timestamptz| Waktu reaction dibuat

Reaction Types

Contoh reaction:

like
love
haha
wow
sad
angry

Relations

reactions.account_id -> accounts.id
reactions.post_id -> posts.id
reactions.comment_id -> comments.id

---

6. relations

Menyimpan hubungan sosial antar akun.

Ada dua tipe relasi:

follower
friend

Friend membutuhkan konfirmasi.

Columns

Column| Type| Description
id| uuid| Primary key relation
from_account_id| uuid| Pengirim relasi
to_account_id| uuid| Target relasi
type| text| Jenis hubungan
status| text| Status hubungan
created_at| timestamptz| Waktu dibuat
updated_at| timestamptz| Waktu update

Status Values

pending
accepted
blocked

Relations

relations.from_account_id -> accounts.id
relations.to_account_id -> accounts.id

---

7. group_members

Menyimpan keanggotaan user di sebuah group.

Digunakan untuk sistem akses dan role management.

Columns

Column| Type| Description
id| uuid| Primary key
group_id| uuid| Group tempat user menjadi anggota
account_id| uuid| Akun anggota
role| text| Role dalam group
joined_at| timestamptz| Waktu bergabung
is_admin_inherited| boolean| Apakah admin dari parent group

Roles

owner
moderator
member
banned

Relations

group_members.group_id -> groups.id
group_members.account_id -> accounts.id

---

Row Level Security (RLS)

Semua tabel menggunakan Row Level Security untuk memastikan user hanya dapat mengakses data yang diizinkan.

Contoh aturan:

- User hanya bisa mengedit akun sendiri
- User hanya bisa membuat post sebagai dirinya
- Reaction hanya bisa dibuat oleh akun sendiri

Helper function digunakan untuk memetakan auth user:

current_account_id()

Function ini mengubah:

auth.uid()

menjadi

accounts.id

---

Summary

Database ini terdiri dari 7 tabel inti:

accounts
groups
posts
comments
reactions
relations
group_members

Dengan fitur:

- Social graph
- Group hierarchy
- Threaded comments
- Reaction system
- Privacy control
- Access roles
- Row level security
