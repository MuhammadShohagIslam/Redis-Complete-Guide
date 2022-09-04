import type { CreateUserAttrs } from '$services/types';
import { client } from '$services/redis';
import { usersKey, usernamesUniqueKey, usernamesKey } from '$services/keys';
import { genId } from '$services/utils';

export const getUserByUsername = async (username: string) => {
	// Use the username argument to lookup the persons User ID with the username sorted set
	const decimalId = await client.zScore(usernamesKey(), username);

	// make sure, we actually got an ID from the lookup
	if (!decimalId) {
		throw new Error('User Does Not Exist!');
	}

	// take it id and convert to decimal to hexa
	const id = decimalId.toString(16);

	// use id for look up the user's hash
	const user = await client.hGetAll(usersKey(id));

	// deserialize and return the hash
	return deserialize(id, user);
};

export const getUserById = async (id: string) => {
	const user = await client.hGetAll(usersKey(id));

	return deserialize(id, user);
};

export const createUser = async (attrs: CreateUserAttrs) => {
	const id = genId();

	// see if username is already exist in the set of usersname
	const exist = await client.sIsMember(usernamesUniqueKey(), attrs.username);
	// if so throw new error
	if (exist) {
		throw new Error('Username is taken!');
	}
	// otherwise set username in the usernam set
	await client.sAdd(usernamesUniqueKey(), attrs.username);
	await client.hSet(usersKey(id), serialize(attrs));
	await client.zAdd(usernamesKey(), {
		value: attrs.username,
		score: parseInt(id, 10)
	});

	// return id of user that was created
	return id;
};
/*
    *** Convert Hexa Number To Decimal Number ***
        => In JavaScript, use: parseInt(hexaNumber, 10);

    *** Convert Decimal Number To Hexa Number ***
        => In JavaScript, use: decimalNumber.toString(16);
*/

/*
    *** Serialize Helper Function ***
        => means take some information and encoded it to sent off and stored or used 
        by some kind of system.
        
    example: 
                                company
                    id:                     1234
                    name:                   "company"
                    revenue:                89
                    createdAt:              new Date()
    -----------------------------------------------------------------------
        1. Get an object ready to go INTO Redis as a hash
        2. Removes ID
        3. Turns dates into a queryable format.

*/

const serialize = (user: CreateUserAttrs) => {
	return {
		username: user.username,
		password: user.password
	};
};

/*
    *** DeSerialize Helper Function ***
        => means receive some information that might be encoded in a strange way and prepare 
        this information to be used in a format that is readily consumed by our application
    example: 
                                company(Redis)
                    id:                     1234
                    name:                   "company"
                    revenue:                89
                    createdAt:              new Date()


                                company(formated doc)
                    id:                     1234
                    name:                   "company"
                    revenue:                89
                    createdAt:              new Date()
    -----------------------------------------------------------------------
        1. Formats data coming out of Redis
        2. Add in ID
        3. Parse string numbers into plain numbers.
*/

const deserialize = (id: string, user: { [key: string]: string }) => {
	return {
		id,
		username: user.username,
		password: user.password
	};
};
