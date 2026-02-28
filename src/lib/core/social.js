reate a follow relation
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 *  * @param {string} userId - follower (profile id)
    *   * @param {string} targetId - followed (profile id)
    *    * @returns {Promise<{data: any, error: any}>}
    *     */
    export async function follow(supabase, userId, targetId) {
            try {
                        if (!userId || !targetId) {
                                        return { data: null, error: new Error('Missing user or target ID') };
                                    }

                        if (userId === targetId) {
                                        return { data: null, error: new Error('Cannot follow yourself') };
                                    }

                        const { data, error } = await supabase
                            .from('relations')
                            .insert({
                                                user_id: userId,
                                                target_id: targetId,
                                                status: 'accepted'
                                            })
                            .select()
                            .single();

                        return { data, error };
                    } catch (err) {
                                return { data: null, error: err };
                            }
    }

/**
 *  * Unfollow
 *   * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 *    * @param {string} userId
 *     * @param {string} targetId
 *      * @returns {Promise<{data: any, error: any}>}
 *       */
export async function unfollow(supabase, userId, targetId) {
        try {
                    if (!userId || !targetId) {
                                    return { data: null, error: new Error('Missing user or target ID') };
                                }

                    const { data, error } = await supabase
                        .from('relations')
                        .delete()
                        .match({
                                            user_id: userId,
                                            target_id: targetId
                                        })
                        .select()
                        .single();

                    return { data, error };
                } catch (err) {
                            return { data: null, error: err };
                        }
}

/**
 *  * Get followers of a profile
 *   * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 *    * @param {string} userId
 *     * @param {number} limit
 *      * @returns {Promise<{data: any[], error: any}>}
 *       */
export async function getFollowers(supabase, userId, limit = 50) {
        try {
                    if (!userId) {
                                    return { data: null, error: new Error('Invalid user ID') };
                                }

                    const { data, error } = await supabase
                        .from('relations')
                        .select('*, user:user_id(id, username, display_name, avatar_url)')
                        .eq('target_id', userId)
                        .eq('status', 'accepted')
                        .limit(limit);

                    return { data: data || [], error };
                } catch (err) {
                            return { data: null, error: err };
                        }
}

/**
 *  * Get following list of a profile
 *   * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 *    * @param {string} userId
 *     * @param {number} limit
 *      * @returns {Promise<{data: any[], error: any}>}
 *       */
export async function getFollowing(supabase, userId, limit = 50) {
        try {
                    if (!userId) {
                                    return { data: null, error: new Error('Invalid user ID') };
                                }

                    const { data, error } = await supabase
                        .from('relations')
                        .select('*, target:target_id(id, username, display_name, avatar_url)')
                        .eq('user_id', userId)
                        .eq('status', 'accepted')
                        .limit(limit);

                    return { data: data || [], error };
                } catch (err) {
                            return { data: null, error: err };
                        }
}

/**
 *  * Create a page
 *   * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 *    * @param {{name: string, description?: string, avatarUrl?: string}} data
 *     * @returns {Promise<{data: any, error: any}>}
 *      */
export async function createPage(supabase, data) {
        try {
                    const { name, description, avatarUrl } = data;

                    if (!name?.trim()) {
                                    return { data: null, error: new Error('Page name is required') };
                                }

                    const slug = generateSlug(name);

                    const { data: page, error } = await supabase
                        .from('pages')
                        .insert({
                                            name: name.trim(),
                                            slug,
                                            description: description?.trim() || '',
                                            avatar_url: avatarUrl || null
                                        })
                        .select()
                        .single();

                    return { data: page, error };
                } catch (err) {
                            return { data: null, error: err };
                        }
}

/**
 *  * Add member to page
 *   * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 *    * @param {string} pageId
 *     * @param {string} profileId
 *      * @param {string} role - 'owner' | 'admin' | 'editor' | 'moderator'
 *       * @returns {Promise<{data: any, error: any}>}
 *        */
export async function addPageMember(supabase, pageId, profileId, role = 'member') {
        try {
                    if (!pageId || !profileId || !role) {
                                    return { data: null, error: new Error('Missing required fields') };
                                }

                    const { data, error } = await supabase
                        .from('page_members')
                        .insert({
                                            page_id: pageId,
                                            profile_id: profileId,
                                            role
                                        })
                        .select()
                        .single();

                    return { data, error };
                } catch (err) {
                            return { data: null, error: err };
                        }
}

/**
 *  * Remove member from page
 *   * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 *    * @param {string} pageId
 *     * @param {string} profileId
 *      * @returns {Promise<{data: any, error: any}>}
 *       */
export async function removePageMember(supabase, pageId, profileId) {
        try {
                    if (!pageId || !profileId) {
                                    return { data: null, error: new Error('Missing required fields') };
                                }

                    const { data, error } = await supabase
                        .from('page_members')
                        .delete()
                        .match({
                                            page_id: pageId,
                                            profile_id: profileId
                                        })
                        .select()
                        .single();

                    return { data, error };
                } catch (err) {
                            return { data: null, error: err };
                        }
}

/**
 *  * Generate slug from text
 *   * @param {string} text
 *    * @returns {string}
 *     */
function generateSlug(text) {
        return text
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-');
}

