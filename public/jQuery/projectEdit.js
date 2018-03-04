'use strict';

let isEditing = false
  , editId, parent, selectPreeditValue;

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

let createSelect = (values, defaultValue) => {
  let select = document.createElement('select');
  let options;

  values.forEach((item, i, arr)=>{
    if(item.name == defaultValue)options+= '<option selected="selected">' + item.name +'</option>'
    else options+= '<option>' + item.name +'</option>'
  });
  select.innerHTML = options;
  return select;
}

let onCancelClick = (list)=>{
  parent = list.parentNode.parentNode;
  let inputName = document.createElement("p"),
  inputWorker = document.createElement("p"),
  parentDivReplace = parent.getElementsByTagName('div')[0],
  parentTagReplace = parent.getElementsByTagName('div')[0].getElementsByTagName('textarea')[0];
  inputName.cols = 15;
  inputName.rows = 1;
  inputName.innerHTML = parentTagReplace.innerHTML;
  inputName.className = 'entryText';
  parentDivReplace.replaceChild(inputName, parentTagReplace);

  list.parentNode.removeChild(parent.getElementsByTagName('img')[0].nextSibling);

  inputWorker.className = 'entryWorker';
  parentTagReplace = parent.getElementsByTagName('div')[0].getElementsByTagName('select')[0];
  inputWorker.innerHTML = selectPreeditValue;
  parentDivReplace.replaceChild(inputWorker, parentTagReplace);

  list.src = '/public/edit.png';

  isEditing = false;
};

window.onload = function() {

  loadWorkers();

  var lists = document.getElementsByClassName('entryButtonEdit');
  for(let i = 0; i< lists.length; i++){
    lists[i].onclick = ()=>{
      if(!isEditing)
      {
        parent = lists[i].parentNode.parentNode
        let inputName = document.createElement("textarea")
          , parentDivReplace = parent.getElementsByTagName('div')[0]
          , parentTagReplace = parent.getElementsByTagName('div')[0].getElementsByTagName('p')[0];
        inputName.cols = 15;
        inputName.rows = 1;
        inputName.innerHTML = parentTagReplace.innerHTML;
        inputName.className = 'entryText';
        parentDivReplace.replaceChild(inputName, parentTagReplace);

        parentTagReplace = parent.getElementsByTagName('div')[0].getElementsByTagName('p')[0];
        let inputWorker = createSelect(workers, parentTagReplace.innerHTML);
        selectPreeditValue = parentTagReplace.innerHTML;
        inputWorker.className = 'entryWorker';
        inputWorker.style.height = '20px';
        parentDivReplace.replaceChild(inputWorker, parentTagReplace);

        let img = document.createElement('img');
        img.className = 'entryButtonCancel';
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

        let textareaAssignment = parent.getElementsByTagName('div')[0].getElementsByTagName('textarea')[0]
          , selectedWorker = parent.getElementsByTagName('div')[0].getElementsByTagName('select')[0];

        if(textareaAssignment.value.length == 0) return;

        let body = 'assignment=' + encodeURIComponent(textareaAssignment.value) + '&worker=' + encodeURIComponent(selectedWorker.value)
        + '&assignmentId=' + encodeURIComponent(parent.id);

        xhr.open("POST", '/project/' + parent.parentNode.id, true);
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

  let deleteButtons = document.getElementsByClassName('entryButtonDelete');

  for(let i = 0; i < deleteButtons.length; i++){
    deleteButtons[i].onclick = ()=>{
      let assignmentValue = deleteButtons[i].parentNode.parentNode.getElementsByTagName('div')[0].getElementsByTagName('p')[0].innerHTML
        , assignmentId = deleteButtons[i].parentNode.parentNode.id;
      let result = confirm('Delete assignment:' + assignmentValue);
      if(result){
        let xhr = new XMLHttpRequest();
        let body = 'assignmentId=' + encodeURIComponent(assignmentId);

        xhr.open("DELETE", '/project/' + deleteButtons[i].parentNode.parentNode.parentNode.id, true);
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
