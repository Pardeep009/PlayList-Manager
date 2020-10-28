let type = $('#type').html();
let data;

// console.log(type);

function getSongs(type)
{
    let request = new XMLHttpRequest();
    request.open('POST','/getSongs');
    request.setRequestHeader("Content-Type","application/json");
    request.send(JSON.stringify({
        category : type,
    }));
    request.onload = function()
    {
        // console.log(request.responseText);
        data = JSON.parse(request.responseText);
        for (var i in data)
        {
            addToDom(data[i],'s');
        }
    }
}

getSongs(type)
