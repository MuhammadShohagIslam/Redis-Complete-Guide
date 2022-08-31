import 'dotenv/config';
import { client } from '../src/services/redis';

const run = async () => {
    await client.hSet("car", {
        name: "Abc",
        year: 1970
    });
    // HSET car name Abc year 1970

    const car = await client.hGetAll("car");
    // HGETALL car

    console.log(car)
};
run();
