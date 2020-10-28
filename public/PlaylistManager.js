
var songs;
var userdata;
var play = document.getElementById('play');
var next = document.getElementById('next');
var prev = document.getElementById('prev');
var audio = document.createElement("AUDIO");
var current_song=0;
var songname = $('#songname');

  window.onload = function()
  {
    let req1 = new XMLHttpRequest();
    req1.open('GET','/songs');
    req1.send();
    req1.onload = function()
    {
      songs = JSON.parse(req1.responseText);
      console.log(songs);
      songs = songs.songs;
      // console.log(songs);
      addtoDOM1(songs)
      audio.setAttribute("src",songs[current_song].songname);
      songname.html(songs[current_song].songname);
    }
    let req2 = new XMLHttpRequest();
    req2.open('GET','/playlist');
    req2.send();
    req2.onload = function()
    {
      userdata = JSON.parse(req2.responseText);
      console.log(userdata);
      // userdata = songs.songs;
      // console.log(songs);
      addtoDOM2(userdata.playlist)
      // audio.setAttribute("src",songs[current_song]);
      // songname.html(songs[current_song]);
    }
    // console.log(songs);
  }

  $('#play').click(function()
  {
    playsong();
  })

  function playsong()
  {
    console.log(audio.paused);
    if(audio.paused)
    {
      audio.play();
      $('#play').html("Pause");
    }
    else
    {
      audio.pause();
      $('#play').html("Play");
    }
  }

  $('#prev').click(function()
  {
    current_song = (current_song+songs.length-1)%songs.length;
    setSong(encodeURIComponent(songs[current_song].songname))
    // audio.paused = true;
    // playsong();
  })

  $('#next').click(function()
  {
    current_song = (current_song+1)%songs.length;
    setSong(encodeURIComponent(songs[current_song].songname))
    // audio.paused = true;
    // playsong();
  })

  function setSong(name)
  {
    name = decodeURIComponent(name);
    audio.setAttribute("src",name);
    songname.html(name);
    audio.paused = true;
    playsong();
  }

  function addtoDOM1(songs)
  {
    for(i=0;i<songs.length;i++)
    {
      var div = '<div class="row">'
                  +'<div class="col-sm-9" style="cursor:pointer;" onclick=setSong("'+encodeURIComponent(songs[i].songname)+'")>'
                    +'<p>'+songs[i].songname+'</p>'
                  +'</div>'
                  +'<div class="col-sm-3">'
                    +'<button class="btn btn-default" onclick=addToPlaylist("'+encodeURIComponent(songs[i])+'") >Add To Playlist</button>'
                  +'</div>'
                +'</div>'

      $('#viewallSongs').append(div);
    }
  }

  function addtoDOM2(playlist)
  {
    for(i=0;i<playlist.length;i++)
    {
      var div = '<div class="row">'
                  +'<div class="col-sm-9" style="cursor:pointer;" onclick=setSong("'+encodeURIComponent(playlist[i].songname)+'")>'
                    +'<p>'+playlist[i].songname+'</p>'
                  +'</div>'
                  +'<div class="col-sm-3">'
                    +'sone fuctionalities provided'
                  +'</div>'
                +'</div>'

      $('#viewmySongs').append(div);
    }
  }

  function addToPlaylist(songs)
  {
    songs = decodeURIComponent(songs)
    let obj = {
      songname : songs.songname,
      photoname : songs.photoname
    }
    let request = new XMLHttpRequest();
    request.open('POST','/addSong')
    request.setRequestHeader('Content-type',"application/json")
    request.send(JSON.stringify(obj))
    request.onload = function()
    {
      // $('#' + userid).remove();
      alert("done")
    }
  }
