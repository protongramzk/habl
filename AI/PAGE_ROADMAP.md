
---

1. Home Feed

Ini jantung aplikasi ❤️

Fungsi:

menampilkan post dari orang yang diikuti

menampilkan post dari group

tempat user membuat post baru


Fitur utama:

Create Post
Feed Timeline
Reaction (Like, dll)
Comment
Share
Save Post

Struktur UI kira-kira:

Create Post
---------
Post Card
Post Card
Post Card


---

2. Explore

Tempat user menemukan konten baru 🔍

Fungsi:

mencari user

mencari group

menemukan trending post

menemukan hashtag


Konten biasanya:

Trending Posts
Suggested Users
Popular Groups
Topics


---

3. Profile Page

Halaman identitas user 👤

Fungsi:

menampilkan profil

menampilkan semua post user

follow / unfollow

melihat followers


Isi halaman:

Profile Header
Bio
Followers count
Following count

Tabs:
Posts
Media
Likes
Groups


---

4. Post Detail

Halaman untuk satu post saja

Fungsi:

melihat komentar lengkap

thread reply

reaction


Struktur:

Post
Comments
Replies
Reply form

Halaman ini biasanya muncul saat user klik post.


---

5. Notifications

Pusat notifikasi 🔔

Jenis notifikasi:

Like
Comment
Follow
Mention
Group activity

Struktur:

Notification Item
Notification Item
Notification Item


---

6. Messages (Chat)

Sistem direct message 💬

Biasanya terbagi dua panel.

Conversation List | Chat Window

Fitur:

Send message
Send media
Seen status
Typing indicator


---

7. Groups

Halaman untuk menjelajah group

Fungsi:

discover group
create group
join group

Konten:

Group List
Recommended Groups
Categories


---

8. Group Page

Halaman komunitas.

Isi utama:

Group header
Members
Group feed
About group

Tabs:

Posts
Members
Events
Media


---

9. Create / Edit Profile

Halaman pengaturan profil.

User bisa mengubah:

display name
username
avatar
bio
privacy


---

10. Settings

Pusat pengaturan aplikasi ⚙️

Biasanya berisi:

Account
Privacy
Notifications
Security
Theme
Language


---

11. Search

Search global.

Fungsi:

search user
search post
search group

Biasanya hasilnya dalam tab.

Top
Users
Posts
Groups


---

12. Saved / Bookmarks

User bisa menyimpan post.

Isi halaman:

Saved Posts
Collections


---

13. Create Post

Kadang berupa modal, kadang halaman.

Fungsi:

write post
upload media
choose privacy
choose group


---

14. Admin / Moderation (Opsional tapi penting)

Untuk admin platform.

Fungsi:

report management
ban user
remove content
moderate group


---

Total Page Summary

Biasanya sekitar 13 halaman utama.

Home Feed
Explore
Profile
Post Detail
Notifications
Messages
Groups
Group Page
Search
Saved Posts
Edit Profile
Settings
Admin


---

Page Flow User (User Journey)

Biasanya alur user seperti ini:

Login
 ↓
Home Feed
 ↓
Explore / Search
 ↓
Follow User
 ↓
Back to Feed
 ↓
Open Post
 ↓
Comment
 ↓
Open Profile
 ↓
Send Message


---

Page Hierarchy

Struktur halaman kira-kira seperti ini:

App

├ Home Feed
├ Explore
├ Search
├ Profile
│   └ Post Detail
├ Messages
├ Notifications
├ Groups
│   └ Group Page
├ Saved
├ Settings
└ Admin


---

Tips Arsitektur UI Sosmed

Biasanya navbar utama cuma berisi:

Home
Explore
Groups
Messages
Notifications
Profile

Page lain muncul dari dalam flow.


---

