import { client } from '$services/redis';
import type { Session } from '$services/types';
import { sessionsKey } from '$services/keys';


/*
    *** Purpose of Session ***
        => It allows us to implement our entire authentication system
        and understand who is making request to our application
        over time.
*/
export const getSession = async (id: string) => {
	const session = await client.hGetAll(sessionsKey(id));

	if (Object.keys(session).length === 0) {
		return null;
	}

	return deserialize(id, session);
};

export const saveSession = async (session: Session) => {
    /*
        const id = genId()
            => we do not need randomly generate an Id with getId(), 
            beacuse session object is beign provided, i already 
            generate that unique id somewhere else of our application.
    */
    return await client.hSet(sessionsKey(session.id), serialize(session))
};

const serialize = (session: Session) => {
    return{
        userId: session.userId,
        username: session.username
    }
}

const deserialize = (id: string, session: { [key: string]: string }) => {
	return {
		id,
		userId: session.userId,
		username: session.username
	};
};
