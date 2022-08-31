import 'dotenv/config';
import { client } from '../src/services/redis';

const run = async () => {
    await client.hSet("car", {
        name: "Abc",
        year: 1970
    });
    // HSET car name Abc year 1970

    // await client.hSet("car", {
    //     name: "Abc",
    //     year: 1970,
    //     engine: {cyclinder: "good"},
    //     service: null,
    //     owner: undefined
    // });
    /*
            *** Issue of HSET ***

        => whenever we try to access a property on a value of null or undefined
        in JavaScript and try to read any property, call it any function on it,
        we immediately get on error message.

        => In Redis, we can not store null, undefined value, but if we want to store
            value, we can folloe below step

            service: null || "",
            owner: undefined || ""
    */

    const car = await client.hGetAll("car");
    // HGETALL car

    /*
        *** Issue of HGETALL ***
            => we can get empty of object if is not find match key 
            but we are know that it will be null, common sense
        
        const car = await client.hGetAll("sfgsfgsjh") // which does not existed on the redis
        Solve this problem:
            if(!car){
                // this way is not work
            }

        It should be be:
            if(Object.keys(car).length === 0){
                // this will be this way
            }
    */

    if(Object.keys(car).length === 0){
        console.log("Car not found!. Responsed with 404!")
        return;
    }
    console.log(car)
};
run();
