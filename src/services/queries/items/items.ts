import { client } from '$services/redis';
import type { CreateItemAttrs } from '$services/types';
import { genId } from '$services/utils';
import { itemsKey, itemsByViewsKey, itemsByEndingAtKey } from '$services/keys';
import { serialize } from './serialize';
import { deserialize } from './deserialize';

export const getItem = async (id: string) => {
	const item = await client.hGetAll(itemsKey(id));

	if (Object.keys(item).length === 0) {
		return null;
	}

	return deserialize(id, item);
};

/*
	*** Pipeling Command ***
		* If we want to get multiple item at a time ***
			=> Option1: loop over id's, fetch one at a time
				which is not good probably
			=> Option2: Pipeling: take a bunch of different command and lock them
				all into one single command and  throw that one single big giant
				command of to Redis
				through which, we do get, delete, set


		* Pipeling in Node-Redis(the client we are using) *
			const results = await Promise.all([
				client.get('color) // client.hGetAll(id)
				client.get('name) // client.hGetAll(id)
			])

		=> We can mix in and get all in each set and get, delete. 
			As many different commands we want, we can throw them all
			into one single pipeline.
*/
export const getItems = async (ids: string[]) => {
	const commands = ids.map((id) => {
		return client.hGetAll(itemsKey(id));
	});

	const results = await Promise.all(commands);

	if (results.length === 0) {
		return null;
	}

	return results.map((item, index) => {
		if (Object.keys(item).length === 0) {
			return null;
		}

		deserialize(ids[index], item);
	});
};

export const createItem = async (attrs: CreateItemAttrs) => {
	const id = genId();

	await Promise.all([
		client.hSet(itemsKey(id), serialize(attrs)),
		// setup the sorted set for items by Most Views
		client.zAdd(itemsByViewsKey(), {
			value: id,
			score: 0
		}),
		// setup the sorted set for items by Ending Soonest
		client.zAdd(itemsByEndingAtKey(),{
			value: id,
			score: attrs.endingAt.toMillis()
		})
	]);

	return id;
};

/*
    *** One The Item Creation ***
        => Initialize the item's hash "views" property to 0.
        => Add the item's id to the sorted set with an initial score of 0.
*/
/*
    *** One The Item Creation ***
        => Initialize the item's hash "endingAt" property to timestamp.
        => Add the item's id to the sorted set with an initial score of timestamps with
		 miliseconds.
*/
