var foobotLogin = function(){
  foobot_login_form.submit()
}
function getData(uuid, auth_token){
  var start = $(".start").val()
  var end = $(".end").val()
  var average = $(".average").val()

  location.href = 'foobot/data?uuid='+uuid+'&auth_token='+auth_token+'&start='+start+'&end='+end+"&average="+average
}
var foobotGetData = function(){
  foobot_form.submit()
}
