// Load jsdom, and create a window.
var jsdom = require("jsdom").jsdom;
var doc = jsdom();
var window = doc.defaultView;
$ = require('jquery')(window);
var sensorthings = require('./sensorthings.js')

var ENERTALK_THING_ID = 147952
var ENERTALK_SENSOR_ID = 147949
var ENERTALK_OBSERVED_PROPERTY_ID = 147953
var ENERTALK_DATASTREAM_ID = 148099
var ENERTALK_OBSERVATION_ID = 147962
var ENERTALL_FEATURE_OF_INTEREST_ID = 147986

var SensorInfo = function(){
  this.ENERTALK_THING_ID = ENERTALK_THING_ID
  this.enertalkThing = enertalkThing
  this.ENERTALK_SENSOR_ID = ENERTALK_SENSOR_ID
  this.enertalkSensor = enertalkSensor
  this.ENERTALK_DATASTREAM_ID = ENERTALK_DATASTREAM_ID
  this.enertalkDataStream = enertalkDataStream
  this.ENERTALK_OBSERVED_PROPERTY_ID = ENERTALK_OBSERVED_PROPERTY_ID
  this.enertalkObservedProperty = enertalkObservedProperty
  this.ENERTAL_OBSERVATION_ID = ENERTALK_OBSERVATION_ID
  this.enertalkObservation = enertalkObservation
}

/* Enertalk Definition */
var enertalkDataStream = JSON.stringify({
    "unitOfMeasurement": {
        "symbol": "W",
        "name": "Watt",
        "definition": "http://www.qudt.org/qudt/owl/1.0.0/unit/Instances.html"
    },
    "observationType":"http://www.opengis.net/def/observationType/OGC-OM/2.0/OM_Measurement",
    "description": "IMRC Energy Measurement",
    "Thing": {"@iot.id": ENERTALK_THING_ID},
    "ObservedProperty": {"@iot.id": ENERTALK_OBSERVED_PROPERTY_ID},
    "Sensor": {"@iot.id": ENERTALK_SENSOR_ID}
});

var enertalkSensor = JSON.stringify({
  "description": "SensorUp Tempomatic 2000",
  "encodingType": "http://schema.org/description",
  "metadata": "Calibration date:  Jan 1, 2014"
});

var enertalkObservedProperty = JSON.stringify({
  "name": "ObservedPropertyUp Tempomatic 2000",
  "description": "http://schema.org/description",
  "definition": "Calibration date:  Jan 1, 2014"
});

var enertalkThing = JSON.stringify({
  "description": "Enertalk",
  "properties": {
      "property1": "It is located in imrc laboratory1 of kist."
  }
});

var enertalkObservation = JSON.stringify({
  "phenomenonTime": "2017-04-13T00:00:00Z",
  "resultTime" : "2017-04-13T00:00:05Z",
  "result" : 382
});

var enertalkFeatureOfInterest = JSON.stringify({
    "description": "Underground Air Quality in NYC train tunnels",
    "encodingType": "http://example.org/measurement_types#Measure",
    "feature": {
      "coordinates": [51.08386,-114.13036],
      "type": "Point"
    }
});

module.exports = new SensorInfo()

// sensorthings.createDataStream(enertalkDataStream)
// console.log("Create Observation")
// sensorthings.createObservation(enertalkObservation, ENERTALK_DATASTREAM_ID)

//console.log("Create Feature Of Interest")
//sensorthings.createFeatureOfInterest(enertalkFeatureOfInterest)
