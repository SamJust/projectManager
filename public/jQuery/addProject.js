window.onload = ()=>{

  document.getElementById('submitButton').onclick = () => {
    let projectName = document.getElementById('projectName').value;

    let body = 'projectName=' + encodeURIComponent(projectName);

    let xhr = new XMLHttpRequest();

    xhr.open("POST", '/newproject', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    if(projectName.length ==0)
    {
      let parent = document.getElementById('submitButton').parentNode
        , errorMessage = document.createElement("p")
        , insertReference= parent.lastChild;
      errorMessage.id = 'errorMessage';
      errorMessage.className = 'errorMessage';
      errorMessage.cols = 15;
      errorMessage.rows = 1;
      errorMessage.innerHTML = 'Project name mustn\'t be empty';
      errorMessage.className = 'entryText';
      parent.insertBefore(errorMessage, insertReference);
    }
    else {
      xhr.onreadystatechange = function(){
        if(xhr.readyState == XMLHttpRequest.DONE){
            window.location = '/profile';
        }
      };
      xhr.send(body);
    }
  };
};
