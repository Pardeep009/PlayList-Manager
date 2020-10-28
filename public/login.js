
  window.onload = function()
  {
    // $('#wrong').show();
  }

  function loginuser()
  {
    var obj = Object();
    obj.username = $('#username').val();
    obj.password = $('#password').val();
    console.log(obj);
    var request = new XMLHttpRequest();
    request.open('POST','/login');
    request.setRequestHeader("Content-Type","application/json");
    request.send(JSON.stringify(obj));
    request.onload = function()
    {
      console.log(request.responseText);
      if(request.responseText=="0")
      {
        $('#wrong').show();
      }
      else {
        window.location = '/browse'
      }
    }
  }

  function signup()
  {
    window.location = '/signup';
  }
