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

$(document).ready(function(){
    $(".enertalk_login").click(function(){
        $("#myModal").attr("id")
        //$("#myModal").modal('show');
    });
});
var addObservation = function(){
  alert("Add Observation")
}
//simple chart
$(function() {
  var sensorthingsHCDT = new SensorthingsHCDT('http://example.sensorup.com', {
    'dataStreamId': [4207]
  });
  var request = sensorthingsHCDT.request();
  if (request.status == 'success') {
    sensorthingsHCDT.chart('chart-container', request);
  }
});
