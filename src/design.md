Tujuan: Menjadi panduan UI/UX konsisten untuk seluruh app: feed, post, comment, navbar, form, auth, dan interaksi sosial.


---

1️⃣ Colors / Palette

Name	Light	Dark	Usage

Background	#FFFFFF	#000000	Main bg
Surface	#F8F9FA	#1F1F1F	Cards, modals
Primary	#EC4899	#F472B6	Buttons, highlights
Secondary	#3B82F6	#60A5FA	Links, secondary buttons
Text Primary	#111827	#F9FAFB	Main text
Text Secondary	#6B7280	#9CA3AF	Subtext, placeholders
Border	#E5E7EB	#374151	Cards, inputs


Tips:

Gunakan bg-zinc-900 / bg-black untuk dark mode

Surface cards sedikit lebih terang dari background (bg-zinc-800)

Translucent effects: bg-zinc-900/80 backdrop-blur-md untuk navbar/modal



---

2️⃣ Typography

Level	Font Size	Weight	Line Height	Usage

H1	2rem	700	2.5rem	Page title / major headers
H2	1.5rem	600	2rem	Section title / Post title
H3	1.25rem	600	1.75rem	Comment username / Card heading
Body	1rem	400	1.5rem	Normal text / caption / comment
Small	0.875rem	400	1.25rem	Meta info / timestamps


Tips:

Gunakan font sans-serif, modern (Tailwind default: font-sans)

Text white di dark mode, gray-400/500 untuk subtext

Nama user bold (font-semibold)



---

3️⃣ Spacing & Layout

Base padding: p-4

Card margin: mb-4

PostCard spacing: space-y-4

Navbar floating: bottom-4, w-[90%] max-w-md

Max width feed: max-w-xl

Mobile first → responsive layout menggunakan Tailwind breakpoints (sm, md, lg)



---

4️⃣ Components

4.1 PostCard

Surface: bg-zinc-900 rounded-xl shadow-md

Content spacing: p-4 space-y-2

Media: grid / carousel (gap-2 rounded-md overflow-hidden)

Actions: Reaction, Comment, Share → icon + count, flex justify-between

Dark mode: all text text-white, subtext text-zinc-400



---

4.2 CommentCard

Surface: bg-zinc-900 rounded-lg p-4 mb-2

Avatar: w-8 h-8 rounded-full (pp_url)

Username: font-semibold text-sm

Timestamp: text-xs text-zinc-400

Content: text-sm text-zinc-300

Reply / edit / delete buttons: inline flex, icon hover hover:text-white



---

4.3 Navbar

Floating bottom, centered: fixed bottom-4 left-1/2 -translate-x-1/2

Container: bg-zinc-900/90 backdrop-blur-md rounded-3xl px-8 py-3 flex justify-between items-center

Icons: Lucide-solid, hover hover:text-white

Responsive: max-w-md



---

4.4 Buttons

Primary: bg-pink-600 hover:bg-pink-500 text-white font-medium rounded-lg px-4 py-2

Secondary / outline: border border-zinc-700 text-zinc-400 hover:text-white

Disabled: opacity-50 + cursor-not-allowed



---

4.5 Forms / Input

Container: bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 flex items-center gap-2

Input: bg-transparent outline-none text-white placeholder:text-zinc-500 flex-1

Textarea: same as input + resize-none



---

5️⃣ Icons

Semua icon: lucide-solid

Sizes:

Navbar: 22px

PostCard actions: 18-20px

Comments reply/edit: 16px


Hover state: change color to white or primary



---

6️⃣ Interaction & Feedback

Hover: slightly lighter text / bg

Active: pressed button slightly darker

Loading: spinner / disable button

Error: text-red-500



---

7️⃣ Motion / Animations

Subtle animations:

Hover: transition-colors duration-200

Focus: focus:ring-2 focus:ring-primary-500

Post image hover: scale-105 transition-transform duration-200


Floating navbar slide-in: optional transition-transform duration-300



---

8️⃣ Dark Mode Guidelines

Background: black / zinc-900

Surface: slightly lighter than bg (zinc-800)

Text: white main, gray for subtext

Borders: gray-700

Forms / Cards: rounded-lg / xl



---

9️⃣ Naming & File Structure

Components: components/ → PostCard, Comments, Navbar

Pages / Routes: routes/ → Home.jsx, Login.jsx, PostDetail.jsx

Utils: utils/ → supabase.js, auth.js, posts.js, reaction.js, user.js

Assets: public/ → default avatars, icons



---
