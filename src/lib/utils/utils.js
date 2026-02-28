/**
 * Convert text to URL-safe slug
 * @param {string} text
 * @returns {string}
 */
export function slugify(text) {
	if (!text) return '';
	return text
		.toLowerCase()
		.trim()
		.replace(/[^\w\s-]/g, '')
		.replace(/\s+/g, '-')
		.replace(/-+/g, '-')
		.slice(0, 50);
}

/**
 * Assert condition, throw error if false
 * @param {boolean} condition
 * @param {string} message
 * @throws {Error}
 */
export function assert(condition, message) {
	if (!condition) {
		throw new Error(message || 'Assertion failed');
	}
}

/**
 * Format date for display
 * @param {string|Date} date
 * @returns {string}
 */
export function formatDate(date) {
	if (!date) return '';
	const d = new Date(date);
	if (isNaN(d.getTime())) return '';

	const now = new Date();
	const diffMs = now - d;
	const diffMins = Math.floor(diffMs / (1000 * 60));
	const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
	const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

	if (diffMins < 1) return 'just now';
	if (diffMins < 60) return `${diffMins}m ago`;
	if (diffHours < 24) return `${diffHours}h ago`;
	if (diffDays < 7) return `${diffDays}d ago`;

	return d.toLocaleDateString();
}

/**
 * Paginate array
 * @param {any[]} array
 * @param {number} page - 1-indexed
 * @param {number} limit
 * @returns {{data: any[], page: number, limit: number, total: number}}
 */
export function paginate(array, page = 1, limit = 20) {
	if (!Array.isArray(array)) return { data: [], page, limit, total: 0 };

	const total = array.length;
	const offset = (page - 1) * limit;
	const data = array.slice(offset, offset + limit);

	return { data, page, limit, total };
}

/**
 * Safe JSON parse
 * @param {string} json
 * @param {any} fallback
 * @returns {any}
 */
export function safeJsonParse(json, fallback = {}) {
	try {
		return JSON.parse(json);
	} catch {
		return fallback;
	}
}

/**
 * Check if email is valid
 * @param {string} email
 * @returns {boolean}
 */
export function isValidEmail(email) {
	if (!email) return false;
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
}

/**
 * Check if username is valid (alphanumeric + underscore, 3-20 chars)
 * @param {string} username
 * @returns {boolean}
 */
export function isValidUsername(username) {
	if (!username) return false;
	const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
	return usernameRegex.test(username);
}

/**
 * Sanitize text input (trim, remove excess whitespace)
 * @param {string} text
 * @param {number} maxLength
 * @returns {string}
 */
export function sanitizeInput(text, maxLength = 10000) {
	if (!text) return '';
	return text
		.trim()
		.replace(/\s+/g, ' ')
		.slice(0, maxLength);
}

/**
 * Generate random ID
 * @returns {string}
 */
export function generateId() {
	return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

/**
 * Debounce function
 * @param {Function} fn
 * @param {number} wait
 * @returns {Function}
 */
export function debounce(fn, wait = 300) {
	let timeout;
	return function (...args) {
		clearTimeout(timeout);
		timeout = setTimeout(() => fn(...args), wait);
	};
}
