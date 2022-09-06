/*
    *** Concurrency Issue ***
        => If we your website make a lot of request at a same time,
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
        => 
*/