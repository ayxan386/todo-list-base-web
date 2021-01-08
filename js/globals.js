function getGlobals() {
  const isLocal = true;
  const baseUrl = isLocal
    ? "http://localhost:9000"
    : "https://todo-open-api.herokuapp.com";
  return {
    baseUrl,
  };
}
