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

var test = function(){
  alert("AA")
  console.log("AA")
  $.get("http://scratchpad.sensorup.com/OGCSensorThings/v1.0/Observations?$top=5",function(response, status){
      console.log(response);
  });
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
