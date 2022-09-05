/*
    *** HyperLogLog ***
        => Algorithm for approximately counting the number of unique elements.
        => Similar to SET, but does not store the elements.
        => When we add string or number, it does not truly stored inside
            the hyperLogLog, just remember value with complex algorithm

*/

/*
    *** Calculation Bytes To MB ***
        if each additional string in set = 40 bytes

        item with a million views = 40 byt * 1000000(views) * 1024(killo byt) / 1024 (mega byt)
                                    = 38 MB

    
        Note: if we store views SET, per items views size is 38, so imagine, we have million
        items, in that time it is the bad, for this reason, we use hyperLogLog
*/

/*
    *** HyperLogLog Downside ***
        => if we 1000 add's value with unique value, may be .81% error, so
        991 to 1000 get response.(beacuse it is not store data)
        => but it is not good signup, signin senarior. beacuse in this case
        we need 100% stored data, not error.

*/
