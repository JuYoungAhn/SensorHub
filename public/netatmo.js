/**
  login to get access token
*/
function netatmoLogin(){
  client_id = $(".client_id").val()
  client_secret = $(".client_secret").val()
  id = $(".id").val()
  password = $(".password").val()
  scope = $(".scope").val()
  redirect_uri = $(".redirect_uri").val()
  device_id = $(".device_id").val()

  url = redirect_uri+'?client_id='+client_id+'&client_secret='+client_secret+'&id='+id+'&password='+password+'&scope='+scope+'&redirect_uri='+redirect_uri+'&device_id='+device_id

  location.href = url
}
/**
  getRealTimeData
*/
function getNetatmoRealTimeData(access_token, device_id){
  $.ajaxSetup({
    headers: null
  });
  $.ajax({
    method: "GET",
    dataType: 'json',
    url: 'https://api.netatmo.com/api/getstationsdata?access_token='+access_token+'&device_id='+device_id,
    success : function(result){
      var data = {
                  'measured_time' : result.body.devices[0].dashboard_data.time_utc,
                  'humidity' : result.body.devices[0].dashboard_data.Humidity,
                  'temperature' : result.body.devices[0].dashboard_data.Temperature,
                  'CO2' : result.body.devices[0].dashboard_data.CO2,
                  'noise' : result.body.devices[0].dashboard_data.Noise,
                  'pressure' : result.body.devices[0].dashboard_data.Pressure
      }

      $('.netatmoRealtimeTable').append(`
      <tr>
      <td>${data.measured_time}</td>
      <td>${data.temperature}°C</td>
      <td>${data.humidity}%</td>
      <td>${data.noise}dB</td>
      <td>${data.pressure}mbar</td>
      <td>${data.CO2}ppm</td>
      </tr>`)
    },
    error : function(r, e){
      alert("statusCode : "+e.statusCode);
    }
  });
}

function getRealTimeDataModule(access_token, device_id, table_name){
  $.ajaxSetup({
    headers: null
  });
  $.ajax({
    method: "GET",
    dataType: 'json',
    url: 'https://api.netatmo.com/api/getstationsdata?access_token='+access_token+'&device_id='+device_id,
    success : function(result){
      var data = {
                  'measured_time' : result.body.devices[0].modules[0].dashboard_data.time_utc,
                  'humidity' : result.body.devices[0].modules[0].dashboard_data.Humidity,
                  'temperature' : result.body.devices[0].modules[0].dashboard_data.Temperature,
                  'CO2' : result.body.devices[0].modules[0].dashboard_data.CO2
      }

      $("."+table_name).append(`
      <tr>
      <td>${data.measured_time}</td>
      <td>${data.temperature}°C</td>
      <td>${data.humidity}%</td>
      <td>${data.CO2}ppm</td>
      </tr>`)

    },
    error : function(r, e){
      alert("statusCode : "+e.statusCode);
    }
  });
}
