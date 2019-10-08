
  var express = require('express')
  var path = require('path')
  var app = express()
  var ejs = require('ejs')
  var session = require('express-session')

  app.set('views',path.join(__dirname,'views'))
  app.set('view engine', 'ejs');

  app.use(express.static(path.join(__dirname,'public')))
  app.use(express.static(path.join(__dirname,'public/sounds')))

  app.use(express.urlencoded({extended: true}));
  app.use(express.json());

  app.use(session({
    secret: "2356hdjf6589gkjf",
    resave: false,
     saveUnintialized: true,
  }))

  var mongoose = require('mongoose');
  var schema = mongoose.Schema;
  var admindb = 'mongodb://localhost/mediaplayer';

  mongoose.connect(admindb);

  mongoose.connection.on('error',(err) => {
    console.log('DB connection Error');
  })

  mongoose.connection.on('connected',(err) => {
     useNewUrlParser: true;
    console.log('DB connected');
  })

  var songsSchema = new mongoose.Schema({
    songname : String,
    category : String,
    singer : String,
    image : String,
    })
  
  var playlistSchema = new mongoose.Schema({
    name : String,
    songs : [{ type: schema.Types.ObjectId, ref: 'songs' }]
  })
  

  var userSchema = new mongoose.Schema({
    username : String,
    password : String,
    email : String,
    profilepic : String,
    playlist : [ { type: schema.Types.ObjectId, ref: 'playlists' } ],
    history : [ { type : schema.Types.ObjectId, ref : 'songs' } ],
  })

  var songs = mongoose.model('songs',songsSchema);
  var playlist = mongoose.model('playlists',playlistSchema);
  var users = mongoose.model('users',userSchema);

  // app.use('/in',require('./In/in.js'));

  // app.use('/category',require('./category.js'));

  app.get('/',checkLogin,function(req,res) {
    res.render('browse');
  })

  app.post('/login',function(req,res)
  {
    console.log(req.body);
      users.findOne({ 
        username : req.body.username,
        password : req.body.password
      })
      .then(data => 
      {
        console.log('post login ' + data);
        if(data)
        {
          req.session.data = data;
          req.session.isLogin = 1;
          let query = [{ path : 'playlist' , select : { 'name' : 1 , 'songs' : 1 } }];
          users.findOne({ "_id" : req.session.data._id }).populate( query ).exec(function(error,result) {
            if(error)
            throw error;
            else {
              console.log('-' + result + '-');
              req.session.data = result;
              req.session.playlist = [];
              for(let i=0 ; i < result.playlist.length ; i++)
              {
                req.session.playlist.push(result.playlist[i]._id);
              }
              res.redirect('/browse');
            }
          })
        }
        else 
        {
          res.send("0");
        }
      })
      .catch(err => {
        res.send(err)
      })
  })

  app.get('/signup',function(req,res) 
  {
    res.render('signup');
  })

  app.get('/login',function(req,res)
  {
    res.render('login');
  })

  app.get('/media',checkLogin,function(req,res)
  {
    res.render('Media');
  })

  app.get('/browse',checkLogin,function(req,res)
  {

      res.render('browse',{ obj : req.session.data });
  })

  app.get('/history',checkLogin,function(req,res)
  {
      res.render('history',{ obj : req.session.data });
  })

  app.get('/playlist',checkLogin,function(req,res)
  {
      res.render('playlist',{ obj : req.session.data });
  })

  app.get('/category/:pro',checkLogin,function(req,res)
  {
    res.render('category',{ obj : req.session.data , category : req.params.pro });
    // console.log(req.params.pro);
    // songs.find( { "category" : req.params.pro },function(error,result)
    // {
    //   if(error)
    //   {
    //     throw error;
    //   }
    //   else {
    //     res.render('category',{ obj : req.session.data });
    //   }
    // })
  })

  app.get('/playlist/:pro',checkLogin,function(req,res) {
    playlist.findOne({ "_id" : req.params.pro },function(error,result)
    {
      if(error)
      throw error;
      else {
        res.render('playlist',{ obj : req.session.data , playlist : result });
      }
    })
  })

  app.post('/adduser',function(req,res)
  {
    console.log('---' + req.body + '----');
    users.create(req.body,function(error,result)
    {
      if(error)
      throw error;
      else {
        res.redirect('/login');
      }
    })
  })

  app.post('/finduser',function(req,res)
  {
    users.findOne({ "username" : req.body.username },function(error,result)
    {
      if(error)
      {
        throw error;
      }
      else if(result)
      {
          res.send('1')
      }
      else 
      {
          res.send('0');
      }
    })
  })

  app.post('/getSongs',function(req,res)          // server side pagination
  {
    console.log(req.body.category);
    songs.find( { "category" : req.body.category },function(error,result)
    {
      if(error)
      {
        throw error;
      }
      else {
        res.send(result);
      }
    })
  })

  app.post('/createplaylist',function(req,res)
  {
    console.log(req.body);
    playlist.create(req.body,function(error,result)
    {
      if(error)
      throw error;
      else {
        // console.log('11111' + result + '1111111');
        users.updateOne( { "_id" : req.session.data._id } , { $push : { playlist : result._id } },function(error,output)
          {
            if(error)
            throw error;
            else {
              req.session.data.playlist.push(result);
              req.session.playlist.push(result._id);
              console.log(result);
              res.end();
            }
          })
      }
    })
  })

  app.post('/addSongtoPlayList',function(req,res)        //  change
  {
    console.log(req.body);
    playlist.updateOne( { "_id" : req.body.playlistid } , { $push : { songs : req.body.songid } },function(error,result)
    {
      if(error)
      throw error;
      else {
        console.log(result);
        res.end();
      }
    })
  })

  app.post('/removeSongfromPlayList',function(req,res)     //  change
  {
    console.log(req.body);
    playlist.updateOne( { "_id" : req.body.playlist_id } , { $pull : { songs : { $in : [req.body.songid ] }} },function(error,result)
    {
      if(error)
      throw error;
      else {
        console.log('removed');
        res.end();
      }
    })
  })

  app.post('/getPlaylistSongs',function(req,res)
  {
    let query = [{ path : 'songs' , select : { 'songname' : 1 , 'singer' : 1  , 'category' : 1 , 'image' : 1 } }];
    playlist.findOne({ "_id" : req.body.playlist_id }).populate( query ).exec(function(error,result) {
      if(error)
      throw error;
      else {
        console.log("----here----");
        console.log(result);
        console.log("----here----");
        // req.session.data = result;
        res.send(result);
      }
    })
  })

  app.post('/getrightPlaylist',function(req,res)
  {
    // let findObj = { songs : { $nin : [ req.body.songid ]  } }
    let findObj = { $and : [ { "_id" : { $in : req.session.playlist }  }, { songs : { $nin : [ req.body.songid ]  } }] };
    playlist.find( findObj , { _id : 1 } )
    .then(data => {
      res.send(data);
    })
    .catch(error => {
      res.send(error);
    })
  })
    // {
    //   if(error)
    //   throw error;
    //   else {
    //     // console.log(result);
    //     res.send(result);
    //   }
    // })

  app.get('/logout',checkLogin,function(req,res)
  {
    req.session.isLogin = 0;
    req.session.playlist = [];
    res.redirect('/login');
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

  function checkSignupLogin(req,res,next)
  {
    if(req.session.isLogin)
    {
      next();
    }
    else {
      res.redirect('signup');
    }
  }

  app.listen(3000,function()
  {
    console.log('Running on port 3000');
  })

  // app.get('/songs',checkLogin,function(req,res)
  // {
  //   songs.findOne({},function(error,result)
  //   {
  //     if(error)
  //     throw error;
  //     else {
  //       console.log(result);
  //       res.send(result);
  //     }
  //   })
  // })

  // app.get('/playlist',checkLogin,function(req,res)
  // {
  //     users.findOne({ "_id" : "5d59ad5fcc34be5465a30a3f" },function(error,result)
  //     {
  //       if(error)
  //       throw error;
  //       else {
  //         res.send(result);
  //       }
  //     })
  // })

  // app.post('/addSong',function(req,res)
  // {
  //     users.updateOne({ "_id" : "5d59ad5fcc34be5465a30a3f" },
  //     {
  //         $push : {
  //             playlist : {
  //             "songname" : req.body.songname,
  //             "photoname" : req.body.photoname,
  //           }
  //         }
  //     },function(error,result)
  //     {
  //       if(error)
  //       throw error;
  //       else {
  //         console.log(result);
  //         res.send("DONE bro")
  //       }
  //     })
  // })