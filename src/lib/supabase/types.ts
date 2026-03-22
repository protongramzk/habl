export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      accounts: {
        Row: {
          bio: string | null
          created_at: string | null
          id: string
          pp_url: string | null
          updated_at: string | null
          username: string
        }
        Insert: {
          bio?: string | null
          created_at?: string | null
          id: string
          pp_url?: string | null
          updated_at?: string | null
          username: string
        }
        Update: {
          bio?: string | null
          created_at?: string | null
          id?: string
          pp_url?: string | null
          updated_at?: string | null
          username?: string
        }
        Relationships: []
      }
      comments: {
        Row: {
          account_id: string | null
          content: string | null
          created_at: string | null
          id: string
          parent_id: string | null
          post_id: string | null
        }
        Insert: {
          account_id?: string | null
          content?: string | null
          created_at?: string | null
          id?: string
          parent_id?: string | null
          post_id?: string | null
        }
        Update: {
          account_id?: string | null
          content?: string | null
          created_at?: string | null
          id?: string
          parent_id?: string | null
          post_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "comments_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      federation_members: {
        Row: {
          federation_id: string | null
          group_id: string | null
          id: string
        }
        Insert: {
          federation_id?: string | null
          group_id?: string | null
          id?: string
        }
        Update: {
          federation_id?: string | null
          group_id?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "federation_members_federation_id_fkey"
            columns: ["federation_id"]
            isOneToOne: false
            referencedRelation: "federations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "federation_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
        ]
      }
      federations: {
        Row: {
          cover_url: string | null
          created_at: string | null
          description: string | null
          id: string
          name: string
        }
        Insert: {
          cover_url?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          cover_url?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      followers: {
        Row: {
          created_at: string | null
          follower_id: string | null
          following_id: string | null
          id: string
        }
        Insert: {
          created_at?: string | null
          follower_id?: string | null
          following_id?: string | null
          id?: string
        }
        Update: {
          created_at?: string | null
          follower_id?: string | null
          following_id?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "followers_follower_id_fkey"
            columns: ["follower_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "followers_following_id_fkey"
            columns: ["following_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      group_members: {
        Row: {
          account_id: string | null
          created_at: string | null
          group_id: string | null
          id: string
          role: string | null
        }
        Insert: {
          account_id?: string | null
          created_at?: string | null
          group_id?: string | null
          id?: string
          role?: string | null
        }
        Update: {
          account_id?: string | null
          created_at?: string | null
          group_id?: string | null
          id?: string
          role?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "group_members_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
        ]
      }
      groups: {
        Row: {
          cover_url: string | null
          created_at: string | null
          description: string | null
          id: string
          name: string
          owner_id: string | null
        }
        Insert: {
          cover_url?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          owner_id?: string | null
        }
        Update: {
          cover_url?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          owner_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "groups_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          account_id: string | null
          caption: string | null
          created_at: string | null
          group_id: string | null
          id: string
          media: string[] | null
        }
        Insert: {
          account_id?: string | null
          caption?: string | null
          created_at?: string | null
          group_id?: string | null
          id?: string
          media?: string[] | null
        }
        Update: {
          account_id?: string | null
          caption?: string | null
          created_at?: string | null
          group_id?: string | null
          id?: string
          media?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "posts_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
        ]
      }
      reactions: {
        Row: {
          account_id: string | null
          created_at: string | null
          id: string
          post_id: string | null
          reaction: string | null
        }
        Insert: {
          account_id?: string | null
          created_at?: string | null
          id?: string
          post_id?: string | null
          reaction?: string | null
        }
        Update: {
          account_id?: string | null
          created_at?: string | null
          id?: string
          post_id?: string | null
          reaction?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reactions_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reactions_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  T extends keyof Database['public']['Tables']
> = Database['public']['Tables'][T]['Row']

export type TablesInsert<
  T extends keyof Database['public']['Tables']
> = Database['public']['Tables'][T]['Insert']

export type TablesUpdate<
  T extends keyof Database['public']['Tables']
> = Database['public']['Tables'][T]['Update']
