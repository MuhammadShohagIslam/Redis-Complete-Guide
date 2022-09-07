/*
                    *** Redis With Scripting ***
*/
/*
    *** LUA Script ***
        => In LUA script have access to the full set of commands a Redis,
        so, LUA script can access a simple string, hash, sorted set and so on.

        => A single LUA script run multiple different commands in a row.So
        we can a LUA script that attemps to say access our sorted sets, use
        some filtering logic on it and then returns that we find that match 
        some kind of filtering criteria.
*/

/*
    *** RUN LUA SCRIPT***

    Write the script ----> Load the script -------> Redis stored the script,
                                                    it can be run future,
                                                    the sends back and ID
                                                    for the script
    Hold onto script  <------- Script Load <----------

    SCRIPT LOAD 'return 1 + 1'
    EVALSHA executedId 0

    SCRIPT LOAD 'return 1 + tonumber(ARGV[1])'
    EVALSHA executedId 1 "100"
                
*/
/*
    *** Provides key Lists ***

    SET color red

    SCRIPT LOAD 'return redis.call('GET', KEYS[1])

    EVALSHA executedId 1 color
*/
/*
    *** When To Use Script ***
        => Limiting the amount of data exechanged between server + redis
        => Solving some concurrency issues
        => Minizing the number of round trips between server + redis
*/

/*
    *** Script Down Side ***
        => Keys must be known ahead of time beacuse we can not do work dynamic keys
        => Tough to test scripts.
        => Loss of language features
        => Another language to deal with (LUA)
*/
