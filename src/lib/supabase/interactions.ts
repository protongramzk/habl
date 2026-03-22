import { supabase } from './client';
import type { Tables, TablesInsert, TablesUpdate } from './types';

export type Reaction = Tables<'reactions'>;
export type ReactionInsert = TablesInsert<'reactions'>;

export type Follower = Tables<'followers'>;
export type FollowerInsert = TablesInsert<'followers'>;

export const interactions = {
  // Reactions
  async getPostReactions(postId: string) {
    const { data, error } = await supabase
      .from('reactions')
      .select('*, accounts(username)')
      .eq('post_id', postId);
    return { data, error };
  },

  async addReaction(reaction: ReactionInsert) {
    const { data, error } = await supabase
      .from('reactions')
      .insert(reaction)
      .select()
      .single();
    return { data, error };
  },

  async removeReaction(postId: string, accountId: string) {
    const { error } = await supabase
      .from('reactions')
      .delete()
      .eq('post_id', postId)
      .eq('account_id', accountId);
    return { error };
  },

  // Followers
  async follow(followerId: string, followingId: string) {
    const { data, error } = await supabase
      .from('followers')
      .insert({ follower_id: followerId, following_id: followingId })
      .select()
      .single();
    return { data, error };
  },

  async unfollow(followerId: string, followingId: string) {
    const { error } = await supabase
      .from('followers')
      .delete()
      .eq('follower_id', followerId)
      .eq('following_id', followingId);
    return { error };
  },

  async getFollowers(accountId: string) {
    const { data, error } = await supabase
      .from('followers')
      .select('*, accounts!followers_follower_id_fkey(username, pp_url)')
      .eq('following_id', accountId);
    return { data, error };
  },

  async getFollowing(accountId: string) {
    const { data, error } = await supabase
      .from('followers')
      .select('*, accounts!followers_following_id_fkey(username, pp_url)')
      .eq('follower_id', accountId);
    return { data, error };
  }
};
