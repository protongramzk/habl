/**
 * Score a post based on engagement metrics
 * Factors: recency, reaction count, comment count, author following status
 * @param {{created_at: string, reactions?: any[], comments?: any[]}} post
 * @param {{now: Date, isFollowing: boolean, inGroup: boolean}} context
 * @returns {number}
 */
export function scorePost(post, context) {
	if (!post) return 0;

	const now = context?.now || new Date();
	const postTime = new Date(post.created_at);
	const ageHours = (now - postTime) / (1000 * 60 * 60);

	// Recency score (decays over time)
	const recencyScore = Math.max(0, 100 - ageHours * 2);

	// Engagement score
	const reactionCount = (post.reactions || []).length;
	const commentCount = (post.comments || []).length;
	const engagementScore = reactionCount * 5 + commentCount * 10;

	// Following boost
	const followingBoost = context?.isFollowing ? 20 : 0;

	// Group membership boost
	const groupBoost = context?.inGroup ? 15 : 0;

	// Random factor for diversity
	const randomFactor = Math.random() * 10;

	return recencyScore + engagementScore + followingBoost + groupBoost + randomFactor;
}

/**
 * Rank posts by score
 * @param {any[]} posts
 * @param {{now?: Date, following?: string[], groups?: string[]}} context
 * @returns {any[]}
 */
export function rankFeed(posts, context = {}) {
	if (!Array.isArray(posts) || posts.length === 0) return [];

	const contextWithDefaults = {
		now: context.now || new Date(),
		following: context.following || [],
		groups: context.groups || []
	};

	const scored = posts.map((post) => ({
		post,
		score: scorePost(post, {
			now: contextWithDefaults.now,
			isFollowing: contextWithDefaults.following.includes(post.author_id),
			inGroup: contextWithDefaults.groups.includes(post.group_id)
		})
	}));

	return scored.sort((a, b) => b.score - a.score).map((item) => item.post);
}

/**
 * Build home feed for profile
 * Fetches posts from followed users + joined groups
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 * @param {string} profileId
 * @param {number} limit
 * @param {number} offset
 * @returns {Promise<{data: any[], error: any}>}
 */
export async function buildHomeFeed(supabase, profileId, limit = 20, offset = 0) {
	try {
		if (!profileId) {
			return { data: null, error: new Error('Invalid profile ID') };
		}

		// Get following list
		const { data: following } = await supabase
			.from('relations')
			.select('target_id')
			.eq('user_id', profileId)
			.eq('status', 'accepted');

		const followingIds = (following || []).map((rel) => rel.target_id);

		// Get group memberships
		const { data: groups } = await supabase
			.from('group_members')
			.select('group_id')
			.eq('member_type', 'profile')
			.eq('member_id', profileId);

		const groupIds = (groups || []).map((gm) => gm.group_id);

		// Fetch posts from followed + groups + public
		let query = supabase
			.from('posts')
			.select(
				'*, reactions(id), comments(id), author:author_id(id, username, display_name, avatar_url)'
			);

		// Posts from followed users
		if (followingIds.length > 0) {
			query = query.or(
				followingIds.map((id) => `and(author_type.eq.profile,author_id.eq.${id})`).join(',')
			);
		}

		// Posts from joined groups
		if (groupIds.length > 0) {
			query = query.or(groupIds.map((id) => `group_id.eq.${id}`).join(','));
		}

		// Public posts
		query = query.or('visibility.eq.public');

		const { data: posts, error } = await query
			.order('created_at', { ascending: false })
			.range(offset, offset + limit - 1);

		if (error) return { data: null, error };

		// Rank feed
		const ranked = rankFeed(posts || [], {
			now: new Date(),
			following: followingIds,
			groups: groupIds
		});

		return { data: ranked, error: null };
	} catch (err) {
		return { data: null, error: err };
	}
}

/**
 * Get trending posts (high engagement in last 24h)
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 * @param {number} limit
 * @returns {Promise<{data: any[], error: any}>}
 */
export async function getTrendingPosts(supabase, limit = 10) {
	try {
		const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

		const { data: posts, error } = await supabase
			.from('posts')
			.select(
				'*, reactions(id), comments(id), author:author_id(id, username, display_name, avatar_url)'
			)
			.eq('visibility', 'public')
			.gt('created_at', oneDayAgo);

		if (error) return { data: null, error };

		// Score and rank
		const ranked = rankFeed(posts || [], { now: new Date() });

		return { data: ranked.slice(0, limit), error: null };
	} catch (err) {
		return { data: null, error: err };
	}
}
