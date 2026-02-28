reate a post
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 *  * @param {{authorType: string, authorId: string, content: string, visibility: string, groupId?: string, mediaUrls?: string[]}} data
 *   * @returns {Promise<{data: any, error: any}>}
 *    */
    export async function createPost(supabase, data) {
            try {
                        const { authorType, authorId, content, visibility, groupId, mediaUrls } = data;

                        if (!authorType || !authorId || !content?.trim() || !visibility) {
                                        return { data: null, error: new Error('Missing required fields') };
                                    }

                        const { data: post, error } = await supabase
                            .from('posts')
                            .insert({
                                                author_type: authorType,
                                                author_id: authorId,
                                                content: content.trim(),
                                                visibility,
                                                group_id: groupId || null,
                                                media_urls: mediaUrls || []
                                            })
                            .select()
                            .single();

                        return { data: post, error };
                    } catch (err) {
                                return { data: null, error: err };
                            }
    }

/**
 *  * Get single post with comments and reactions
 *   * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 *    * @param {string} postId
 *     * @returns {Promise<{data: any, error: any}>}
 *      */
export async function getPost(supabase, postId) {
        try {
                    if (!postId) {
                                    return { data: null, error: new Error('Invalid post ID') };
                                }

                    const { data: post, error: postError } = await supabase
                        .from('posts')
                        .select('*')
                        .eq('id', postId)
                        .single();

                    if (postError) return { data: null, error: postError };

                    const { data: comments } = await supabase
                        .from('comments')
                        .select('*')
                        .eq('post_id', postId)
                        .order('created_at', { ascending: true });

                    const { data: reactions } = await supabase
                        .from('reactions')
                        .select('*')
                        .eq('target_id', postId)
                        .eq('target_type', 'post');

                    return {
                                    data: {
                                                        ...post,
                                                        comments: comments || [],
                                                        reactions: reactions || []
                                                    },
                                    error: null
                                };
                } catch (err) {
                            return { data: null, error: err };
                        }
}

/**
 *  * Get posts in a group
 *   * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 *    * @param {string} groupId
 *     * @param {number} limit
 *      * @param {number} offset
 *       * @returns {Promise<{data: any[], error: any}>}
 *        */
export async function getPostsByGroup(supabase, groupId, limit = 20, offset = 0) {
        try {
                    if (!groupId) {
                                    return { data: null, error: new Error('Invalid group ID') };
                                }

                    const { data, error } = await supabase
                        .from('posts')
                        .select('*')
                        .eq('group_id', groupId)
                        .order('created_at', { ascending: false })
                        .range(offset, offset + limit - 1);

                    return { data: data || [], error };
                } catch (err) {
                            return { data: null, error: err };
                        }
}

/**
 *  * Create a comment
 *   * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 *    * @param {{postId: string, authorType: string, authorId: string, content: string, parentId?: string}} data
 *     * @returns {Promise<{data: any, error: any}>}
 *      */
export async function createComment(supabase, data) {
        try {
                    const { postId, authorType, authorId, content, parentId } = data;

                    if (!postId || !authorType || !authorId || !content?.trim()) {
                                    return { data: null, error: new Error('Missing required fields') };
                                }

                    const { data: comment, error } = await supabase
                        .from('comments')
                        .insert({
                                            post_id: postId,
                                            author_type: authorType,
                                            author_id: authorId,
                                            content: content.trim(),
                                            parent_id: parentId || null
                                        })
                        .select()
                        .single();

                    return { data: comment, error };
                } catch (err) {
                            return { data: null, error: err };
                        }
}

/**
 *  * Add reaction to post or comment
 *   * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 *    * @param {string} userId - profile id only
 *     * @param {string} targetType - 'post' or 'comment'
 *      * @param {string} targetId
 *       * @param {string} reactionType - 'like' | 'love' | 'laugh' | 'angry'
 *        * @returns {Promise<{data: any, error: any}>}
 *         */
export async function addReaction(supabase, userId, targetType, targetId, reactionType) {
        try {
                    if (!userId || !targetType || !targetId || !reactionType) {
                                    return { data: null, error: new Error('Missing required fields') };
                                }

                    const { data, error } = await supabase
                        .from('reactions')
                        .upsert({
                                            user_id: userId,
                                            target_type: targetType,
                                            target_id: targetId,
                                            type: reactionType
                                        })
                        .select()
                        .single();

                    return { data, error };
                } catch (err) {
                            return { data: null, error: err };
                        }
}

/**
 *  * Remove reaction
 *   * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 *    * @param {string} userId
 *     * @param {string} targetType
 *      * @param {string} targetId
 *       * @returns {Promise<{data: any, error: any}>}
 *        */
export async function removeReaction(supabase, userId, targetType, targetId) {
        try {
                    if (!userId || !targetType || !targetId) {
                                    return { data: null, error: new Error('Missing required fields') };
                                }

                    const { data, error } = await supabase
                        .from('reactions')
                        .delete()
                        .match({
                                            user_id: userId,
                                            target_type: targetType,
                                            target_id: targetId
                                        })
                        .select()
                        .single();

                    return { data, error };
                } catch (err) {
                            return { data: null, error: err };
                        }
}

