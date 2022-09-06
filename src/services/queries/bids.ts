import type { CreateBidAttrs, Bid } from '$services/types';
import { client } from '$services/redis';
import { bidHistoryKey,itemsKey} from '$services/keys';
import { DateTime } from 'luxon';
import { getItem } from './items';

export const createBid = async (attrs: CreateBidAttrs) => {
	const item = await getItem(attrs.itemId);

	if(!item){
		throw new Error("Item Does Not Exit!")
	}

	if(item.price >= attrs.amount){
		throw new Error("Bid too low!")
	}

	if(item.createdAt.diff(DateTime.now()).toMillis() < 0){
		throw new Error("Item closed to bid")
	}
	
	const serialized = serializeHistory(attrs.amount, attrs.createdAt.toMillis());

	await Promise.all([
		client.rPush(bidHistoryKey(attrs.itemId), serialized),
		client.hSet(itemsKey(item.id), {
			bids: item.bids + 1,
			price: attrs.amount,
			highestBidUserId: attrs.userId
			
		})
	])
};

export const getBidHistory = async (itemId: string, offset = 0, count = 10): Promise<Bid[]> => {
	const endIndex = -1 - offset;
	const startIndex = -1 * offset - count;

	const range = await client.lRange(bidHistoryKey(itemId), startIndex, endIndex);

	return range.map((bid) => deserializeHistory(bid));
};

const serializeHistory = (amount: number, createdAt: number) => {
	return `${amount}:${createdAt}`;
};

const deserializeHistory = (stored: string) => {
	const [amount, createdAt] = stored.split(':');
	return {
		amount: parseFloat(amount),
		createdAt: DateTime.fromMillis(parseInt(createdAt))
	};
};
