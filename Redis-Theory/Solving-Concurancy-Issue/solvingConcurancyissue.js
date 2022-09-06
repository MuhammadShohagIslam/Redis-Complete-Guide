/*
    *** Concurrency Issue ***
        => If your website users make a lot of request at a same time,
        it make it a concurrency issue.
        => Anytime we need data and then sit around for a little bit 
        and then save and update back.We are possibly going to run
        into a concurrency issue.
        => This is issue anytime we fetch data then use it to make an update.

        Note that: in many cases, cocurrency issue can be ignoring like Todo List.

*/

/*
    *** How to Solve Concurrency Issue ***
        => Use an atomic command like HINCRBY Or HSETNEX.
        => Use a transaction with the 'WATCH' command.
        => Use a lock
        => Use a custome LUA update script.
*/
/*
    *** Transaction ***
        => Group together one or more commands to run sequentially or one after another.
        => Similar to pipelining, but some big difference beacuse pipeling is not
        guranted all the these grouped up commands get executed one after another.
        => In Radis, tranction can not be undone/rollback/reversed! unlike other
        Database.
*/
/*
    *** In Redis, Tranction use a couple of different commands to manage ***

        Multi ---> start a new tranction

        SET color red
                        ---> Queue up this command to run
        SET color 5  

        EXEC ---> Run all queued commands.
*/
/*
    *** Isolated Connection of Tranction ***

        WATCH   ---> Set up watch

        GET color 
                ---> Get some data that our update depend on.
        GET count 

        Multi           ===

        SET color red   ===>  Set up and run the tranction.    
        SET color 5  

        EXEC            ===

    Note That: anything accoured to either the value of color or count in between us 
    executing WATCH and EXEC then the tranction will automatically be canceled.
*/
/*
    *** In Redis, Tranction use a couple of different commands to manage ***
        WATCH item:a1

        HGETALL item:a1
        
        MULTI

        HSET item:a1 amount 10 bids 1                           
        RPUSH items   

        EXEC 

    Note That: if any other request comes in, in between us executing WATCH and EXEC.
    So maybe another request comes in to modify the item and successfully does so.
    And our execution right here, the entire tranction will be canceled 
    and so we will no longer suffer any concurrency issues that we currently have, 
    where many different request at the same time.An update or create bids for a single item.
*/
