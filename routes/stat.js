var express = require('express');
var router = express.Router();
var dbConf = require('../db');
var Q = require('q');
var moment = require('moment');

// interview by year
router.get('/iy', function(req, res, next) {
    var group = {
        $group: {
            _id: {
                year: {
                    $year: "$Date"
                }
            },
            count: {
                $sum: 1
            }
        }
    };
    // aggregate the count per month
    dbConf.collection('interview')
        .then(function(col) {
            return col.aggregate([group]).toArray()
        })
        .then(function(data) {
            console.log(data)
            var result = {};
            data.forEach(function(v) {
                result[v._id.year] = v.count
            })
            return result;
        })
        .then(res.json.bind(res))
        .catch(function(err) {
            console.log('im fail', err);
            next(err);
        });
});

// interview by month
router.get('/im', function(req, res, next) {
    var year = req.query.year || 2015;
    var ds = new Date(year, 1, 1);
    var de = new Date(year, 12, 31);
    var match = {
        $match: {
            Date: {
                $gte: ds,
                $lt: de
            }
        }
    };
    var group = {
        $group: {
            _id: {
                month: {
                    $month: "$Date"
                }
            },
            count: {
                $sum: 1
            }
        }
    };
    // aggregate the count per month
    dbConf.collection('interview')
        .then(function(col) {
            return col.aggregate([match, group]).toArray()
        })
        .then(function(data) {
            console.log(data)
            var result = [];
            data.forEach(function(v) {
                result[v._id.month] = {
                    m: moment().set({
                        year: year,
                        month: v._id.month - 1
                    }).format('YYYY-MM'),
                    v: v.count
                }
            })
            return result;
        })
        .then(res.json.bind(res))
        .catch(function(err) {
            console.log('im fail', err);
            next(err);
        });
});

router.get('/iq', function(req,res,next){
    var match = {
        $match: {
            question: new RegExp(req.query.k, 'i')    
        }
    }
    var group = {
        $group: {
            _id: {
                year: {$year: "$interview.Date"}
            },
            count: {
                $sum: 1
            }
        }
    }
    dbConf.collection('question').then(function(col){
        return col.aggregate([match, group]).toArray()
    }).then(res.json.bind(res)).catch(function(err){
        console.log('error in query iqk', err)
        next(err)
    })
})

router.get('/ic', function(){
    dbConf.collection('interview').then(function(col){
        return col.aggregate().toArray()
    }).then(res.json.bind(res)).catch(function(){})
})

module.exports = router;
