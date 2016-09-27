// Load jsdom, and create a window.
var jsdom = require("jsdom").jsdom;
var doc = jsdom();
var window = doc.defaultView;
$ = require('jquery')(window);

var SensorThings = function(){

}

SensorThings.prototype.createSensor = function(json){
  $.ajax({
      url: "http://scratchpad.sensorup.com/OGCSensorThings/v1.0/Sensors",
      type: "POST",
      data: json,
      contentType: "application/json; charset=utf-8",
      success: function(data){
          console.log(data);
      },
      error: function(response, status){
          console.log(response);
          console.log(status);
      }
  });
}
SensorThings.prototype.createObservedProperty = function(json){
  $.ajax({
    url: "http://scratchpad.sensorup.com/OGCSensorThings/v1.0/ObservedProperties",
    type: "POST",
    data: json,
    contentType: "application/json; charset=utf-8",
    success: function(data){
      console.log(data);
    },
    error: function(response, status){
      console.log(response);
      console.log(status);
    }
  });
}
SensorThings.prototype.createThing = function(json){
  $.ajax({
      url: "http://scratchpad.sensorup.com/OGCSensorThings/v1.0/Things",
      type: "POST",
      data: json,
      contentType: "application/json; charset=utf-8",
      success: function(data){
          console.log(data);
          console.log(data.description);  //print the description of the Thing, will print "camping lantern"
          console.log(data.Datastreams.navigationLink);
      },
      error: function(response, status){
          console.log(response);
          console.log(status);
      }
  });
}
SensorThings.prototype.createDataStream = function(json){
  $.ajax({
    url: "http://scratchpad.sensorup.com/OGCSensorThings/v1.0/Datastreams",
    type: "POST",
    data: json,
    contentType: "application/json; charset=utf-8",
    success: function(data){
        console.log(data);
    },
    error: function(response, status){
        console.log(response);
        console.log(status);
    }
  });
}

SensorThings.prototype.createObservation = function(json, datastreamId){
  $.ajax({
    url: "http://scratchpad.sensorup.com/OGCSensorThings/v1.0/Datastreams("+datastreamId+")/Observations",
    type: "POST",
    data: json,
    contentType: "application/json; charset=utf-8",
    success: function(data){
      console.log("Create Obsevation")
      console.log(data);
    },
    error: function(response, status){
      console.log(response);
      console.log(status);
    }
  });
}

SensorThings.prototype.createFeatureOfInterest = function(json){
  $.ajax({
    url: "http://scratchpad.sensorup.com/OGCSensorThings/v1.0/FeaturesOfInterest",
    type: "POST",
    data: json,
    contentType: "application/json; charset=utf-8",
    success: function(data){
      console.log(data);
    },
    error: function(response, status){
      console.log(response);
      console.log(status);
    }
  });
}

SensorThings.prototype.patchThing = function(id, json){
  $.ajax({
    url: "http://scratchpad.sensorup.com/OGCSensorThings/v1.0/Things("+id+")",
    type: "PATCH",
    data: json,
    contentType: "application/json; charset=utf-8",
    success: function(data){
      console.log("Thing Patch Success")
      console.log(data);

    },
    error: function(response, status){
      console.log(response);
      console.log(status);
    }
  });
}

SensorThings.prototype.patchSensor = function(id, json){
  $.ajax({
      url: "http://scratchpad.sensorup.com/OGCSensorThings/v1.0/Sensors("+id+")",
      type: "PATCH",
      data: json,
      contentType: "application/json; charset=utf-8",
      success: function(data){
          console.log("Sensor Patch Success")
          console.log(data);
      },
      error: function(response, status){
          console.log(response);
          console.log(status);
      }
  });
}

SensorThings.prototype.patchObservedProperty = function(id, json){
  $.ajax({
    url: "http://scratchpad.sensorup.com/OGCSensorThings/v1.0/ObservedProperties("+id+")",
    type: "PATCH",
    data: json,
    contentType: "application/json; charset=utf-8",
    success: function(data){
      console.log("Observed Properties Success")
      console.log(data);
    },
    error: function(response, status){
      console.log(response);
      console.log(status);
    }
  });
}

SensorThings.prototype.getObservation = function(id){
  $.get("http://scratchpad.sensorup.com/OGCSensorThings/v1.0/Datastreams("+id+")/Observations",function(response, status){
    console.log("Get Observation")
    console.log(response);
  });
}

module.exports = new SensorThings();
