    
    let songid;
    let audio = document.getElementById("current-song");
    $('#create-playlist-button').click(function()
    {
        let obj = {
            name :  $('#create-playlist-name').val()
        }
        // console.log(obj);
        
        let request = new XMLHttpRequest();
        request.open('POST','/createplaylist');
        request.setRequestHeader("Content-Type","application/json");
        request.send(JSON.stringify(obj));
        request.onload = function()
        {
            // alert('PlayList Created');
            myFunction("PlayList Created");
        }
    })

    function renamePlaylist(id,name)
    {
        // alert(id);
        // alert(name);
        $('#sample-modal-input').val(name);
        $('#sample-modal-button').html("Rename");
        $('#sample-modal-button').click(function()
        {
            let newname = $('#sample-modal-input').val()
            if(newname == name)
            {
                // alert('')
            }
            else 
            {
                let request = new XMLHttpRequest();
                request.open('POST','/renamePlaylist');
                request.setRequestHeader("Content-Type","application/json");
                request.send(JSON.stringify({
                    playlist_id : id,
                    newname : newname
                }));
                request.onload = function()
                {
                    // alert('PlayList Created');
                    myFunction("PlayList Renamed");
                }
            }
        })
    }

    function playSong(songname,image)
    {
            songname = decodeURIComponent(songname);
            image = decodeURIComponent(image);
            audio.setAttribute("src","/" +songname);
            $('#current-song').attr("src","/" +songname);
            audio.setAttribute("src","/" + songname);
            // let request = new XMLHttpRequest();
            // request.open('POST','/getSong');
            // request.setRequestHeader("Content-Type","application/json");
            // request.send(JSON.stringify({
            //     songname : songname,
            // }));
            // request.onload = function()
            // {
            //     let data = JSON.parse(request.responseText);
            //     console.log(data);
                // for(let i in data)
                // {
                //     $('#'+data[i]._id).prop("disabled",false);
                // }
            // }
            setFooter(songname,image);
    }

    function addSong(id)
    {
        // alert(id);
        songid = id;
        let request = new XMLHttpRequest();
        request.open('POST','/getrightPlaylist');
        request.setRequestHeader("Content-Type","application/json");
        request.send(JSON.stringify({
            songid : songid,
        }));
        request.onload = function()
        {
            let data = JSON.parse(request.responseText);
            for(let i in data)
            {
                $('#'+data[i]._id).prop("disabled",false);
            }
        }
    }

    function addToPlayList(playlistid)
    {
        let request = new XMLHttpRequest();
        request.open('POST','/addSongtoPlayList');
        request.setRequestHeader("Content-Type","application/json");
        request.send(JSON.stringify({
            songid : songid,
            playlistid : playlistid
        }));
        request.onload = function()
        {
            // alert('song added');
            myFunction("Song Added");
        }
    }

    function setFooter(songname,image)
    {
        $('#current-song-image').attr("src","/" + image);
        $('#current-song-name').html(songname);
    }

    function addToDom(obj,call)
    {   
        console.log(obj);
        let div = '<div class="col-sm-8 p-2 songdiv">'
                    +'<div style="display : inline;" onclick = playSong("'+encodeURIComponent(obj.songname)+'","'+encodeURIComponent(obj.image)+'")>'
                        +'<img src="/'+obj.image+'" alt="" class="songimage">'
                        +'<p class="songname-tag">'+obj.songname+'</p>'
                    +'</div>'
                    +'<div class="dropdown float-right">'
                        +'<a class="btn " type="" data-toggle="dropdown"><i class="material-icons">more_vert</i></a>'
                        +'<ul class="dropdown-menu">'
                            +'<li onclick = playSong("'+encodeURIComponent(obj.songname)+'","'+encodeURIComponent(obj.image)+'")>&nbsp;Play</a></li>'
                            +'<hr>'
                            +'<li onclick = addSong("'+obj._id+'") data-toggle="modal" data-target="#add-song-playlist-modal" >&nbsp;Add To PlayList</li>'
                            if(call == 'p')
                            {
                                div = div + '<hr>'
                                div = div + '<li onclick = removeSong("'+obj._id+'") >&nbsp;Remove from Playlist</li>'
                            }
                        +'</ul>'
                    +'</div>'
                +'</div>'
        $('#songs').append(div);

    }

    function myFunction(message) {
        // Get the snackbar DIV
        let x = document.getElementById("snackbar");
      
        // Add the "show" class to DIV
        x.className = "show";
        x.innerHTML = message;
      
        // After 3 seconds, remove the show class from DIV
        setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
      }
    // "'+encodeURIComponent('/' + obj.songname)+'"