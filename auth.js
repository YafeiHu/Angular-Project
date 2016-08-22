var LocalStrategy = require('passport-local').Strategy;
var dbConf = require('./db');



var normalStrategy = new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password'
}, function(username, password, done) {
    dbConf.con.then(function(db){
        db.collection('user').find({username: username}).toArray().then(function(findRes){
            if(!findRes) return done(null, false);
            if(findRes.length == 1 && findRes[0].password == password){
                return done(null, findRes[0]);
            }
            return done(null, false);
        }).catch(function(err){
            return done(err);
        });
    });
});


var serializeUser = function(user, done) {
    done(null, user);
};

var deserializeUser = function(user, done){
    done(null, user);
};

module.exports = {
    normalStrategy: normalStrategy,
    serializeUser: serializeUser,
    deserializeUser: deserializeUser
}