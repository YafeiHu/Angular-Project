var express = require('express');
var router = express.Router();
var ObjectId = require('mongodb').ObjectId
var Q = require('q');
var dbConf = require('../db');


router.get('/:id', function(req, res, next) {
	var qid = req.params.id;
	console.log("qid", qid);
	dbConf.con.then(function(db) {
		console.log('here!');
		db.collection('question').find({"_id": new ObjectId(qid)}).toArray()
			.then(function(data) {
				console.log('data in question.js', data);
				if(data.length == 0) {
					res.json({ok:0});
				} else {
					res.json({ok:1, questionById: data[0]});
				}
				res.end();
			}).catch(function(err) {
				console.log("can't get question with id", qid, " reason:", err);
				res.json({ok: 0});
				res.end();
			})
	})
});

router.put('/:id', function(req, res, next) {
	// console.log('this is the put method in the question.js');
	var qid = req.params.id;
	var description = req.body.description;
	var tags = req.body.tags;
	// console.log("----------------description", req.body.tags);
	dbConf.con.then(function(db) {
		db.collection('question').updateOne({"_id": new ObjectId(qid)}, {$set: {"description": description, "tags": tags}})
			.then(function(data) {
				res.json({success: 200, newTags: tags});
				res.end();
			}).catch(function(err) {
				res.json({fail: 500});
				res.end();
			})
	});
});

router.delete('/:id', function(req, res, next) {
	var qid = req.params.id;
	dbConf.con.then(function(db) {
		db.collection('question').deleteOne({"_id": new ObjectId(qid)})
			.then(function(data) {
				res.json({success: 200, message: 'DELETE SUCCESSFUL'});
				res.end();
			}).catch(function(err) {
				res.json({fail: 500});
				res.end();
			})
	});
});

module.exports = router;
