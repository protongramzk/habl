# API Documentation

This document describes the API for the HVLUM project, specifically the modules located in `src/lib/supabase/`.

## Modules

- [Accounts](#accounts)
- [Posts](#posts)
- [Comments](#comments)
- [Groups](#groups)
- [Federations](#federations)
- [Interactions](#interactions)
- [Client](#client)
- [Types](#types)

---

## Accounts <a name="accounts"></a>

### Types

- `Account`: Represents an account row.
- `AccountInsert`: Represents an account row for insertion.
- `AccountUpdate`: Represents an account row for update.

### Functions

#### `accounts.getById(id: string)`
Retrieves an account by its ID.
- **Parameters:**
  - `id` (string): The ID of the account.
- **Returns:** `Promise<{ data: Account | null, error: any }>`

#### `accounts.getByUsername(username: string)`
Retrieves an account by its username.
- **Parameters:**
  - `username` (string): The username of the account.
- **Returns:** `Promise<{ data: Account | null, error: any }>`

#### `accounts.create(account: AccountInsert)`
Creates a new account.
- **Parameters:**
  - `account` (AccountInsert): The account data to insert.
- **Returns:** `Promise<{ data: Account | null, error: any }>`

#### `accounts.update(id: string, updates: AccountUpdate)`
Updates an existing account.
- **Parameters:**
  - `id` (string): The ID of the account to update.
  - `updates` (AccountUpdate): The account data to update.
- **Returns:** `Promise<{ data: Account | null, error: any }>`

#### `accounts.delete(id: string)`
Deletes an account.
- **Parameters:**
  - `id` (string): The ID of the account to delete.
- **Returns:** `Promise<{ error: any }>`

---

## Posts <a name="posts"></a>

### Types

- `Post`: Represents a post row.
- `PostInsert`: Represents a post row for insertion.
- `PostUpdate`: Represents a post row for update.

### Functions

#### `posts.getAll(limit = 20, offset = 0)`
Retrieves all posts with a limit and offset.
- **Parameters:**
  - `limit` (number): The maximum number of posts to retrieve.
  - `offset` (number): The number of posts to skip.
- **Returns:** `Promise<{ data: Post[] | null, error: any }>`

#### `posts.getById(id: string)`
Retrieves a post by its ID.
- **Parameters:**
  - `id` (string): The ID of the post.
- **Returns:** `Promise<{ data: Post | null, error: any }>`

#### `posts.getByAccountId(accountId: string, limit = 20, offset = 0)`
Retrieves posts by account ID.
- **Parameters:**
  - `accountId` (string): The ID of the account.
  - `limit` (number): The maximum number of posts to retrieve.
  - `offset` (number): The number of posts to skip.
- **Returns:** `Promise<{ data: Post[] | null, error: any }>`

#### `posts.getByGroupId(groupId: string, limit = 20, offset = 0)`
Retrieves posts by group ID.
- **Parameters:**
  - `groupId` (string): The ID of the group.
  - `limit` (number): The maximum number of posts to retrieve.
  - `offset` (number): The number of posts to skip.
- **Returns:** `Promise<{ data: Post[] | null, error: any }>`

#### `posts.create(post: PostInsert)`
Creates a new post.
- **Parameters:**
  - `post` (PostInsert): The post data to insert.
- **Returns:** `Promise<{ data: Post | null, error: any }>`

#### `posts.update(id: string, updates: PostUpdate)`
Updates an existing post.
- **Parameters:**
  - `id` (string): The ID of the post to update.
  - `updates` (PostUpdate): The post data to update.
- **Returns:** `Promise<{ data: Post | null, error: any }>`

#### `posts.delete(id: string)`
Deletes a post.
- **Parameters:**
  - `id` (string): The ID of the post to delete.
- **Returns:** `Promise<{ error: any }>`

---

## Comments <a name="comments"></a>

### Types

- `Comment`: Represents a comment row.
- `CommentInsert`: Represents a comment row for insertion.
- `CommentUpdate`: Represents a comment row for update.

### Functions

#### `comments.getByPostId(postId: string)`
Retrieves comments for a specific post.
- **Parameters:**
  - `postId` (string): The ID of the post.
- **Returns:** `Promise<{ data: Comment[] | null, error: any }>`

#### `comments.getReplies(parentId: string)`
Retrieves replies for a specific comment.
- **Parameters:**
  - `parentId` (string): The ID of the parent comment.
- **Returns:** `Promise<{ data: Comment[] | null, error: any }>`

#### `comments.create(comment: CommentInsert)`
Creates a new comment.
- **Parameters:**
  - `comment` (CommentInsert): The comment data to insert.
- **Returns:** `Promise<{ data: Comment | null, error: any }>`

#### `comments.update(id: string, updates: CommentUpdate)`
Updates an existing comment.
- **Parameters:**
  - `id` (string): The ID of the comment to update.
  - `updates` (CommentUpdate): The comment data to update.
- **Returns:** `Promise<{ data: Comment | null, error: any }>`

#### `comments.delete(id: string)`
Deletes a comment.
- **Parameters:**
  - `id` (string): The ID of the comment to delete.
- **Returns:** `Promise<{ error: any }>`

---

## Groups <a name="groups"></a>

### Types

- `Group`: Represents a group row.
- `GroupInsert`: Represents a group row for insertion.
- `GroupUpdate`: Represents a group row for update.

### Functions

#### `groups.getAll(limit = 20, offset = 0)`
Retrieves all groups with a limit and offset.
- **Parameters:**
  - `limit` (number): The maximum number of groups to retrieve.
  - `offset` (number): The number of groups to skip.
- **Returns:** `Promise<{ data: Group[] | null, error: any }>`

#### `groups.getById(id: string)`
Retrieves a group by its ID.
- **Parameters:**
  - `id` (string): The ID of the group.
- **Returns:** `Promise<{ data: Group | null, error: any }>`

#### `groups.getMembers(groupId: string)`
Retrieves members of a group.
- **Parameters:**
  - `groupId` (string): The ID of the group.
- **Returns:** `Promise<{ data: any[] | null, error: any }>`

#### `groups.create(group: GroupInsert)`
Creates a new group.
- **Parameters:**
  - `group` (GroupInsert): The group data to insert.
- **Returns:** `Promise<{ data: Group | null, error: any }>`

#### `groups.update(id: string, updates: GroupUpdate)`
Updates an existing group.
- **Parameters:**
  - `id` (string): The ID of the group to update.
  - `updates` (GroupUpdate): The group data to update.
- **Returns:** `Promise<{ data: Group | null, error: any }>`

#### `groups.delete(id: string)`
Deletes a group.
- **Parameters:**
  - `id` (string): The ID of the group to delete.
- **Returns:** `Promise<{ error: any }>`

#### `groups.addMember(groupId: string, accountId: string, role = 'member')`
Adds a member to a group.
- **Parameters:**
  - `groupId` (string): The ID of the group.
  - `accountId` (string): The ID of the account to add.
  - `role` (string, optional): The role of the new member. Defaults to 'member'.
- **Returns:** `Promise<{ data: any | null, error: any }>`

#### `groups.removeMember(groupId: string, accountId: string)`
Removes a member from a group.
- **Parameters:**
  - `groupId` (string): The ID of the group.
  - `accountId` (string): The ID of the account to remove.
- **Returns:** `Promise<{ error: any }>`

---

## Federations <a name="federations"></a>

### Types

- `Federation`: Represents a federation row.
- `FederationInsert`: Represents a federation row for insertion.
- `FederationUpdate`: Represents a federation row for update.

### Functions

#### `federations.getAll()`
Retrieves all federations.
- **Returns:** `Promise<{ data: Federation[] | null, error: any }>`

#### `federations.getById(id: string)`
Retrieves a federation by its ID.
- **Parameters:**
  - `id` (string): The ID of the federation.
- **Returns:** `Promise<{ data: Federation | null, error: any }>`

#### `federations.getGroupsInFederation(federationId: string)`
Retrieves groups that are members of a federation.
- **Parameters:**
  - `federationId` (string): The ID of the federation.
- **Returns:** `Promise<{ data: any[] | null, error: any }>`

#### `federations.create(federation: FederationInsert)`
Creates a new federation.
- **Parameters:**
  - `federation` (FederationInsert): The federation data to insert.
- **Returns:** `Promise<{ data: Federation | null, error: any }>`

#### `federations.update(id: string, updates: FederationUpdate)`
Updates an existing federation.
- **Parameters:**
  - `id` (string): The ID of the federation to update.
  - `updates` (FederationUpdate): The federation data to update.
- **Returns:** `Promise<{ data: Federation | null, error: any }>`

#### `federations.delete(id: string)`
Deletes a federation.
- **Parameters:**
  - `id` (string): The ID of the federation to delete.
- **Returns:** `Promise<{ error: any }>`

#### `federations.addGroupToFederation(federationId: string, groupId: string)`
Adds a group to a federation.
- **Parameters:**
  - `federationId` (string): The ID of the federation.
  - `groupId` (string): The ID of the group to add.
- **Returns:** `Promise<{ data: any | null, error: any }>`

#### `federations.removeGroupFromFederation(federationId: string, groupId: string)`
Removes a group from a federation.
- **Parameters:**
  - `federationId` (string): The ID of the federation.
  - `groupId` (string): The ID of the group to remove.
- **Returns:** `Promise<{ error: any }>`

---

## Interactions <a name="interactions"></a>

### Types

- `Reaction`: Represents a reaction row.
- `ReactionInsert`: Represents a reaction row for insertion.
- `Follower`: Represents a follower row.
- `FollowerInsert`: Represents a follower row for insertion.

### Functions

#### `interactions.getPostReactions(postId: string)`
Retrieves reactions for a specific post.
- **Parameters:**
  - `postId` (string): The ID of the post.
- **Returns:** `Promise<{ data: any[] | null, error: any }>`

#### `interactions.addReaction(reaction: ReactionInsert)`
Adds a reaction to a post.
- **Parameters:**
  - `reaction` (ReactionInsert): The reaction data to insert.
- **Returns:** `Promise<{ data: Reaction | null, error: any }>`

#### `interactions.removeReaction(postId: string, accountId: string)`
Removes a reaction from a post.
- **Parameters:**
  - `postId` (string): The ID of the post.
  - `accountId` (string): The ID of the account.
- **Returns:** `Promise<{ error: any }>`

#### `interactions.follow(followerId: string, followingId: string)`
Makes one account follow another.
- **Parameters:**
  - `followerId` (string): The ID of the account that is following.
  - `followingId` (string): The ID of the account that is being followed.
- **Returns:** `Promise<{ data: Follower | null, error: any }>`

#### `interactions.unfollow(followerId: string, followingId: string)`
Makes one account unfollow another.
- **Parameters:**
  - `followerId` (string): The ID of the account that is following.
  - `followingId` (string): The ID of the account that is being followed.
- **Returns:** `Promise<{ error: any }>`

#### `interactions.getFollowers(accountId: string)`
Retrieves followers for a specific account.
- **Parameters:**
  - `accountId` (string): The ID of the account.
- **Returns:** `Promise<{ data: any[] | null, error: any }>`

#### `interactions.getFollowing(accountId: string)`
Retrieves accounts that a specific account is following.
- **Parameters:**
  - `accountId` (string): The ID of the account.
- **Returns:** `Promise<{ data: any[] | null, error: any }>`

---

## Client <a name="client"></a>

### `supabase`
The Supabase client instance, configured with the project URL and anonymous key.

---

## Types <a name="types"></a>

### `Json`
A type representing any valid JSON value.

### `Database`
The TypeScript representation of the Supabase database schema.

### Helper Types

#### `Tables<T>`
Extracts the Row type for a given table `T`.

#### `TablesInsert<T>`
Extracts the Insert type for a given table `T`.

#### `TablesUpdate<T>`
Extracts the Update type for a given table `T`.
