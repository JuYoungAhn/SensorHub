var addSensor = function(){
  var sensor = {
    "@type": "Sensor",
    "name": $("[name='name']").val(),
    "description": $("[name='description']").val(),
    "definition": $("[name='definition']").val(),
    "encodingType": "http://schema.org/description",
    "place": $("[name='place']").val(),
    "location": {
      "@type": "GeoCoordinates",
      "geometry": $("[name='geometry']").val(),
      "altitude": $("[name='altitude']").val(),
      "id": $("[name='id']").val()
    },
    "@context": "http://webizing.org",
    "alternateName": $("[name='alternateName']").val(),
    "size": {
      "x": $("[name='size_x']").val(),
      "y": $("[name='size_y']").val(),
      "z": $("[name='size_z']").val(),
      "id": $("[name='size_id']").val()
    },
    "category": [
      $("[name='category']").val()
    ],
    "sameAs": [
      $("[name='sameAs']").val()
    ],
    "image": "string"
  }
  $.ajaxSetup({
    headers: null
  });
  $.ajax({
    method: "POST",
    dataType: 'json',
    url: 'http://kistvr.webizing.org/Sensors',
    data : sensor,
    success : function(result){
        $("#myModal .modal-close").click()
        window.location.reload()
    },
    error : function(r, e){
      alert("statusCode : "+e.statusCode);
    }
  });
}
var addObservation = function(){
  alert("Add Observation")
}
var deleteObject = function(type, id){
  var result = null
  $.ajaxSetup({
    headers: null
  });
  $.ajax({
    method: "DELETE",
    dataType: 'json',
    url: 'http://kistvr.webizing.org/'+type+'/'+id,
    success : function(result){
      result = result
      // alert(result)
    },
    error : function(r, e){
      // alert("statusCode : "+e.statusCode);
    }
  });

  window.location.reload()
}
