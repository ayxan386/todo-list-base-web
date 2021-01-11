function listHolderLoaded() {
  checkForToken();
  addListenerToForm();
  loadAllLists();
}

function checkForToken() {
  if (window.localStorage.getItem("token") === null) {
    window.location.replace("login.html");
  }
}

function loadAllLists() {
  const prevLists = JSON.parse(window.localStorage.getItem("lists"));
  if (prevLists !== null) {
    prevLists.forEach((list) => addToLists(list));
  }
  const token = window.localStorage.getItem("token");
  const authHeader = `Bearer ${token}`;
  const url = `${getGlobals().baseUrl}/item-list/mine`;
  $.ajax({
    url,
    method: "GET",
    beforeSend: (xhr) => xhr.setRequestHeader("Authorization", authHeader),
  }).done((res) => {
    const lists = res.data;
    window.localStorage.setItem("lists", JSON.stringify(lists));
    lists
      .filter((list) => prevLists.filter((l) => l.id === list.id).length === 0)
      .forEach((list) => addToLists(list));
  });
}

function addListenerToForm() {
  $("#list-maker").on("submit", (event) => {
    event.preventDefault();
    const data = $("#list-name-input").val();
    const token = window.localStorage.getItem("token");
    const authHeader = `Bearer ${token}`;
    const url = `${getGlobals().baseUrl}/item-list/${data}`;
    $.ajax({
      url,
      method: "POST",
      beforeSend: (xhr) => xhr.setRequestHeader("Authorization", authHeader),
    }).done((data) => {
      addToLists(data.data);
      $("#list-maker").trigger("reset");
    });
  });
}

function addToLists(listData) {
  const newItemList = formItemList(listData);
  $("#item-lists").append(newItemList);
}

function formItemList(listData) {
  const { name, id, items } = listData;
  const str = `
<div class="item-list" id="item-list-${id}">
          <div class="item-row">
            <h3 class="item-list-title">${name}</h3>
            <div>
              <span class="btn-open" id="btn-open-${id}">
                <button class="btn btn-open" onclick="openNav('${id}')">
                  <i class="fas fa-chevron-down"></i>
                </button>
              </span>
              <span id="btn-closed-${id}" class="btn-closed">
                <button onclick="closeNav('${id}')" class="btn btn-closed">
                  <i class="fas fa-chevron-up"></i>
                </button>
              </span>
            </div>
          </div>
          <div id="list-${id}" class="sidenav">
          ${addItems(items)}
            <form id="item-adder-${id}" class="item-adder">
                <div class="item-row">
                  <input
                    name="item-name-${id}"
                    type="text"
                    class="form-control"
                    placeholder="Enter new item"
                  />
                  <button class="btn btn-primary">
                    <i class="fas fa-plus"></i>
                  </button>
                </div>
              </form>
          </div>
        </div>
`;
  return str;
}

function openNav(id) {
  document.getElementById(`list-${id}`).style.width = "97%";
  document.getElementById(`list-${id}`).style.height = "100%";
  document.getElementById(`btn-open-${id}`).style.display = "none";
  document.getElementById(`btn-closed-${id}`).style.display = "inline-block";
}

function closeNav(id) {
  document.getElementById(`list-${id}`).style.width = "0";
  document.getElementById(`list-${id}`).style.height = "0";
  document.getElementById(`btn-open-${id}`).style.display = "inline-block";
  document.getElementById(`btn-closed-${id}`).style.display = "none";
}

function addItems(items) {
  let str = "";
  if (items.length > 0) {
    items.forEach((item) => {
      str += `  <div
              class="list-item list-group-item d-flex justify-content-between align-items-center">
              ${item.title}
            </div>`;
    });
  } else {
    str = "List is empty";
  }
  return str;
}
