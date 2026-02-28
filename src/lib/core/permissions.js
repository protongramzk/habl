/**
 * Check if actor can edit post
 * @param {{type: string, id: string}} actor - {type: 'profile'|'page', id: string}
 * @param {{authorType: string, authorId: string}} post
 * @returns {boolean}
 */
export function canEditPost(actor, post) {
	if (!actor || !post) return false;
	return actor.type === post.authorType && actor.id === post.authorId;
}

/**
 * Check if actor can delete post
 * @param {{type: string, id: string}} actor
 * @param {{authorType: string, authorId: string}} post
 * @returns {boolean}
 */
export function canDeletePost(actor, post) {
	if (!actor || !post) return false;
	return actor.type === post.authorType && actor.id === post.authorId;
}

/**
 * Check if actor can manage group (admin/moderator only)
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 * @param {{type: string, id: string}} actor
 * @param {string} groupId
 * @returns {Promise<{data: boolean, error: any}>}
 */
export async function canManageGroup(supabase, actor, groupId) {
	try {
		if (!actor || !groupId) {
			return { data: false, error: new Error('Invalid actor or group') };
		}

		const { data: membership, error } = await supabase
			.from('group_members')
			.select('role')
			.match({
				group_id: groupId,
				member_type: actor.type,
				member_id: actor.id
			})
			.single();

		if (error || !membership) {
			return { data: false, error: null };
		}

		const canManage = ['admin', 'moderator'].includes(membership.role);
		return { data: canManage, error: null };
	} catch (err) {
		return { data: false, error: err };
	}
}

/**
 * Check if profile can manage page
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 * @param {string} profileId
 * @param {string} pageId
 * @returns {Promise<{data: boolean, error: any}>}
 */
export async function canManagePage(supabase, profileId, pageId) {
	try {
		if (!profileId || !pageId) {
			return { data: false, error: new Error('Invalid profile or page') };
		}

		const { data: membership, error } = await supabase
			.from('page_members')
			.select('role')
			.match({
				page_id: pageId,
				profile_id: profileId
			})
			.single();

		if (error || !membership) {
			return { data: false, error: null };
		}

		const canManage = ['owner', 'admin'].includes(membership.role);
		return { data: canManage, error: null };
	} catch (err) {
		return { data: false, error: err };
	}
}

/**
 * Check if actor can view post based on visibility
 * @param {{type: string, id: string}} actor - current actor
 * @param {{authorType: string, authorId: string, visibility: string, groupId?: string}} post
 * @param {{following: string[], groups: string[]}} context - context of actor
 * @returns {boolean}
 */
export function canViewPost(actor, post, context) {
	if (!post) return false;

	if (post.visibility === 'public') return true;

	if (!actor) return false;

	// followers-only: check if actor follows author
	if (post.visibility === 'followers' && post.authorType === 'profile') {
		return context?.following?.includes(post.authorId) || false;
	}

	// group: check if actor is in group
	if (post.visibility === 'group' && post.groupId) {
		return context?.groups?.includes(post.groupId) || false;
	}

	return false;
}

/**
 * Check if actor can edit/delete comment
 * @param {{type: string, id: string}} actor
 * @param {{authorType: string, authorId: string}} comment
 * @returns {boolean}
 */
export function canEditComment(actor, comment) {
	if (!actor || !comment) return false;
	return actor.type === comment.authorType && actor.id === comment.authorId;
}

