var mc = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
var dbLink = "mongodb://localhost/qs";
var dbCon = mc.connect(dbLink);


//for all db collection

var saveToInterview = function(db, interview){
    return db.collection('interview').insertOne(interview);
}   

var saveToQuestion = function(db, question){
    return db.collection('question').insertOne(question);
}

var saveToTag = function(db, tag){
    return db.collection('tag').insertOne(tag);
}

var dbCol = function(col){
    return dbCon.then(function(db){
        return db.collection(col)
    })
}

module.exports = {
    saveToTag: saveToTag,
    saveToQuestion: saveToQuestion,
    saveToInterview: saveToInterview,
	link: dbLink,
	con: dbCon,
	collection: dbCol
}