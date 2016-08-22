// var express = require('express');
// var passport = require('passport');
// var Account = require('../models/account');
// var router = express.Router();

// router.post('/sign', function(req, res) {
//     Account.register(new Account({
//         username: req.body.username
//     }), req.body.password, function(err, account) {
//         if (err) {
//             return res.json({
//                 info: "Sorry. That username already exists. Try again."
//             });
//         }

//         passport.authenticate('local')(req, res, function() {
//             res.json({
//                 usr: req.body.username
//             })
//         });
//     });
// });

// router.get('/check', function(req, res) {
//     !!req.user &&
//     res.json({
//         usr: req.user.username
//     }) || res.json({})
// });

// router.post('/login', passport.authenticate('local'), function(req, res) {
//     res.json({
//         usr: req.user.username
//     })
// });

// router.get('/logout', function(req, res) {
//     req.logout();
//     res.json({
//         msg: 'logout successfully'
//     })
// });

// module.exports = router;
