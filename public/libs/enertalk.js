/**
  에너톡 로그인 버튼 클릭시 실행
*/
var enertalkLogin = function(){
  var authUri = "https://enertalk-auth.encoredtech.com/login";

  // TODO: fill in your client ID
  var clientId = "ank5MzYzMEBuYXZlci5jb21faW1yYw==";
  var clientIdParam = "?client_id=" + clientId;

  // important! redirectUri should be identical with the uri which you write on enertalk web page
  var redirectUri = "http://localhost:3000/callback";
  var redirectUriParam = "&redirect_uri=" + redirectUri;

  var responseTypeParam = "&response_type=code";
  var appVersionParam = "&app_version=web";
  var backUrlParam = "&back_url=/authorization";

  var loginUri = authUri +
      clientIdParam +
      redirectUriParam +
      responseTypeParam +
      appVersionParam +
      backUrlParam;

  location.href = loginUri
}
/**
  realtimeUsage API를 통해 현재 전력 정보를 받아옴
*/
var getEnertalkRealtimeData = function(accessToken, uuid){
  $.ajaxSetup({
    headers: { 'Authorization': 'Bearer '+accessToken }
  });

  $.ajax({
    method: "GET",
    dataType: 'json',
    url: "https://api.encoredtech.com/1.2/devices/"+uuid+"/realtimeUsage",
    success : function(data){
      $('.realtimeTable').append(`
      <tr>
      <td>${data.timestamp}</td>
      <td>${data.apparentPower}</td>
      <td>${data.activePower}</td>
      <td>${data.reactivePower}</td>
      <td>${data.powerFactor}</td>
      <td>${data.current}</td>
      <td>${data.voltage}</td>
      <td>${data.wattHour}</td>
      <td>${data.powerBase}</td>
      </tr>`)
    },
    error : function(r, e){
      alert("statusCode : "+e.statusCode);
    }
  });
}
