$(document).ajaxError(function (event, jqxhr, settings, thrownError) {
  if (jqxhr.status == 0) {
    window.location.replace("login.html");
  } else {
    alert(jqxhr.reponseJSON ? jqxhr.reponseJSON.message : "Unknown error");
  }
});
