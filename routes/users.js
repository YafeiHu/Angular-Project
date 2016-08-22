var express = require('express');
var router = express.Router();
var ObjectId = require('mongodb').ObjectId;
var Q = require('q');
var dbConf = require('../db');
var passport = require('passport');

var getUserCollection = function() {
    return dbConf.con.then(function(db) {
        return db.collection('user');
    })
}

router.get('/checkusername', function(req, res, next){
    console.log('in check name', req.query);
    getUserCollection().then(function(userCollection){
        userCollection.find(req.query).toArray().then(function(data){
            console.log('find data', data);
            if(!data || data.length == 0){
                console.log('0');
                res.json({ok: 0});
            }else{
                console.log('1');
                res.json({ok: 1});
            }
            res.end();
        });
    })
})

router.get('/check', function(req, res, next) {
    !!req.user && res.json({
        user: req.user.username
    }) || res.json({});
});

router.post('/edit', function(req, res, next) {
    console.log('in edit user: ', req.user);
    var curUser = req.user;
    var editUser = req.body;

    dbConf.con.then(function(db) {
        db.collection('user').replaceOne({
                '_id': new ObjectId(curUser._id)
            }, editUser)
            .then(function(replaceRes) {
                console.log(replaceRes);
                res.json({
                    'msg': 'replaceOne'
                });
                res.end();
            })
    })
});

router.post('/login', function(req, res, next) {

    //authenticate here
    passport.authenticate('local', function(err, user, info) {
        console.log('in login user:', user);
        console.log('cookies', req.cookies);
        if (err) {
            next(err);
            return;
        }

        if(!user){
            res.json({ok:0, msg:'username or password is invalid'});
            res.end();
            return;
        }

        req.logIn(user, function(err) {
            var _id = req.user._id;
            if (err) {
                return next(err);
            }

            //update atime
            getUserCollection().then(function(userCollection) {
                userCollection.updateOne({
                        '_id': new ObjectId(_id)
                    }, {
                        $set: {
                            'atime': Date.now()
                        }
                    })
                    .then(function(updateRes) {
                        //ignore the update result
                        res.json({
                            ok: 1,
                            user: req.user.username
                        });
                        res.end();
                    });
            });
        });

    })(req, res);
});


router.get('/logout', function(req, res, next){
    if(!req.user){
        //not exist
        res.end();
    }
    
    req.logout();
    
    res.json({
        msg: 'logout successfully'
    });
});

router.post('/sign', function(req, res, next) {
    //check username/password field here

    //get and construct user 
    console.log(req.body);
    var user = req.body;
    console.log('user', user);
    user.active = 1; //change later
    user.level = 1; //change lager
    user.ctime = Date.now() //in ms
    user.mtime = user.ctime;
    user.atime = user.ctime;

    dbConf.con.then(function(db) {
        //check if username exist
        return db.collection('user').find({
                username: user.username
            }).toArray()
            .then(function(findRes) {

                if (!findRes || findRes.length > 0) {
                    return {
                        ok: 0,
                        msg: 'username exist'
                    };
                }

                return db.collection('user').insertOne(user)
                    .then(function(insertRes) {
                        if (insertRes.result.ok) {
                            return {
                                ok: 1
                            };
                        }
                        return {
                            ok: 0,
                            msg: 'insert error'
                        };
                    });
            });

    }).then(function(newRes) {

        if (!newRes.ok) {
            res.json({
                'error msg': newRes.msg
            });
            res.end();
            return;
        }

        //authenticate here
        passport.authenticate('local', function(err, user, info) {
            console.log(req.cookies);
            if (err) {
                next(err);
                return;
            }

            req.logIn(user, function(err) {
                if (err) {
                    return next(err);
                }

                res.json({
                    ok: 1,
                    user: req.user.username
                });
                res.end();
            });

        })(req, res);

    }).catch(function(err) {
        next(err);
        res.end();
    })
});



module.exports = router;
