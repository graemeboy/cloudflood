module.exports = {
    db: 'mongodb://localhost/cloudflood-dev',
    //db: 'mongodb://clflood:clflood@kahana.mongohq.com:10009/app26183816',
    app: {
        name: 'Cloudflood'
    },
    facebook: {
        clientID: '520330778071280',
        clientSecret: 'e682110f33483dc77e6e1eeb0a1a62f2',
        callbackURL: 'http://localhost:3000/campaign/twitter/callback/'
    },
    twitter: {
        clientID: 'dN4Rw8oF8XS7IPAQVq4XDMnzz',
        clientSecret: 'YOFFp1y42fe2Txlzeq3VYGQlU7pMxFxzxlfhZi4KUhxWpAGlAS',
        callbackURL: 'http://localhost:3000/campaign/twitter/callback'
    },
    google: {
        clientID: 'APP_ID',
        clientSecret: 'APP_SECRET',
        callbackURL: 'http://localhost:3000/auth/google/callback'
    }
};
