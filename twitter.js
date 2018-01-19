// external dependencies
const OAuth = require('oauth').OAuth;
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

KchooTwitter.prototype.addFriend = function (user_id) {
	return performPOST.
		call(
			this,
			`${this.baseRequestUrl}/friendships/create.json`,
			{
				user_id,
				follow: true
			}
		).
		then(function ({id_str}) {
			return id_str;
		});
};

module.exports = KchooTwitter;

function handleOAuthCallback(deferred) {
	return function (err, body, response) {
		if (err || response.statusCode !== 200) {
			deferred.reject([err, JSON.parse(body)]);
		} else {
			deferred.resolve(JSON.parse(body));
		}
	};
}

function performGET(url) {
	const deferred = $q.defer();

	this.oauth.
		get(
			url,
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
			url,
			this.accessToken,
			this.accessTokenSecret,
			body,
			'application/x-www-form-urlencoded',
			handleOAuthCallback(deferred)
		);

	return deferred.promise;
}
