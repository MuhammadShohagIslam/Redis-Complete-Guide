import { client } from '$services/redis';

import { pageCacheKey } from '$services/keys';

// list of routes to cache
const cachedRoutes = ['/about', '/privacy', '/auth/signin', '/auth/signup'];

export const getCachedPage = (route: string) => {
	// is the route argument in the list of routes we want to cache
	// if so, get the cached page from Redis,if not, return null
	if (cachedRoutes.includes(route)) {
		return client.get(pageCacheKey(route));
	} else {
		return null;
	}
};

export const setCachedPage = (route: string, page: string) => {
	// if the route argument in the list of routes we want to cache, if so, store the page in Redis
	if (cachedRoutes.includes(route)) {
		return client.set(pageCacheKey(route), page, {
			EX: 4
		});
	}
};
