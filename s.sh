#!/bin/bash

# Script untuk membuat struktur folder dan file src/lib MVP
# Gunakan: bash create-lib.sh di root project (di sebelah src/)

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Creating src/lib structure for MVP...${NC}\n"

# ============================================================================
# CREATE FOLDERS
# ============================================================================

mkdir -p src/lib/stores
mkdir -p src/lib/services
mkdir -p src/lib/utils

echo -e "${GREEN}✓ Folders created${NC}\n"

# ============================================================================
# stores/auth.js
# ============================================================================

cat > src/lib/stores/auth.js << 'EOF'
import { writable, derived } from 'svelte/store'

// Main auth store
export const auth = writable({
  user: null,
  profile: null,
  loading: false,
  error: null
})

// Derived: Check if user is authenticated
export const isAuthenticated = derived(
  auth,
  ($auth) => $auth.user !== null && $auth.profile !== null
)

// Derived: Get user ID
export const userId = derived(
  auth,
  ($auth) => $auth.user?.id || null
)

// Derived: Get profile
export const userProfile = derived(
  auth,
  ($auth) => $auth.profile
)
EOF

echo -e "${GREEN}✓ stores/auth.js${NC}"

# ============================================================================
# stores/posts.js
# ============================================================================

cat > src/lib/stores/posts.js << 'EOF'
import { writable, derived } from 'svelte/store'

// Main posts store
export const posts = writable([])

// Comments store (for detail page)
export const comments = writable([])

// Loading states
export const postsLoading = writable(false)
export const commentsLoading = writable(false)

// Error states
export const postsError = writable(null)

// Derived: Sort posts by created_at descending
export const sortedPosts = derived(
  posts,
  ($posts) => {
    return $posts.sort((a, b) => 
      new Date(b.created_at) - new Date(a.created_at)
    )
  }
)

// Derived: Count posts
export const postsCount = derived(
  posts,
  ($posts) => $posts.length
)
EOF

echo -e "${GREEN}✓ stores/posts.js${NC}"

# ============================================================================
# stores/groups.js
# ============================================================================

cat > src/lib/stores/groups.js << 'EOF'
import { writable, derived } from 'svelte/store'

// Main groups store
export const groups = writable([])

// Loading state
export const groupsLoading = writable(false)

// Error state
export const groupsError = writable(null)

// Derived: Build hierarchical tree from flat groups
export const groupTree = derived(
  groups,
  ($groups) => {
    if (!$groups || $groups.length === 0) return []

    // Recursive function to build tree
    const buildTree = (parentId) => {
      return $groups
        .filter(g => g.parent_id === parentId)
        .map(group => ({
          ...group,
          children: buildTree(group.id)
        }))
    }

    // Return only root groups (parent_id = null)
    return buildTree(null)
  }
)

// Derived: Get single group with children
export function getGroupWithChildren(groupId) {
  return derived(
    groups,
    ($groups) => {
      const group = $groups.find(g => g.id === groupId)
      if (!group) return null

      return {
        ...group,
        children: $groups.filter(g => g.parent_id === groupId)
      }
    }
  )
}

// Derived: Get group by slug
export function getGroupBySlug(slug) {
  return derived(
    groups,
    ($groups) => $groups.find(g => g.slug === slug)
  )
}

// Derived: Count groups
export const groupsCount = derived(
  groups,
  ($groups) => $groups.length
)
EOF

echo -e "${GREEN}✓ stores/groups.js${NC}"

# ============================================================================
# stores/ui.js
# ============================================================================

cat > src/lib/stores/ui.js << 'EOF'
import { writable } from 'svelte/store'

// Modal state
export const modal = writable({
  isOpen: false,
  type: null,
  data: null
})

// Toast notifications
export const toasts = writable([])

// Global loading
export const appLoading = writable(false)

// Global error
export const appError = writable(null)

// Helper: Open modal
export function openModal(type, data = null) {
  modal.set({
    isOpen: true,
    type,
    data
  })
}

// Helper: Close modal
export function closeModal() {
  modal.set({
    isOpen: false,
    type: null,
    data: null
  })
}

// Helper: Add toast notification
export function addToast(message, type = 'info', duration = 3000) {
  const id = Math.random().toString(36).substr(2, 9)
  const toast = { id, message, type }
  
  toasts.update(t => [...t, toast])
  
  // Auto remove after duration
  setTimeout(() => {
    toasts.update(t => t.filter(x => x.id !== id))
  }, duration)
  
  return id
}

// Helper: Remove toast
export function removeToast(id) {
  toasts.update(t => t.filter(x => x.id !== id))
}
EOF

echo -e "${GREEN}✓ stores/ui.js${NC}"

# ============================================================================
# services/supabase.js
# ============================================================================

cat > src/lib/services/supabase.js << 'EOF'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables. Check .env.local')
}

export const supabase = createClient(supabaseUrl, supabaseKey)
EOF

echo -e "${GREEN}✓ services/supabase.js${NC}"

# ============================================================================
# services/auth.js
# ============================================================================

cat > src/lib/services/auth.js << 'EOF'
import { supabase } from './supabase.js'
import { auth } from '../stores/auth.js'
import { addToast } from '../stores/ui.js'

/**
 * Sign up new user
 * @param {string} email
 * @param {string} password
 * @param {string} username
 * @returns {Promise<object>} User data
 */
export async function signUp(email, password, username) {
  try {
    // Create auth user
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password
    })

    if (signUpError) throw signUpError

    // Create profile
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: signUpData.user.id,
        username,
        display_name: username,
        created_at: new Date().toISOString()
      })

    if (profileError) throw profileError

    addToast('Account created! Please check your email to confirm.', 'success')
    return signUpData.user
  } catch (error) {
    addToast(error.message, 'error')
    throw error
  }
}

/**
 * Sign in user
 * @param {string} email
 * @param {string} password
 * @returns {Promise<object>} User and profile data
 */
export async function signIn(email, password) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) throw error

    // Fetch profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single()

    if (profileError) throw profileError

    auth.set({
      user: data.user,
      profile,
      loading: false,
      error: null
    })

    addToast(`Welcome back, ${profile.display_name}!`, 'success')
    return { user: data.user, profile }
  } catch (error) {
    addToast(error.message, 'error')
    throw error
  }
}

/**
 * Sign out user
 * @returns {Promise<void>}
 */
export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error

    auth.set({
      user: null,
      profile: null,
      loading: false,
      error: null
    })

    addToast('Logged out', 'info')
  } catch (error) {
    addToast(error.message, 'error')
    throw error
  }
}

/**
 * Get current logged in user
 * @returns {Promise<object|null>} User data or null
 */
export async function getCurrentUser() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error

    if (user) {
      // Fetch profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profileError) throw profileError

      auth.set({
        user,
        profile,
        loading: false,
        error: null
      })
    }

    return user
  } catch (error) {
    console.error('Error getting current user:', error)
    auth.set({
      user: null,
      profile: null,
      loading: false,
      error: error.message
    })
  }
}

/**
 * Update user profile
 * @param {string} userId
 * @param {object} updates - Profile data to update
 * @returns {Promise<object>} Updated profile
 */
export async function updateProfile(userId, updates) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()

    if (error) throw error

    auth.update(a => ({
      ...a,
      profile: data
    }))

    addToast('Profile updated', 'success')
    return data
  } catch (error) {
    addToast(error.message, 'error')
    throw error
  }
}
EOF

echo -e "${GREEN}✓ services/auth.js${NC}"

# ============================================================================
# services/posts.js
# ============================================================================

cat > src/lib/services/posts.js << 'EOF'
import { supabase } from './supabase.js'
import { posts, comments } from '../stores/posts.js'
import { addToast } from '../stores/ui.js'

/**
 * Fetch feed with pagination
 * @param {number} limit
 * @param {number} offset
 * @returns {Promise<array>} Posts array
 */
export async function fetchFeed(limit = 20, offset = 0) {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select(\`
        *,
        profiles!author_id(id, username, display_name, avatar_url),
        comments(count),
        reactions(count)
      \`)
      .eq('visibility', 'public')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) throw error
    return data || []
  } catch (error) {
    addToast(error.message, 'error')
    throw error
  }
}

/**
 * Create new post
 * @param {string} authorId
 * @param {string} content
 * @param {string|null} groupId
 * @param {string} visibility
 * @returns {Promise<object>} Created post
 */
export async function createPost(authorId, content, groupId = null, visibility = 'public') {
  try {
    const { data, error } = await supabase
      .from('posts')
      .insert({
        author_type: 'profile',
        author_id: authorId,
        content,
        group_id: groupId,
        visibility,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select(\`
        *,
        profiles!author_id(id, username, display_name, avatar_url)
      \`)

    if (error) throw error

    posts.update(p => [data[0], ...p])
    addToast('Post created!', 'success')
    return data[0]
  } catch (error) {
    addToast(error.message, 'error')
    throw error
  }
}

/**
 * Get single post
 * @param {string} postId
 * @returns {Promise<object>} Post data
 */
export async function getPost(postId) {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select(\`
        *,
        profiles!author_id(id, username, display_name, avatar_url)
      \`)
      .eq('id', postId)
      .single()

    if (error) throw error
    return data
  } catch (error) {
    addToast(error.message, 'error')
    throw error
  }
}

/**
 * Update post
 * @param {string} postId
 * @param {string} content
 * @returns {Promise<object>} Updated post
 */
export async function updatePost(postId, content) {
  try {
    const { data, error } = await supabase
      .from('posts')
      .update({
        content,
        updated_at: new Date().toISOString()
      })
      .eq('id', postId)
      .select()
      .single()

    if (error) throw error

    posts.update(p => p.map(post => 
      post.id === postId ? data : post
    ))

    addToast('Post updated', 'success')
    return data
  } catch (error) {
    addToast(error.message, 'error')
    throw error
  }
}

/**
 * Delete post
 * @param {string} postId
 * @returns {Promise<void>}
 */
export async function deletePost(postId) {
  try {
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', postId)

    if (error) throw error

    posts.update(p => p.filter(post => post.id !== postId))
    addToast('Post deleted', 'success')
  } catch (error) {
    addToast(error.message, 'error')
    throw error
  }
}

/**
 * Fetch comments for post
 * @param {string} postId
 * @returns {Promise<array>} Comments array
 */
export async function fetchPostComments(postId) {
  try {
    const { data, error } = await supabase
      .from('comments')
      .select(\`
        *,
        profiles!author_id(id, username, display_name, avatar_url)
      \`)
      .eq('post_id', postId)
      .order('created_at', { ascending: true })

    if (error) throw error

    comments.set(data || [])
    return data || []
  } catch (error) {
    addToast(error.message, 'error')
    throw error
  }
}

/**
 * Create comment
 * @param {string} postId
 * @param {string} authorId
 * @param {string} content
 * @param {string|null} parentId
 * @returns {Promise<object>} Created comment
 */
export async function createComment(postId, authorId, content, parentId = null) {
  try {
    const { data, error } = await supabase
      .from('comments')
      .insert({
        post_id: postId,
        author_type: 'profile',
        author_id: authorId,
        content,
        parent_id: parentId,
        created_at: new Date().toISOString()
      })
      .select(\`
        *,
        profiles!author_id(id, username, display_name, avatar_url)
      \`)

    if (error) throw error

    comments.update(c => [...c, data[0]])
    addToast('Comment added!', 'success')
    return data[0]
  } catch (error) {
    addToast(error.message, 'error')
    throw error
  }
}

/**
 * Delete comment
 * @param {string} commentId
 * @returns {Promise<void>}
 */
export async function deleteComment(commentId) {
  try {
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', commentId)

    if (error) throw error

    comments.update(c => c.filter(com => com.id !== commentId))
    addToast('Comment deleted', 'success')
  } catch (error) {
    addToast(error.message, 'error')
    throw error
  }
}

/**
 * Add reaction to post or comment
 * @param {string} userId
 * @param {string} targetType - 'post' or 'comment'
 * @param {string} targetId
 * @param {string} reactionType - 'like', 'love', 'laugh', 'angry'
 * @returns {Promise<void>}
 */
export async function addReaction(userId, targetType, targetId, reactionType) {
  try {
    const { error } = await supabase
      .from('reactions')
      .upsert({
        user_id: userId,
        target_type: targetType,
        target_id: targetId,
        type: reactionType,
        created_at: new Date().toISOString()
      })

    if (error) throw error

    addToast('Reaction added!', 'success')
  } catch (error) {
    addToast(error.message, 'error')
    throw error
  }
}

/**
 * Remove reaction
 * @param {string} userId
 * @param {string} targetType
 * @param {string} targetId
 * @returns {Promise<void>}
 */
export async function removeReaction(userId, targetType, targetId) {
  try {
    const { error } = await supabase
      .from('reactions')
      .delete()
      .eq('user_id', userId)
      .eq('target_type', targetType)
      .eq('target_id', targetId)

    if (error) throw error

    addToast('Reaction removed', 'success')
  } catch (error) {
    addToast(error.message, 'error')
    throw error
  }
}
EOF

echo -e "${GREEN}✓ services/posts.js${NC}"

# ============================================================================
# services/groups.js
# ============================================================================

cat > src/lib/services/groups.js << 'EOF'
import { supabase } from './supabase.js'
import { groups } from '../stores/groups.js'
import { addToast } from '../stores/ui.js'

/**
 * Fetch all groups
 * @returns {Promise<array>} Groups array
 */
export async function fetchAllGroups() {
  try {
    const { data, error } = await supabase
      .from('groups')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    groups.set(data || [])
    return data || []
  } catch (error) {
    addToast(error.message, 'error')
    throw error
  }
}

/**
 * Get group by slug
 * @param {string} slug
 * @returns {Promise<object>} Group data
 */
export async function getGroupBySlug(slug) {
  try {
    const { data, error } = await supabase
      .from('groups')
      .select('*')
      .eq('slug', slug)
      .single()

    if (error) throw error
    return data
  } catch (error) {
    addToast(error.message, 'error')
    throw error
  }
}

/**
 * Create new group
 * @param {string} name
 * @param {string} type - 'alliance', 'federation', 'group', 'subgroup'
 * @param {string|null} parentId
 * @param {string} ownerId
 * @returns {Promise<object>} Created group
 */
export async function createGroup(name, type, parentId = null, ownerId) {
  try {
    // Generate slug
    const slug = name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '')

    const { data, error } = await supabase
      .from('groups')
      .insert({
        name,
        slug,
        type,
        parent_id: parentId,
        owner_type: 'profile',
        owner_id: ownerId,
        created_at: new Date().toISOString()
      })
      .select()

    if (error) throw error

    groups.update(g => [data[0], ...g])

    addToast(\`Group "\${name}" created!\`, 'success')
    return data[0]
  } catch (error) {
    addToast(error.message, 'error')
    throw error
  }
}

/**
 * Update group
 * @param {string} groupId
 * @param {object} updates
 * @returns {Promise<object>} Updated group
 */
export async function updateGroup(groupId, updates) {
  try {
    const { data, error } = await supabase
      .from('groups')
      .update(updates)
      .eq('id', groupId)
      .select()
      .single()

    if (error) throw error

    groups.update(g => g.map(group => 
      group.id === groupId ? data : group
    ))

    addToast('Group updated', 'success')
    return data
  } catch (error) {
    addToast(error.message, 'error')
    throw error
  }
}

/**
 * Delete group
 * @param {string} groupId
 * @returns {Promise<void>}
 */
export async function deleteGroup(groupId) {
  try {
    const { error } = await supabase
      .from('groups')
      .delete()
      .eq('id', groupId)

    if (error) throw error

    groups.update(g => g.filter(group => group.id !== groupId))

    addToast('Group deleted', 'success')
  } catch (error) {
    addToast(error.message, 'error')
    throw error
  }
}

/**
 * Get group members
 * @param {string} groupId
 * @returns {Promise<array>} Members array
 */
export async function getGroupMembers(groupId) {
  try {
    const { data, error } = await supabase
      .from('group_members')
      .select(\`
        *,
        profiles!member_id(id, username, display_name, avatar_url)
      \`)
      .eq('group_id', groupId)
      .eq('member_type', 'profile')

    if (error) throw error
    return data || []
  } catch (error) {
    addToast(error.message, 'error')
    throw error
  }
}

/**
 * Join group
 * @param {string} groupId
 * @param {string} userId
 * @returns {Promise<void>}
 */
export async function joinGroup(groupId, userId) {
  try {
    const { error } = await supabase
      .from('group_members')
      .insert({
        group_id: groupId,
        member_type: 'profile',
        member_id: userId,
        role: 'member',
        joined_at: new Date().toISOString()
      })

    if (error) throw error

    addToast('Joined group!', 'success')
  } catch (error) {
    addToast(error.message, 'error')
    throw error
  }
}

/**
 * Leave group
 * @param {string} groupId
 * @param {string} userId
 * @returns {Promise<void>}
 */
export async function leaveGroup(groupId, userId) {
  try {
    const { error } = await supabase
      .from('group_members')
      .delete()
      .eq('group_id', groupId)
      .eq('member_id', userId)
      .eq('member_type', 'profile')

    if (error) throw error

    addToast('Left group', 'success')
  } catch (error) {
    addToast(error.message, 'error')
    throw error
  }
}

/**
 * Get posts in group
 * @param {string} groupId
 * @returns {Promise<array>} Posts array
 */
export async function getGroupPosts(groupId) {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select(\`
        *,
        profiles!author_id(id, username, display_name, avatar_url)
      \`)
      .eq('group_id', groupId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    addToast(error.message, 'error')
    throw error
  }
}
EOF

echo -e "${GREEN}✓ services/groups.js${NC}"

# ============================================================================
# services/profiles.js
# ============================================================================

cat > src/lib/services/profiles.js << 'EOF'
import { supabase } from './supabase.js'
import { addToast } from '../stores/ui.js'

/**
 * Get profile by user ID
 * @param {string} userId
 * @returns {Promise<object>} Profile data
 */
export async function getProfile(userId) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) throw error
    return data
  } catch (error) {
    addToast(error.message, 'error')
    throw error
  }
}

/**
 * Get profile by username
 * @param {string} username
 * @returns {Promise<object>} Profile data
 */
export async function getProfileByUsername(username) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('username', username)
      .single()

    if (error) throw error
    return data
  } catch (error) {
    addToast(error.message, 'error')
    throw error
  }
}

/**
 * Get user's posts
 * @param {string} userId
 * @returns {Promise<array>} Posts array
 */
export async function getUserPosts(userId) {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select(\`
        *,
        profiles!author_id(id, username, display_name, avatar_url)
      \`)
      .eq('author_id', userId)
      .eq('author_type', 'profile')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    addToast(error.message, 'error')
    throw error
  }
}

/**
 * Get user's groups
 * @param {string} userId
 * @returns {Promise<array>} Groups array
 */
export async function getUserGroups(userId) {
  try {
    const { data, error } = await supabase
      .from('group_members')
      .select('groups(*)')
      .eq('member_id', userId)
      .eq('member_type', 'profile')

    if (error) throw error
    
    return data?.map(item => item.groups) || []
  } catch (error) {
    addToast(error.message, 'error')
    throw error
  }
}
EOF

echo -e "${GREEN}✓ services/profiles.js${NC}"

# ============================================================================
# utils/constants.js
# ============================================================================

cat > src/lib/utils/constants.js << 'EOF'
// Group types
export const GROUP_TYPES = {
  ALLIANCE: 'alliance',
  FEDERATION: 'federation',
  GROUP: 'group',
  SUBGROUP: 'subgroup'
}

// Member roles
export const MEMBER_ROLES = {
  MEMBER: 'member',
  MODERATOR: 'moderator',
  ADMIN: 'admin'
}

// Page roles
export const PAGE_ROLES = {
  OWNER: 'owner',
  ADMIN: 'admin',
  EDITOR: 'editor',
  MODERATOR: 'moderator'
}

// Relation status
export const RELATION_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  BLOCKED: 'blocked'
}

// Reaction types
export const REACTION_TYPES = {
  LIKE: 'like',
  LOVE: 'love',
  LAUGH: 'laugh',
  ANGRY: 'angry'
}

// Visibility
export const VISIBILITY = {
  PUBLIC: 'public',
  FOLLOWERS: 'followers',
  GROUP: 'group'
}

// Toast types
export const TOAST_TYPES = {
  INFO: 'info',
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning'
}
EOF

echo -e "${GREEN}✓ utils/constants.js${NC}"

# ============================================================================
# utils/helpers.js
# ============================================================================

cat > src/lib/utils/helpers.js << 'EOF'
/**
 * Format date to readable string
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date
 */
export function formatDate(date) {
  const d = new Date(date)
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

/**
 * Convert text to URL-friendly slug
 * @param {string} text - Text to slugify
 * @returns {string} Slug
 */
export function slugify(text) {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Truncate text to max length with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export function truncate(text, maxLength = 100) {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

/**
 * Format number with K/M suffix
 * @param {number} num - Number to format
 * @returns {string} Formatted number
 */
export function formatNumber(num) {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
  return num.toString()
}

/**
 * Get initials from name
 * @param {string} name - Full name
 * @returns {string} Initials (max 2 chars)
 */
export function getInitials(name) {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

/**
 * Check if user can edit post
 * @param {string} currentUserId - Current user ID
 * @param {object} post - Post object
 * @returns {boolean} Can edit
 */
export function canEditPost(currentUserId, post) {
  return post.author_id === currentUserId && post.author_type === 'profile'
}

/**
 * Check if user can delete post
 * @param {string} currentUserId - Current user ID
 * @param {object} post - Post object
 * @returns {boolean} Can delete
 */
export function canDeletePost(currentUserId, post) {
  return canEditPost(currentUserId, post)
}

/**
 * Get time ago string
 * @param {string|Date} date - Date
 * @returns {string} Time ago
 */
export function getTimeAgo(date) {
  const d = new Date(date)
  const now = new Date()
  const seconds = Math.floor((now - d) / 1000)

  if (seconds < 60) return 'just now'
  if (seconds < 3600) return \`\${Math.floor(seconds / 60)}m ago\`
  if (seconds < 86400) return \`\${Math.floor(seconds / 3600)}h ago\`
  if (seconds < 604800) return \`\${Math.floor(seconds / 86400)}d ago\`
  
  return formatDate(date)
}

/**
 * Debounce function
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in ms
 * @returns {Function} Debounced function
 */
export function debounce(func, delay = 300) {
  let timeout
  return function (...args) {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), delay)
  }
}
EOF

echo -e "${GREEN}✓ utils/helpers.js${NC}"

# ============================================================================
# utils/validators.js
# ============================================================================

cat > src/lib/utils/validators.js << 'EOF'
/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} Is valid email
 */
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {object} {isValid, errors}
 */
export function validatePassword(password) {
  const errors = []

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters')
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain uppercase letter')
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain number')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Validate username format
 * @param {string} username - Username to validate
 * @returns {object} {isValid, error}
 */
export function validateUsername(username) {
  if (username.length < 3) {
    return { isValid: false, error: 'Username must be at least 3 characters' }
  }
  if (username.length > 20) {
    return { isValid: false, error: 'Username must be max 20 characters' }
  }
  if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
    return { isValid: false, error: 'Username can only contain letters, numbers, _ and -' }
  }
  return { isValid: true, error: null }
}

/**
 * Validate post content
 * @param {string} content - Content to validate
 * @returns {object} {isValid, error}
 */
export function validatePostContent(content) {
  const trimmed = content.trim()

  if (trimmed.length === 0) {
    return { isValid: false, error: 'Post cannot be empty' }
  }
  if (trimmed.length > 5000) {
    return { isValid: false, error: 'Post must be max 5000 characters' }
  }

  return { isValid: true, error: null }
}

/**
 * Validate group name
 * @param {string} name - Group name to validate
 * @returns {object} {isValid, error}
 */
export function validateGroupName(name) {
  const trimmed = name.trim()

  if (trimmed.length === 0) {
    return { isValid: false, error: 'Group name cannot be empty' }
  }
  if (trimmed.length > 100) {
    return { isValid: false, error: 'Group name must be max 100 characters' }
  }

  return { isValid: true, error: null }
}
EOF

echo -e "${GREEN}✓ utils/validators.js${NC}"

# ============================================================================
# types.ts
# ============================================================================

cat > src/lib/types.ts << 'EOF'
// User/Profile types
export interface Profile {
  id: string
  username: string
  display_name: string
  bio?: string
  avatar_url?: string
  created_at: string
}

export interface AuthUser {
  id: string
  email: string
  user_metadata?: Record<string, any>
}

// Post types
export interface Post {
  id: string
  author_type: 'profile' | 'page'
  author_id: string
  profiles?: Profile
  content: string
  group_id?: string
  media_urls?: string[]
  visibility: 'public' | 'followers' | 'group'
  created_at: string
  updated_at: string
}

export interface Comment {
  id: string
  post_id: string
  author_type: 'profile' | 'page'
  author_id: string
  profiles?: Profile
  content: string
  parent_id?: string
  created_at: string
}

// Group types
export interface Group {
  id: string
  name: string
  slug: string
  description?: string
  type: 'alliance' | 'federation' | 'group' | 'subgroup'
  parent_id?: string
  owner_type: 'profile' | 'page'
  owner_id: string
  created_at: string
  children?: Group[]
}

export interface GroupMember {
  group_id: string
  member_type: 'profile' | 'page'
  member_id: string
  role: 'member' | 'moderator' | 'admin'
  joined_at: string
  profiles?: Profile
}

// Reaction types
export interface Reaction {
  user_id: string
  target_type: 'post' | 'comment'
  target_id: string
  type: 'like' | 'love' | 'laugh' | 'angry'
  created_at: string
}

// UI types
export interface Toast {
  id: string
  message: string
  type: 'info' | 'success' | 'error' | 'warning'
}

export interface Modal {
  isOpen: boolean
  type: string | null
  data: any
}
EOF

echo -e "${GREEN}✓ types.ts${NC}"

# ============================================================================
# SUMMARY
# ============================================================================

echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}✓ All 13 files created successfully!${NC}"
echo -e "${BLUE}========================================${NC}\n"

echo "Folder structure:"
echo "  src/lib/stores/       (4 files)"
echo "  src/lib/services/     (5 files)"
echo "  src/lib/utils/        (3 files)"
echo "  src/lib/types.ts      (1 file)"
echo ""

echo "Files created:"
echo "  ✓ stores/auth.js"
echo "  ✓ stores/posts.js"
echo "  ✓ stores/groups.js"
echo "  ✓ stores/ui.js"
echo "  ✓ services/supabase.js"
echo "  ✓ services/auth.js"
echo "  ✓ services/posts.js"
echo "  ✓ services/groups.js"
echo "  ✓ services/profiles.js"
echo "  ✓ utils/constants.js"
echo "  ✓ utils/helpers.js"
echo "  ✓ utils/validators.js"
echo "  ✓ types.ts"
echo ""

echo -e "${BLUE}Next steps:${NC}"
echo "  1. npm install"
echo "  2. Create .env.local with Supabase credentials"
echo "  3. Setup database tables (use SQL schema from docs)"
echo "  4. Start building routes/pages"
echo "  5. Import from \$lib/stores and \$lib/services"
echo ""

echo -e "${GREEN}Ready to code! 🚀${NC}\n"
EOF

echo -e "${GREEN}✓ Script created at: create-lib.sh${NC}\n"

# ============================================================================
# MAKE SCRIPT EXECUTABLE
# ============================================================================

chmod +x create-lib.sh

echo -e "${BLUE}Script is executable. Run with: bash create-lib.sh${NC}\n"
