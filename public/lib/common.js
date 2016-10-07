$(document).ready(function(){

});
window.onhashchange = function () {
     hash = window.location.hash;
     if(hash.length > 3){
       hash = hash.split("#")[1]
       $(".navigater").hide()
       $(".dashboard").hide()
       $("."+hash).show()
     }
}
var getHash = function(){
  hash = window.location.hash;
  if(hash.length > 3){
    hash = hash.split("#")[1]
    $(".navigater").hide()
    $(".dashboard").hide()
    $("."+hash).show()
  }
}
