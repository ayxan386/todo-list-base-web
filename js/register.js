function loaded() {
  $("form").on("submit", (e) => {
    e.preventDefault();
    const data = {
      nickname: $("#username").val(),
      password: $("#password").val(),
    };

    const url = `${getGlobals().baseUrl}/auth/register`;

    $.ajax({
      url: url,
      data: JSON.stringify(data),
      method: "POST",
      contentType: "application/json; charset=utf-8",
      dataType: "json",
    })
      .done((data) => {
        window.localStorage.setItem("token", data.token);
        window.location.replace(`/index.html`);
      })
      .fail((res) =>
        alert(res.responseJSON ? res.responseJSON.message : "Unknown error")
      );
  });
}
