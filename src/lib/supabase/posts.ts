import { supabase } from './client';
import type { Tables, TablesInsert, TablesUpdate } from './types';

export type Post = Tables<'posts'>;
export type PostInsert = TablesInsert<'posts'>;
export type PostUpdate = TablesUpdate<'posts'>;

export const posts = {
  async getAll(limit = 20, offset = 0) {
    const { data, error } = await supabase
      .from('posts')
      .select('*, accounts(username, pp_url)')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    return { data, error };
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('posts')
      .select('*, accounts(username, pp_url), groups(name)')
      .eq('id', id)
      .single();
    return { data, error };
  },

  async getByAccountId(accountId: string, limit = 20, offset = 0) {
    const { data, error } = await supabase
      .from('posts')
      .select('*, accounts(username, pp_url)')
      .eq('account_id', accountId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    return { data, error };
  },

  async getByGroupId(groupId: string, limit = 20, offset = 0) {
    const { data, error } = await supabase
      .from('posts')
      .select('*, accounts(username, pp_url)')
      .eq('group_id', groupId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    return { data, error };
  },

  async create(post: PostInsert) {
    const { data, error } = await supabase
      .from('posts')
      .insert(post)
      .select()
      .single();
    return { data, error };
  },

  async update(id: string, updates: PostUpdate) {
    const { data, error } = await supabase
      .from('posts')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    return { data, error };
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', id);
    return { error };
  }
};
