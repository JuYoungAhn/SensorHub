var test = function(){
  $.get("http://scratchpad.sensorup.com/OGCSensorThings/v1.0/Observations?$top=5",function(response, status){
      console.log(response);
  });
}
