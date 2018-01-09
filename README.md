# twitter

Wrapper around https://github.com/BoyCook/TwitterJSClient

(hoping to get all that stuff extracted out because this isn't the most reliable project out there)

I just want to pass it some config and expose an API that's more suited to being used by my other projects

## Usage

```
const CONFIG = require('./config.json');

const Twitter = require('kchoo-twitter');

const twitter = new Twitter(CONFIG.twitterAuth);

twitter.getFriendIDs();
twitter.getMostRecentTweetsForFriend(friendID, sinceID);
twitter.getAllAvailableTweetsForFriend(friendID);
```
