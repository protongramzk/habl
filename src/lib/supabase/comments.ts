import { supabase } from './client';
import type { Tables, TablesInsert, TablesUpdate } from './types';

export type Comment = Tables<'comments'>;
export type CommentInsert = TablesInsert<'comments'>;
export type CommentUpdate = TablesUpdate<'comments'>;

export const comments = {
  async getByPostId(postId: string) {
    const { data, error } = await supabase
      .from('comments')
      .select('*, accounts(username, pp_url)')
      .eq('post_id', postId)
      .order('created_at', { ascending: true });
    return { data, error };
  },

  async getReplies(parentId: string) {
    const { data, error } = await supabase
      .from('comments')
      .select('*, accounts(username, pp_url)')
      .eq('parent_id', parentId)
      .order('created_at', { ascending: true });
    return { data, error };
  },

  async create(comment: CommentInsert) {
    const { data, error } = await supabase
      .from('comments')
      .insert(comment)
      .select()
      .single();
    return { data, error };
  },

  async update(id: string, updates: CommentUpdate) {
    const { data, error } = await supabase
      .from('comments')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    return { data, error };
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', id);
    return { error };
  }
};
