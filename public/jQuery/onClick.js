$(document).ready(function(){
  $('#profile').click(()=>{
    if($('#profileDropdown').css('display')=='none'){
      $('#profileDropdown').css('display', 'block');
    }
    else {
      $('#profileDropdown').css('display', 'none');
    }
  });
});
