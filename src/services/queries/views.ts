import { client } from '$services/redis';
import { itemsByViewsKey, itemsKey } from '$services/keys';

export const incrementView = async (itemId: string, userId: string) => {
	// through with promise all, we can send request multiple command
	await Promise.all([
		client.hIncrBy(itemsKey(itemId), 'views', 1),
		client.zIncrBy(itemsByViewsKey(), 1, itemId)
	]);
};

/*
    *** One The Item Creation ***
        => Initialize the item's hash "views" property to 0.
        => Add the item's id to the sorted set with an initial score of 0.

    *** On item View(Only if this user is viewing the item for the first time) ***
        => Increment the item hash 'views' by property by 1
        => Increment the sorted set's score for this item by 1
*/
