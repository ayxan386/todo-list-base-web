$(document).ajaxError(function (event, jqxhr, settings, thrownError) {
  if (jqxhr.status == 0) {
    window.location.replace("login.html");
  } else {
    console.error(jqxhr);
    alert(jqxhr.responseJSON ? jqxhr.responseJSON.message : "Unknown error");
  }
});
