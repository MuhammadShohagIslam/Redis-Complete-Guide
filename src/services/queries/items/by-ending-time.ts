import { client } from "$services/redis";
import { itemsByEndingAtKey, itemsKey } from "$services/keys";
import { deserialize } from "./deserialize";

export const itemsByEndingTime = async (
	order: 'DESC' | 'ASC' = 'DESC',
	offset = 0,
	count = 10
) => {
	const ids = await client.zRange(itemsByEndingAtKey(), Date.now(), "+inf", {
		BY:"SCORE",
		LIMIT:{
			offset,
			count
		}
	})

	const command = ids.map(itemId => {
		return client.hGetAll(itemsKey(itemId))
	});

	const users = await Promise.all(command)

	return users.map((user, index) => {
		deserialize(ids[index], user)
	})
};
