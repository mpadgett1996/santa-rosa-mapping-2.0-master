const express = require('express');
const router = express.Router();
const Users = require('../UserModel.js');

/* POST login
 {
 username: submitted username
 password: submitted password
 }
*/

router.post('/login', function(req, res, next) {
    alert('post req');
    Users.find({username: req.body.username}, function(err, user) {
        if(err) {
            alert('Unknown error encountered.');
            return res.render('login.ejs');
        }
        if(!user) {
            alert('User not found.');
            return res.render('login.ejs');
        }
        if(user.password != password) {
            alert('Passwords do not match.');
            return res.render('login.ejs');
        }
        alert('Login successful.');
        return res.render('admin.ejs');
    });
});

module.exports = router;