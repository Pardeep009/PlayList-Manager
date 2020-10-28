
    let playlist_id = $('#playlist-id').html();
    console.log(playlist_id);
    let start = 0;
    let data;

    function getPlaylistSongs(start)
    {
        let request = new XMLHttpRequest();
        request.open('POST','/getPlaylistSongs');
        request.setRequestHeader("Content-Type","application/json");
        request.send(JSON.stringify({
            playlist_id : playlist_id,
            start : start
        }));
        request.onload = function()
        {
            // console.log(request.responseText);
            data = JSON.parse(request.responseText);
            for (var i in data.songs)
            {
                addToDom(data.songs[i],'p');
            }
        }
    }

    function removeSong(id)
    {
        let request = new XMLHttpRequest();
        request.open('POST','/removeSongfromPlayList');
        request.setRequestHeader("Content-Type","application/json");
        request.send(JSON.stringify({
            playlist_id : playlist_id,
            songid : id
        }));
        request.onload = function()
        {
            // console.log(request.responseText);
            // alert('removed');
            myFunction("Song was Removed");
        }
    }

    function removePlayList(id)
    {
        let request = new XMLHttpRequest();
        request.open('POST','/removePlayList');
        request.setRequestHeader("Content-Type","application/json");
        request.send(JSON.stringify({
            playlist_id : id,
        }));
        request.onload = function()
        {
            // console.log(request.responseText);
            // alert('removed');
            // myFunction("PlayList Deleted");
            window.location = '/browse'
        }
    }

    // $(window).scroll(function() {
    //     if($(window).scrollTop() == $(document).height() - $(window).height()) {
    //         // ajax call get data from server and append to the div
    //         // console.log("dsddsj")
    //         start+=3;
    //         // end+=3;
    //         getPlaylistSongs(start);
    //     }
    // });

    getPlaylistSongs(start)