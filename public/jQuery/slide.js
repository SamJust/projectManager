$(document).ready(function(){
  $('#scroll').click(()=>{
    if($('#navbar').css('display')=='none'){
      $('#navbar').removeClass('hideNavbar');
      $('#navigation').css('width', '150px');
      $('#profile').css('margin-left', '55px');
      $('main').css('margin-left', '160px');
    }
    else {
      $('#navbar').addClass('hideNavbar');
      $('#navigation').css('width', '50px');
      $('#profile').css('margin-left', '5px');
      $('main').css('margin-left', '60px');
    }
  });
});
