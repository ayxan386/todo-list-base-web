function getGlobals() {
  const isLocal = false;
  const baseUrl = isLocal
    ? "http://localhost:9000"
    : "https://todo-list-2021.herokuapp.com";
  return {
    baseUrl,
  };
}
