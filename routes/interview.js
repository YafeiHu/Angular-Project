var express = require('express');
var router = express.Router();
var ObjectId = require('mongodb').ObjectId
var Q = require('q');
var dbConf = require('../db');

router.get('/', function(req, res, next){
    console.log('req in interview', req.query);
    var filter = {};
    if(!!req.query.query) filter.Client = new RegExp(req.query.query, 'i');
    dbConf.con.then(function(db){
        return db.collection('interview').distinct('Client',filter);
    }).then(function(data){
        console.log(data);
        res.json(data);
        res.end();
    });
});

var saveToQuestion = function(db, question, it){
    question.interview = it;
    console.log('question incoming', question);
    return db.collection('question').insertOne(question)
        .then(function(insertQsRes){
            var arr = question.tags.map(function(tag){
                return db.collection('tag').insertOne({"tag": tag});
            })

            return Q.allSettled(arr).then(function(insertTagRes){
                insertTagRes.forEach(function (result) {
                    if (result.state !== "fulfilled") {
                        var reason = result.reason;
                        console.log('insert tag failed, reason:', reason);
                    }
                });
            });
        });
}

router.post('/', function(req, res, next){
    dbConf.con.then(function(db){
            
            req.body.it.Date = new Date(req.body.it.Date);

            db.collection('interview').insertOne(req.body.it)
                .then(function(insertItRes){
                    return Q.all(req.body.qs.map(function(question){
                        return saveToQuestion(db, question, insertItRes.ops[0]);
                    }));
                }).then(function(){
                    res.json({ok: 1});
                    res.end();
                }).catch(function(err){
                    console.log('insert interview error, reason', err);
                    res.json({ok: 0});
                    res.end();
                })
    });
})


module.exports = router;
