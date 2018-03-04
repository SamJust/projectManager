window.onload = ()=>{

  document.getElementById('submitButton').onclick = () => {
    let worker = document.getElementById('worker').value
      , role = document.getElementById('role').value;

    let body = 'worker=' + encodeURIComponent(worker)
               + '&role=' + encodeURIComponent(role);

    let xhr = new XMLHttpRequest();

    xhr.open("POST", '/project/' + document.getElementById('worker').parentNode.parentNode.id + '/newmember', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    xhr.onreadystatechange = function(){
      if(xhr.readyState == XMLHttpRequest.DONE){
        if(xhr.response == 'added') location.reload();
        else{
          if(document.getElementById('errorMessage') == undefined)
          {
            let parent = document.getElementById('submitButton').parentNode
              , errorMessage = document.createElement("p")
              , insertReference= parent.lastChild;
            errorMessage.id = 'errorMessage';
            errorMessage.className = 'errorMessage';
            errorMessage.cols = 15;
            errorMessage.rows = 1;
            errorMessage.innerHTML = xhr.response;
            errorMessage.className = 'entryText';
            parent.insertBefore(errorMessage, insertReference);
          }
          else {
            document.getElementById('errorMessage').innerHTML = xhr.response;
          }
        }
      }
    };
    xhr.send(body);
  };
};
