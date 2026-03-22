# Database Schema Documentation

This project uses Supabase for its backend. Below is the documentation for the database schema.

## Tables

### accounts
Stores user profile information. Linked to Auth users.
- **id** (uuid, primary key): References `auth.users.id`
- **username** (text, unique): User's unique handle
- **pp_url** (text, nullable): Profile picture URL
- **bio** (text, nullable): User biography (max 160 chars)
- **created_at** (timestamptz): Timestamp of account creation
- **updated_at** (timestamptz): Timestamp of last profile update

### groups
User-created groups for community interaction.
- **id** (uuid, primary key): Unique group identifier
- **name** (text): Group name
- **description** (text, nullable): Group description
- **cover_url** (text, nullable): Group cover image URL
- **owner_id** (uuid): References `accounts.id`
- **created_at** (timestamptz): Timestamp of group creation

### federations
Collections of groups.
- **id** (uuid, primary key): Unique federation identifier
- **name** (text): Federation name
- **description** (text, nullable): Federation description
- **cover_url** (text, nullable): Federation cover image URL
- **created_at** (timestamptz): Timestamp of federation creation

### federation_members
Many-to-many relationship between federations and groups.
- **id** (uuid, primary key): Unique identifier
- **federation_id** (uuid): References `federations.id`
- **group_id** (uuid): References `groups.id`

### group_members
Members and roles within groups.
- **id** (uuid, primary key): Unique identifier
- **group_id** (uuid): References `groups.id`
- **account_id** (uuid): References `accounts.id`
- **role** (text): Member role (default: 'member')
- **created_at** (timestamptz): Timestamp of joining

### posts
Content posted by users, optionally within a group.
- **id** (uuid, primary key): Unique post identifier
- **account_id** (uuid): References `accounts.id`
- **group_id** (uuid, nullable): References `groups.id`
- **caption** (text, nullable): Post content/caption
- **media** (text ARRAY, nullable): Array of media URLs
- **created_at** (timestamptz): Timestamp of post creation

### comments
Comments on posts, with support for nesting.
- **id** (uuid, primary key): Unique comment identifier
- **post_id** (uuid): References `posts.id`
- **account_id** (uuid): References `accounts.id`
- **parent_id** (uuid, nullable): References `comments.id` for nested replies
- **content** (text): Comment content
- **created_at** (timestamptz): Timestamp of comment creation

### reactions
User reactions (likes, etc.) on posts.
- **id** (uuid, primary key): Unique identifier
- **post_id** (uuid): References `posts.id`
- **account_id** (uuid): References `accounts.id`
- **reaction** (text): Type of reaction
- **created_at** (timestamptz): Timestamp of reaction

### followers
Follow relationships between accounts.
- **id** (uuid, primary key): Unique identifier
- **follower_id** (uuid): References `accounts.id`
- **following_id** (uuid): References `accounts.id`
- **created_at** (timestamptz): Timestamp of following
