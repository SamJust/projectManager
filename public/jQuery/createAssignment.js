window.onload = ()=>{

  document.getElementById('submitButton').onclick = () => {
    let assignment = document.getElementById('assignment').value
      , worker = document.getElementById('worker').value;

    let body = 'assignment=' + encodeURIComponent(assignment)
               + '&worker=' + encodeURIComponent(worker);

    let xhr = new XMLHttpRequest();

    xhr.open("POST", '/project/' + document.getElementById('assignment').parentNode.id + '/newentry', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    xhr.onreadystatechange = function(){
      if(xhr.readyState == XMLHttpRequest.DONE){
        location.reload();
      }
    };
    xhr.send(body);
  };
};
