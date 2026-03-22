import { supabase } from './client';
import type { Tables, TablesInsert, TablesUpdate } from './types';

export type Account = Tables<'accounts'>;
export type AccountInsert = TablesInsert<'accounts'>;
export type AccountUpdate = TablesUpdate<'accounts'>;

export const accounts = {
  async getById(id: string) {
    const { data, error } = await supabase
      .from('accounts')
      .select('*')
      .eq('id', id)
      .single();
    return { data, error };
  },

  async getByUsername(username: string) {
    const { data, error } = await supabase
      .from('accounts')
      .select('*')
      .eq('username', username)
      .single();
    return { data, error };
  },

  async create(account: AccountInsert) {
    const { data, error } = await supabase
      .from('accounts')
      .insert(account)
      .select()
      .single();
    return { data, error };
  },

  async update(id: string, updates: AccountUpdate) {
    const { data, error } = await supabase
      .from('accounts')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    return { data, error };
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('accounts')
      .delete()
      .eq('id', id);
    return { error };
  }
};
