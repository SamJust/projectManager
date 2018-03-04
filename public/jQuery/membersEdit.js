'use strict';

let isEditing = false
  , editId, parent, selectPreeditValue;

let createSelect = (values, defaultValue) => {
  let select = document.createElement('select');
  let options;

  values.forEach((item, i, arr)=>{
    if(item == defaultValue)options+= '<option selected="selected">' + item +'</option>'
    else options+= '<option>' + item +'</option>'
  });
  select.innerHTML = options;
  return select;
}

let onCancelClick = (list)=>{
  parent = list.parentNode.parentNode;
  let inputWorker = document.createElement("p"),
  parentDivReplace = parent.getElementsByTagName('div')[0],
  parentTagReplace = parent.getElementsByTagName('div')[0].getElementsByTagName('textarea')[0];

  list.parentNode.removeChild(parent.getElementsByTagName('img')[0].nextSibling);

  inputWorker.className = 'entryWorker';
  parentTagReplace = parent.getElementsByTagName('div')[0].getElementsByTagName('select')[0];
  inputWorker.innerHTML = selectPreeditValue;
  parentDivReplace.replaceChild(inputWorker, parentTagReplace);

  list.src = '/public/edit.png';

  isEditing = false;
};

let workers;
let loadWorkers = ()=>{
  let xhr = new XMLHttpRequest();
  let projectId = document.body.getElementsByTagName('main')[0].getElementsByTagName('ul')[0].id

  xhr.open("GET", '/project/' + projectId + '/getworkers', true);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

  xhr.onreadystatechange = function(){
    if(xhr.readyState == XMLHttpRequest.DONE){
      workers = JSON.parse(xhr.response);
    }
  };
  xhr.send();
};

window.onload = function() {

  loadWorkers();

  var lists = document.getElementsByClassName('memberButtonEdit');
  for(let i = 0; i< lists.length; i++){
    lists[i].onclick = ()=>{
      if(!isEditing)
      {
        parent = lists[i].parentNode.parentNode
        let parentDivReplace = parent.getElementsByTagName('div')[0]
          , parentTagReplace = parent.getElementsByTagName('div')[0].getElementsByTagName('p')[1];

        let inputWorker = createSelect([0,1,2], workers[i].role);
        selectPreeditValue = parentTagReplace.innerHTML;
        inputWorker.className = 'entryWorker';
        inputWorker.style.height = '20px';
        parentDivReplace.replaceChild(inputWorker, parentTagReplace);

        let img = document.createElement('img');
        img.className = 'memberButtonCancel';
        img.src = '/public/cross.png';
        img.alt = 'entryButton';
        img.onclick = onCancelClick.bind(this, lists[i]);

        lists[i].parentNode.insertBefore(img, lists[i].nextSibling);

        lists[i].src = '/public/tick.png';

        editId = parent.id;
        isEditing = true;
      }
      else {
        if(parent != lists[i].parentNode.parentNode) return alert('You are editing already');
        parent = lists[i].parentNode.parentNode;
        let xhr = new XMLHttpRequest();

        let workerName = parent.getElementsByTagName('div')[0].getElementsByTagName('p')[0]
          , selectedRole = parent.getElementsByTagName('div')[0].getElementsByTagName('select')[0];

        let body = 'role=' + encodeURIComponent(selectedRole.value) + '&worker=' + encodeURIComponent(workerName.innerHTML)
        + '&workerIndex=' + encodeURIComponent(parent.id);

        xhr.open("POST", '/project/' + parent.parentNode.id + '/members', true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

        xhr.onreadystatechange = function(){
          if(xhr.readyState == XMLHttpRequest.DONE){
            location.reload();
          }
        };
        xhr.send(body);
      }
    };
  }

  let deleteButtons = document.getElementsByClassName('memberButtonDelete');

  for(let i = 0; i < deleteButtons.length; i++){
    deleteButtons[i].onclick = ()=>{
      let workerIndex = deleteButtons[i].parentNode.parentNode.id
        , workerName = deleteButtons[i].parentNode.parentNode.getElementsByTagName('div')[0].getElementsByTagName('p')[0].innerHTML;
      let result = confirm('Delete worker:' + workerName);
      if(result){
        let xhr = new XMLHttpRequest();
        let body = 'workerIndex=' + encodeURIComponent(workerIndex);

        xhr.open("DELETE", '/project/' + deleteButtons[i].parentNode.parentNode.parentNode.id + '/members', true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

        xhr.onreadystatechange = ()=>{
          if(xhr.readyState == XMLHttpRequest.DONE){
            location.reload();
          }
        };

        xhr.send(body);
      };
    };
  };
};
