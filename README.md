# twitter

Wrapper around the twitter API, exposing endpoints that fit well with my other projects

## Usage

```
const Twitter = require('kchoo-twitter');

const twitter = new Twitter({
	id,
	consumerKey,
	consumerSecret,
	accessToken,
	accessTokenSecret,
	callBackUrl,
});

twitter.addFriend(id);
twitter.getFriendIDs();
twitter.getMostRecentTweetsForFriend(friendID, sinceID);
twitter.getAllAvailableTweetsForFriend(friendID);
```
