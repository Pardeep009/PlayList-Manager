let express = require('express');
let router = express.Router();
let path = require('path');

router.use(express.static(path.join(__dirname,'../public')));

let mongoose = require('mongoose');

let songs = mongoose.model('songs');
let users = mongoose.model('users');

router.get('/pop',checkLogin,function(req,res)
{
    res.render('history',{obj : req.session.data});
})

router.get('/romantic',checkLogin,function(req,res)
{
    res.render('history',{obj : req.session.data});
})

router.get('/relaxing',checkLogin,function(req,res)
{
    res.render('history',{obj : req.session.data});
})

router.get('/workout',checkLogin,function(req,res)
{
    res.render('history',{obj : req.session.data});
})

function checkLogin(req,res,next)
{
    if(req.session.isLogin)
    {
        next();
    }
    else {
        res.redirect('/login');
    }
}