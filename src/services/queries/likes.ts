import { client } from '$services/redis';
import { userLikesItemKey, itemsKey } from '$services/keys';
import { getItems } from './items';

export const userLikesItem = async (itemId: string, userId: string) => {
	return client.sIsMember(userLikesItemKey(userId), itemId);
};

export const likedItems = async (userId: string) => {
	// fetch all the item Id's from this user liked set
	const ids = await client.sMembers(userLikesItemKey(userId));

	// fetch all the item hash with those id and return as a array
	return getItems(ids);
};

export const likeItem = async (itemId: string, userId: string) => {
	const isLiked = await client.sAdd(userLikesItemKey(userId), itemId);

	if (isLiked) {
		return await client.hIncrBy(itemsKey(itemId), 'likes', 1);
	}
};

export const unlikeItem = async (itemId: string, userId: string) => {
	const remove = await client.sRem(userLikesItemKey(userId), itemId);

	if (remove) {
		return await client.hIncrBy(itemsKey(itemId), 'likes', -1);
	}
};

export const commonLikedItems = async (userOneId: string, userTwoId: string) => {
	// fetch the all commong item id's from the like set
	const ids = await client.sInter([userLikesItemKey(userOneId), userLikesItemKey(userTwoId)]);

	// fetch all the items hash with those id and return array
	return getItems(ids);
};
