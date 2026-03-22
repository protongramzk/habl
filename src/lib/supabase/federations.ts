import { supabase } from './client';
import type { Tables, TablesInsert, TablesUpdate } from './types';

export type Federation = Tables<'federations'>;
export type FederationInsert = TablesInsert<'federations'>;
export type FederationUpdate = TablesUpdate<'federations'>;

export const federations = {
  async getAll() {
    const { data, error } = await supabase
      .from('federations')
      .select('*')
      .order('name', { ascending: true });
    return { data, error };
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('federations')
      .select('*')
      .eq('id', id)
      .single();
    return { data, error };
  },

  async getGroupsInFederation(federationId: string) {
    const { data, error } = await supabase
      .from('federation_members')
      .select('*, groups(*)')
      .eq('federation_id', federationId);
    return { data, error };
  },

  async create(federation: FederationInsert) {
    const { data, error } = await supabase
      .from('federations')
      .insert(federation)
      .select()
      .single();
    return { data, error };
  },

  async update(id: string, updates: FederationUpdate) {
    const { data, error } = await supabase
      .from('federations')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    return { data, error };
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('federations')
      .delete()
      .eq('id', id);
    return { error };
  },

  async addGroupToFederation(federationId: string, groupId: string) {
    const { data, error } = await supabase
      .from('federation_members')
      .insert({ federation_id: federationId, group_id: groupId })
      .select()
      .single();
    return { data, error };
  },

  async removeGroupFromFederation(federationId: string, groupId: string) {
    const { error } = await supabase
      .from('federation_members')
      .delete()
      .eq('federation_id', federationId)
      .eq('group_id', groupId);
    return { error };
  }
};
