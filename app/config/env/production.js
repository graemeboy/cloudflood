module.exports = {
    db: 'mongodb://clflood:clflood@kahana.mongohq.com:10009/app26183816',
    app: {
        name: 'Cloudflood'
    },
    facebook: {
        clientID: '1467550870154832',
        clientSecret: '6c113e76b3280cdceef9d0388615675f',
        callbackURL: 'http://cloudflood.herokuapp.com/campaign/twitter/callback/'
    },
    twitter: {
        clientID: 'EP7H8Xrla9WBYTIgIQqMnSWUk',
        clientSecret: 'vpDDALxnqpitcu8pgXlRG6FzhUVRTsacKrjyr2ixLvvD1fKZQU',
        callbackURL: 'http://cloudflood.herokuapp.com/campaign/twitter/callback'
    },
    google: {
        clientID: 'APP_ID',
        clientSecret: 'APP_SECRET',
        callbackURL: 'http://cloudflood.herokuapp.com/auth/google/callback'
    }
};