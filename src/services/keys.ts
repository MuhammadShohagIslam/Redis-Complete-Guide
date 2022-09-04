export const pageCacheKey = (id: string) => `pagecache#${id}`;
export const usersKey = (id: string) => `users#${id}`;
export const sessionsKey = (sessionId: string) => `sessions#${sessionId}`;
export const usernamesUniqueKey = () => `usernames:unique`;
export const userLikesItemKey = (userId: string) => `users:likes#${userId}`;
export const usernamesKey = () => "usernames";

// Items
export const itemsKey = (itemId: string) => `items#${itemId}`;
export const itemsByViewsKey = () => "items:views";
export const itemsByEndingAtKey = () => "items:endingAt";