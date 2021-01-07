function loaded() {
  $("form").on("submit", (e) => {
    e.preventDefault();
    const data = {
      username: $("#username").val(),
      password: $("#password").val(),
    };
    fetch((url = `${getGlobals().baseUrl}/v1/auth/register`), {
      method: "POST",
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      });
  });
}
