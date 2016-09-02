function netatmoDashboard(){
  $(".netatmo").show()
  $(".enertalk").hide()
}
function enertalkDashboard(){
  $(".enertalk").show()
  $(".netatmo").hide()
}
window.onhashchange = function () {
     hash = window.location.hash;
     if(hash.length > 3){
       hash = hash.split("#")[1]
       $(".navigater").hide()
       $(".dashboard").hide()
       $("."+hash).show()
     }
}
function getHash(){
  hash = window.location.hash;
  if(hash.length > 3){
    hash = hash.split("#")[1]
    $(".navigater").hide()
    $(".dashboard").hide()
    $("."+hash).show()
  }
}
