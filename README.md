# Redis-node-tutorial

How data is being saved in Redis

#Users

For saving users we are using hashes, having prefix 'Users'.
For example a user with email email@test.com will have the main hash key Users:email@test.com
The last registered users are kept in a list, in Redis case a double linked list.
So in this case adding to the list is really fast O(1), while loading is O(n), but is ok because this should be a capped list.


#Posts

For posts we are using hashes with the prefix 'Posts', a full key for the post with the title 'This is a test' by the user 'email@test.com' will be:
'Posts:email@test.com:This is a test'
Then we have a list for the last created posts and then one list per user for each user's posts.
For top voted posts we keep all posts in a sorted set ordered by the number of votes, the posts with less votes are first, so when we want to get the top voted posts we have to reverse the list. Also we are using another sorted set with all the posts, in this case sorted by the creation date. In case we would like to browse through all posts we could use this structure, which is much better in access terms than a list.
