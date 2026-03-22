import { supabase } from './client';
import type { Tables, TablesInsert, TablesUpdate } from './types';

export type Group = Tables<'groups'>;
export type GroupInsert = TablesInsert<'groups'>;
export type GroupUpdate = TablesUpdate<'groups'>;

export const groups = {
  async getAll(limit = 20, offset = 0) {
    const { data, error } = await supabase
      .from('groups')
      .select('*')
      .order('name', { ascending: true })
      .range(offset, offset + limit - 1);
    return { data, error };
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('groups')
      .select('*, accounts(username)')
      .eq('id', id)
      .single();
    return { data, error };
  },

  async getMembers(groupId: string) {
    const { data, error } = await supabase
      .from('group_members')
      .select('*, accounts(username, pp_url)')
      .eq('group_id', groupId);
    return { data, error };
  },

  async create(group: GroupInsert) {
    const { data, error } = await supabase
      .from('groups')
      .insert(group)
      .select()
      .single();
    return { data, error };
  },

  async update(id: string, updates: GroupUpdate) {
    const { data, error } = await supabase
      .from('groups')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    return { data, error };
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('groups')
      .delete()
      .eq('id', id);
    return { error };
  },

  async addMember(groupId: string, accountId: string, role = 'member') {
    const { data, error } = await supabase
      .from('group_members')
      .insert({ group_id: groupId, account_id: accountId, role })
      .select()
      .single();
    return { data, error };
  },

  async removeMember(groupId: string, accountId: string) {
    const { error } = await supabase
      .from('group_members')
      .delete()
      .eq('group_id', groupId)
      .eq('account_id', accountId);
    return { error };
  }
};
