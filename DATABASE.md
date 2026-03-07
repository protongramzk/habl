# Dokumentasi Struktur Tabel Database

## 📋 Daftar Isi
1. [Overview ERD](#overview-erd)
2. [Tabel Utama](#tabel-utama)
3. [Relasi Antar Tabel](#relasi-antar-tabel)
4. [Sistem Hierarki Groups](#sistem-hierarki-groups)
5. [Sistem Reactions Polymorphic](#sistem-reactions-polymorphic)
6. [Tabel Tambahan](#tabel-tambahan)

---

## Overview ERD

### Tabel Inti
| Tabel | Fungsi Utama | Key Feature |
|-------|--------------|-------------|
| `accounts` | Profil pengguna atau halaman | Link ke Supabase Auth, badges[] |
| `groups` | Jantung sistem (Subgroup s/d Alliance) | Hierarki self-referencing (parent_id), 4 level |
| `posts` | Konten utama pengguna atau grup | media_urls (array), privacy control |
| `comments` | Interaksi tekstual threaded | parent_id untuk nested replies |
| `reactions` | Interaksi emosional (like/emoji) | Polymorphic (Post/Comment), generic |
| `relations` | Hubungan antar pengguna | Follower & Friend system |
| `group_members` | Keanggotaan & akses grup | Role-based, explicit access control |

---

## Tabel Utama

### 1. Tabel `accounts`

**Fungsi**: Menyimpan profil pengguna atau halaman (page).

```sql
CREATE TABLE accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_id UUID NOT NULL UNIQUE,  -- Dari Supabase Auth
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  is_verified BOOLEAN DEFAULT false,
  is_page BOOLEAN DEFAULT false,  -- Membedakan user vs page
  badges TEXT[] DEFAULT '{}',  -- Array badges (admin, moderator, vip)
  privacy_setting TEXT DEFAULT 'public',  -- 'public' | 'private' | 'friends_only'
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

**Penjelasan Kolom Semantik**:
- **id**: Primary key unik untuk setiap account
- **auth_id**: Referensi ke Supabase Auth (link ke sistem autentikasi)
- **username**: Identifier unik yang ramah-pengguna
- **email**: Email terverifikasi
- **display_name**: Nama tampilan yang bisa diubah
- **avatar_url**: URL foto profil
- **is_verified**: Badge verifikasi (centang biru)
- **is_page**: Flag untuk membedakan user personal vs page/komunitas
- **badges**: Array untuk multiple roles (moderator, admin, sponsor)
- **privacy_setting**: Kontrol visibilitas profil

---

### 2. Tabel `groups`

**Fungsi**: Jantung sistem hierarki komunitas (Subgroup → Group → Federation → Alliance).

```sql
CREATE TABLE groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  slug TEXT NOT NULL UNIQUE,
  avatar_url TEXT,
  banner_url TEXT,
  level INTEGER NOT NULL CHECK (level IN (1, 2, 3, 4)),
  -- Level: 1=Subgroup, 2=Group, 3=Federation, 4=Alliance
  parent_id UUID REFERENCES groups(id) ON DELETE RESTRICT,
  owner_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  is_public BOOLEAN DEFAULT true,
  is_moderated BOOLEAN DEFAULT false,
  member_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Self-referencing constraint
ALTER TABLE groups ADD CONSTRAINT valid_hierarchy CHECK (
  (level = 1 AND parent_id IS NOT NULL) OR  -- Subgroup harus punya parent (Group)
  (level = 2 AND parent_id IS NULL) OR      -- Group adalah root (atau punya parent Federation)
  (level = 3 AND parent_id IS NULL) OR      -- Federation adalah root (atau punya parent Alliance)
  (level = 4 AND parent_id IS NULL)         -- Alliance adalah top-level
);
```

**Penjelasan Kolom Semantik**:
- **id**: Unique identifier grup
- **level**: Menentukan posisi dalam hierarki (1-4)
- **parent_id**: Self-referencing untuk membangun struktur pohon
  - Subgroup (Lvl 1) → parent adalah Group
  - Group (Lvl 2) → parent adalah Federation
  - Federation (Lvl 3) → parent adalah Alliance
  - Alliance (Lvl 4) → parent adalah NULL (top-level)
- **slug**: URL-friendly identifier (contoh: "tech-enthusiasts")
- **owner_id**: User yang membuat/memiliki grup
- **is_public**: Kontrol visibilitas grup
- **is_moderated**: Flag untuk moderasi konten
- **member_count**: Denormalisasi untuk performa query

**Keunggulan Satu Tabel**:
✅ Satu query rekursif bisa ambil semua konten dalam Alliance  
✅ Menghindari "join hell"  
✅ Fleksibel untuk level tambahan di masa depan  

---

### 3. Tabel `posts`

**Fungsi**: Menyimpan konten utama (text, media, polling).

```sql
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  group_id UUID REFERENCES groups(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  media_urls TEXT[] DEFAULT '{}',  -- Array URL media (images, videos)
  media_types TEXT[] DEFAULT '{}',  -- Array tipe media (image, video, document)
  privacy TEXT DEFAULT 'public',  -- 'public' | 'friends_only' | 'private' | 'group_only'
  is_pinned BOOLEAN DEFAULT false,
  is_edited BOOLEAN DEFAULT false,
  edited_at TIMESTAMPTZ,
  reaction_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  share_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT valid_privacy CHECK (
    privacy IN ('public', 'friends_only', 'private', 'group_only')
  )
);

CREATE INDEX idx_posts_author ON posts(author_id);
CREATE INDEX idx_posts_group ON posts(group_id);
CREATE INDEX idx_posts_created ON posts(created_at DESC);
```

**Penjelasan Kolom Semantik**:
- **author_id**: User yang membuat post
- **group_id**: Nullable (post bisa standalone atau di grup)
- **media_urls & media_types**: Parallel arrays untuk handling multiple media
- **privacy**: Kontrol siapa yang bisa melihat post
  - `public`: Semua orang
  - `friends_only`: Hanya teman
  - `private`: Hanya penulis
  - `group_only`: Hanya member grup
- **is_pinned**: Post penting yang selalu di atas
- **reaction_count, comment_count**: Denormalisasi untuk performa

---

### 4. Tabel `comments`

**Fungsi**: Interaksi tekstual dengan sistem threading.

```sql
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  -- parent_id nullable: jika NULL = top-level comment, jika ada = reply
  content TEXT NOT NULL,
  is_edited BOOLEAN DEFAULT false,
  edited_at TIMESTAMPTZ,
  reaction_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_comments_post ON comments(post_id);
CREATE INDEX idx_comments_author ON comments(author_id);
CREATE INDEX idx_comments_parent ON comments(parent_id);
```

**Penjelasan Kolom Semantik**:
- **post_id**: Post mana yang dikomentari
- **parent_id**: Self-referencing untuk nested replies
  - NULL = top-level comment
  - Ada value = reply ke comment lain
- **Contoh struktur**:
  ```
  Post A
  ├── Comment 1 (parent_id = NULL)
  │   ├── Reply 1.1 (parent_id = Comment 1)
  │   └── Reply 1.2 (parent_id = Comment 1)
  ├── Comment 2 (parent_id = NULL)
  └── Comment 3 (parent_id = NULL)
  ```

---

### 5. Tabel `reactions`

**Fungsi**: Interaksi emosional (like, emoji react) dengan sistem polymorphic.

```sql
CREATE TABLE reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  reaction_type TEXT NOT NULL,  -- 'like', 'love', 'haha', 'wow', 'sad', 'angry'
  created_at TIMESTAMPTZ DEFAULT now(),
  -- Integrity: Satu reaction harus ke post ATAU comment, tidak keduanya
  CONSTRAINT valid_reaction_target CHECK (
    (post_id IS NOT NULL AND comment_id IS NULL) OR
    (post_id IS NULL AND comment_id IS NOT NULL)
  ),
  -- Constraint: Satu user hanya bisa react sekali per post/comment
  UNIQUE(account_id, post_id, reaction_type),
  UNIQUE(account_id, comment_id, reaction_type)
);

CREATE INDEX idx_reactions_post ON reactions(post_id);
CREATE INDEX idx_reactions_comment ON reactions(comment_id);
CREATE INDEX idx_reactions_account ON reactions(account_id);
```

**Penjelasan Kolom Semantik**:
- **post_id & comment_id**: Dual foreign keys (polymorphic)
  - Constraint: Harus ada satu dan hanya satu
  - Menghindari pembuatan 2 tabel terpisah (post_reactions, comment_reactions)
- **reaction_type**: Jenis emoji reaction
- **Keunggulan**:
  - ✅ Satu tabel untuk semua reactions
  - ✅ Mudah add tipe baru (hanya update enum)
  - ✅ Query sederhana untuk "top reactions"

---

### 6. Tabel `relations`

**Fungsi**: Menangani hubungan antar pengguna (Follower & Friend).

```sql
CREATE TABLE relations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  to_account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  type TEXT NOT NULL,  -- 'follower' | 'friend'
  status TEXT DEFAULT 'accepted',  -- 'pending' | 'accepted' | 'blocked'
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT not_self_relation CHECK (from_account_id != to_account_id),
  CONSTRAINT valid_type CHECK (type IN ('follower', 'friend')),
  CONSTRAINT valid_status CHECK (status IN ('pending', 'accepted', 'blocked')),
  -- Prevent duplicates
  UNIQUE(from_account_id, to_account_id, type)
);

CREATE INDEX idx_relations_from ON relations(from_account_id);
CREATE INDEX idx_relations_to ON relations(to_account_id);
```

**Penjelasan Kolom Semantik**:
- **from_account_id**: User yang melakukan action (follow/friend request)
- **to_account_id**: User yang menerima action
- **type**: Jenis relasi
  - `follower`: One-way (tidak perlu balasan)
  - `friend`: Two-way (perlu konfirmasi)
- **status**:
  - `pending`: Friend request belum disetujui
  - `accepted`: Relasi aktif
  - `blocked`: User di-block
- **Logika**:
  ```
  Follower:
  - User A follow User B → insert dengan status 'accepted'
  - Langsung aktif, tidak perlu konfirmasi
  
  Friend:
  - User A kirim friend request ke User B 
    → insert dengan status 'pending'
  - User B accept → update status jadi 'accepted'
  - User B decline → delete row
  ```

---

### 7. Tabel `group_members`

**Fungsi**: Keanggotaan & akses terisolasi (explicit access control).

```sql
CREATE TABLE group_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member',
  -- 'owner' | 'moderator' | 'member' | 'banned'
  joined_at TIMESTAMPTZ DEFAULT now(),
  is_admin_inherited BOOLEAN DEFAULT false,
  -- Flag: apakah akses ini from parent group inheritance
  CONSTRAINT valid_role CHECK (
    role IN ('owner', 'moderator', 'member', 'banned')
  ),
  UNIQUE(group_id, account_id)
);

CREATE INDEX idx_group_members_group ON group_members(group_id);
CREATE INDEX idx_group_members_account ON group_members(account_id);
```

**Penjelasan Kolom Semantik**:
- **role**: Tingkat akses dalam grup
  - `owner`: Pembuat grup, full control
  - `moderator`: Moderasi konten, manage members
  - `member`: User biasa
  - `banned`: Tidak bisa akses
- **is_admin_inherited**: Flag penting!
  - `false` (default): User didaftarkan secara eksplisit
  - `true`: User adalah owner grup parent (inherited access)
- **Keamanan Akses**:
  ```
  ❌ TIDAK BOLEH: Admin Alliance otomatis punya akses ke Group
  ✅ BENAR: Admin Alliance hanya bisa akses jika:
           - Terdaftar eksplisit di group_members
           - Atau inherit from parent dengan flag
  ```

---

## Relasi Antar Tabel

### Relasi Diagram

```
accounts (1) ─────────────────────────── (many) posts
   │                                           │
   │                                           │
   ├─ (1)─────────────────────── (many) comments
   │                                     │
   ├─ (1)─────────────────────── (many) relations   └─ (many) reactions
   │                                                      │
   ├─ (1)─────────────────────── (many) reactions ──────┘
   │
   └─ (1)─────────────────────── (many) group_members
                                       │
groups (1) ─ (0:1) ──── parent_id ──┘
  │
  ├─ (1)─────────────────────── (many) posts
  │
  ├─ (1)─────────────────────── (many) group_members
  │
  └─ (0:1)─── parent_id ───── (1) groups (Self-Reference)
```

### Relasi Penuh

| Dari | Ke | Tipe | Cardinality | Constraint |
|------|----|------|-------------|-----------|
| accounts | posts | author | 1:N | ON DELETE CASCADE |
| accounts | comments | author | 1:N | ON DELETE CASCADE |
| accounts | reactions | account | 1:N | ON DELETE CASCADE |
| accounts | relations | from/to | 1:N | ON DELETE CASCADE |
| accounts | group_members | account | 1:N | ON DELETE CASCADE |
| accounts | groups | owner | 1:N | ON DELETE CASCADE |
| groups | posts | group | 1:N | ON DELETE CASCADE |
| groups | group_members | group | 1:N | ON DELETE CASCADE |
| groups | groups | parent | 0:1 | ON DELETE RESTRICT |
| posts | comments | post | 1:N | ON DELETE CASCADE |
| posts | reactions | post | 0:1 | ON DELETE CASCADE |
| comments | comments | parent | 0:1 | ON DELETE CASCADE |
| comments | reactions | comment | 0:1 | ON DELETE CASCADE |

---

## Sistem Hierarki Groups

### Konsep: Adjacency List Pattern

**Masalah yang Dipecahkan**:
- ❌ Membuat 4 tabel terpisah (subgroups, groups, federations, alliances) → "Join Hell"
- ✅ Satu tabel dengan self-referencing + level constraint → Query fleksibel

### Level Hierarki

| Level | Nama | Parent Harus | Deskripsi |
|-------|------|--------------|-----------|
| 1 | **Subgroup** | Group (Lvl 2) | Komunitas kecil, spesifik topik |
| 2 | **Group** | Federation (Lvl 3) atau NULL | Komunitas medium |
| 3 | **Federation** | Alliance (Lvl 4) atau NULL | Asosiasi dari multiple groups |
| 4 | **Alliance** | NULL (Top-level) | Tingkat paling atas |

### Contoh Struktur Nyata

```
🏛️ Tech Alliance (Level 4, parent_id = NULL)
├─ 🏢 Backend Federation (Level 3, parent_id = Tech Alliance)
│  ├─ 💻 NodeJS Group (Level 2, parent_id = Backend Federation)
│  │  ├─ 🧵 Express Discussion (Level 1, parent_id = NodeJS Group)
│  │  └─ 🧵 NestJS Tips (Level 1, parent_id = NodeJS Group)
│  └─ 🐍 Python Group (Level 2, parent_id = Backend Federation)
│     ├─ 🧵 FastAPI (Level 1, parent_id = Python Group)
│     └─ 🧵 Django (Level 1, parent_id = Python Group)
└─ 🎨 Frontend Federation (Level 3, parent_id = Tech Alliance)
   ├─ ⚛️ React Group (Level 2, parent_id = Frontend Federation)
   │  ├─ 🧵 React Hooks (Level 1, parent_id = React Group)
   │  └─ 🧵 Next.js (Level 1, parent_id = React Group)
   └─ 🔵 Vue Group (Level 2, parent_id = Frontend Federation)
      └─ 🧵 Vue 3 (Level 1, parent_id = Vue Group)
```

### Query Contoh

**Query 1: Ambil semua konten di dalam Tech Alliance**
```sql
WITH RECURSIVE group_tree AS (
  -- Base case: Mulai dari Alliance
  SELECT id, name, level, parent_id
  FROM groups
  WHERE id = 'alliance-tech-id' AND level = 4
  
  UNION ALL
  
  -- Recursive case: Ambil semua child
  SELECT g.id, g.name, g.level, g.parent_id
  FROM groups g
  INNER JOIN group_tree gt ON g.parent_id = gt.id
)
SELECT p.id, p.content, p.created_at
FROM posts p
INNER JOIN group_tree gt ON p.group_id = gt.id
ORDER BY p.created_at DESC;
```

**Query 2: Cek apakah user ada di suatu grup (dengan inherit)**
```sql
SELECT COUNT(*) > 0 as has_access
FROM group_members
WHERE account_id = 'user-id'
  AND group_id = 'target-group-id'
  AND role != 'banned';
  
-- Atau dengan inheritance check:
SELECT DISTINCT gm.group_id
FROM group_members gm
WHERE gm.account_id = 'user-id'
UNION
SELECT g.id
FROM groups g
WHERE g.owner_id = 'user-id';
```

---

## Sistem Reactions Polymorphic

### Masalah yang Dipecahkan

- ❌ Membuat tabel terpisah: `post_reactions`, `comment_reactions`
- ✅ Satu tabel dengan dual foreign keys + constraint

### Mekanisme Polymorphic

**Dual Foreign Keys dengan Constraint**:
```sql
post_id UUID REFERENCES posts(id),
comment_id UUID REFERENCES comments(id),

CHECK (
  (post_id IS NOT NULL AND comment_id IS NULL) OR
  (post_id IS NULL AND comment_id IS NOT NULL)
)
```

**Aturan**:
- Satu row reaksi harus mereferensi **post ATAU comment**, tidak keduanya
- Tidak ada row dengan kedua kolom NULL
- Tidak ada row dengan kedua kolom filled

### Contoh Data

```sql
-- Reaction ke Post
INSERT INTO reactions (account_id, post_id, reaction_type)
VALUES ('user-1', 'post-abc', 'like');
-- Result: post_id='post-abc', comment_id=NULL

-- Reaction ke Comment
INSERT INTO reactions (account_id, comment_id, reaction_type)
VALUES ('user-2', 'comment-xyz', 'love');
-- Result: post_id=NULL, comment_id='comment-xyz'

-- ❌ TIDAK BOLEH (violates constraint):
INSERT INTO reactions (account_id, post_id, comment_id, reaction_type)
VALUES ('user-3', 'post-abc', 'comment-xyz', 'haha');
-- ERROR: CHECK constraint violated
```

### Keuntungan

✅ **Satu tabel**: Lebih mudah maintain  
✅ **Generic**: Mudah tambah tipe baru (product reactions, review reactions)  
✅ **Query sederhana**: `SELECT * FROM reactions WHERE post_id = ? OR comment_id = ?`  

---

## Tabel Tambahan

### Advanced Features

#### 1. Tabel `media_attachments` (Optional)

Jika ingin track media separately:

```sql
CREATE TABLE media_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  media_type TEXT NOT NULL,  -- 'image', 'video', 'document'
  file_size INTEGER,
  uploaded_by UUID REFERENCES accounts(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT valid_attachment CHECK (
    (post_id IS NOT NULL AND comment_id IS NULL) OR
    (post_id IS NULL AND comment_id IS NOT NULL)
  )
);
```

#### 2. Tabel `notifications` (Optional)

Untuk sistem notifikasi:

```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  actor_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  type TEXT NOT NULL,  -- 'like', 'comment', 'follow', 'friend_request'
  target_post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  target_comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

#### 3. Tabel `audit_logs` (Optional)

Untuk tracking perubahan penting:

```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action TEXT NOT NULL,  -- 'create', 'update', 'delete'
  entity_type TEXT NOT NULL,  -- 'post', 'comment', 'group'
  entity_id UUID NOT NULL,
  performed_by UUID REFERENCES accounts(id),
  changes JSONB,  -- Perubahan yang dilakukan
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

## Kesimpulan Design Principles

| Prinsip | Implementasi | Alasan |
|---------|--------------|--------|
| **Single Responsibility** | Satu tabel = satu entity | Mudah query, maintain |
| **Polymorphism** | Dual FK + CHECK constraint | Fleksibel, skalabel |
| **Hierarchy** | Self-referencing + level | Query rekursif, efficient |
| **Access Control** | Explicit membership | Keamanan, prevent abuse |
| **Data Integrity** | Constraints SQL | Consistency, reliable |
| **Performance** | Denormalisasi counters | Trade-off untuk UX |
| **Scalability** | Proper indexing | Fast queries at scale |

