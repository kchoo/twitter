// external dependencies
const {OAuth} = require('oauth');
const $q = require('kchoo-q');

function KchooTwitter({
	id,
	consumerKey,
	consumerSecret,
	accessToken,
	accessTokenSecret,
	callBackUrl = null
}) {
	this.id = id;

	this.accessToken = accessToken;
	this.accessTokenSecret = accessTokenSecret;

	try {
		this.oauth = new OAuth(
				'https://api.twitter.com/oauth/request_token',
				'https://api.twitter.com/oauth/access_token',
				consumerKey,
				consumerSecret,
				'1.0',
				callBackUrl,
				'HMAC-SHA1'
			);
	} catch (e) {
		console.log('Invalid oauth credentials: ', JSON.stringify(e));
		return null;
	}
}

KchooTwitter.prototype.baseRequestUrl = 'https://api.twitter.com/1.1';
KchooTwitter.prototype.baseMediaUrl = 'http://pbs.twimg.com/';

// user_id is the id of the twitter user we want to befriend
// must be a string because JS doesn't have 64-bit ints
KchooTwitter.prototype.addFriend = function (user_id) {
	return performPOST.
		call(
			this,
			'/friendships/create.json',
			{
				user_id,
				follow: true
			}
		).
		then(function ({id_str}) {
			return id_str;
		});
};

KchooTwitter.prototype.getMedia = function ({
	twitterID,
	from = null,
	to = null
}) {
	const deferred = $q.defer();

	performGET.
		call(
			this,
			'/statuses/user_timeline.json',
			{
				user_id: twitterID,
				count: 200,
				since_id: from,
				max_id: to
			}
		).
		then(getImagesFromTweets).
		then(deferred.resolve.bind(deferred));

	return deferred.promise;
};

module.exports = KchooTwitter;

function handleOAuthCallback(deferred) {
	return function (err, body = '{}', response) {
		if (err || response.statusCode !== 200) {
			deferred.reject([err, JSON.parse(body)]);
		} else {
			deferred.resolve(JSON.parse(body));
		}
	};
}

function performGET(url, body) {
	const deferred = $q.defer();

	this.oauth.
		get(
			this.baseRequestUrl + url + buildQueryString(body),
			this.accessToken,
			this.accessTokenSecret,
			handleOAuthCallback(deferred)
		);

	return deferred.promise;
}

function performPOST(url, body) {
	const deferred = $q.defer();

	this.oauth.
		post(
			this.baseRequestUrl + url,
			this.accessToken,
			this.accessTokenSecret,
			body,
			'application/x-www-form-urlencoded',
			handleOAuthCallback(deferred)
		);

	return deferred.promise;
}

function buildQueryString(obj) {
	const arr = [];

	for(const prop in obj) {
		if(obj[prop] === null) {
			continue;
		}

		arr.push(
			encodeURIComponent(prop) +
			'=' +
			encodeURIComponent(obj[prop])
		);
	}

	return '?' + arr.join('&');
}

function getImagesFromTweets(tweets) {
	const urls = [];

	if(tweets.length === 0) {
		return {};
	}

	for (const tweet of tweets) {
		if (
			tweet.extended_entities &&
			tweet.extended_entities.media
		) {
			for(const {media_url} of tweet.extended_entities.media) {
				urls.push(media_url);
			}
		}
	}

	return {
		first: tweets[0].id_str,
		urls,
		last: tweets[tweets.length - 1].id_str
	};
}
