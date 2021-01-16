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
    addCheckBoxListener();
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
    $("#item-lists").html("");
    lists.forEach((list) => addToLists(list));
    addCheckBoxListener();
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
  $(`#item-adder-${listData.id}`).on("submit", (e) => {
    e.preventDefault();
    const id = e.target.id.substr("item-adder-".length);
    postItem(id);
    e.target.reset();
  });
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
              <span id="btn-delete-${id}" class="btn-delete-list">
                <button onclick="deleteList('${id}')" class="btn btn-delete">
                  <i class="fas fa-times"></i>
                </button>
              </span>
            </div>
          </div>
          <div id="list-${id}" class="sidenav">
            <div id="items-list-${id}" class="items-list">
               ${addItems(items)}
            </div>
            <form id="item-adder-${id}" class="item-adder" onsubmit="postItem()">
                <div class="item-row">
                  <input
                    name="item-title-${id}"
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
  document.getElementById(`item-list-${id}`).style.height = "420px";
  document.getElementById(`btn-open-${id}`).style.display = "none";
  document.getElementById(`btn-closed-${id}`).style.display = "inline-block";
}

function closeNav(id) {
  document.getElementById(`list-${id}`).style.width = "0";
  document.getElementById(`list-${id}`).style.height = "0";
  document.getElementById(`item-list-${id}`).style.height = "90px";
  document.getElementById(`btn-open-${id}`).style.display = "inline-block";
  document.getElementById(`btn-closed-${id}`).style.display = "none";
}

function addItems(items) {
  let str = "";
  if (items.length > 0) {
    items.forEach((item) => {
      str += `  <div
              class="list-item list-group-item d-flex justify-content-between align-items-center" id="item-${item.id}"
              onclick="openItem('${item.itemListId}', '${item.id}')">
              <span>
              <input type='checkbox' class='item-status' id="item-status-${item.id}" itemContent="${item.content}"/>
                 ${item.title}
              </span>
              <button onclick="deleteItem('${item.id}', '${item.itemListId}')" class="btn"><i class="fas fa-times"></i></button>
            </div>`;
    });
  } else {
    str = "List is empty";
  }
  return str;
}

function addItemToExistingList(item) {
  const body = $(`#items-list-${item.itemListId}`).html();
  if (body.includes("div")) {
    $(`#items-list-${item.itemListId}`).append(addItems([item]));
  } else {
    $(`#items-list-${item.itemListId}`).html(addItems([item]));
  }

  addItemToLocalStorage(item);
}

function addItemToLocalStorage(item) {
  const lists = JSON.parse(window.localStorage.getItem("lists"));
  for (let i = 0; i < lists.length; i++) {
    const list = lists[i];
    if (list.id === item.itemListId) {
      let flag = true;
      const items = list.items;
      for (let j = 0; j < items.length; j++) {
        if (items[j].id === item.id) {
          items[j] = item;
          flag = false;
          break;
        }
      }
      if (flag) list.items.push(item);
      window.localStorage.setItem("lists", JSON.stringify(lists));
      break;
    }
  }
}

function postItem(id) {
  const title = $(`input[name='item-title-${id}'`).val();
  const url = `${getGlobals().baseUrl}/item-list/addItem`;
  const data = {
    title,
    itemListId: id,
  };
  const token = window.localStorage.getItem("token");
  fetch(url, {
    method: "PUT",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.message === "success") addItemToExistingList(data.data);
    });
}

function deleteItem(itemId, itemListId) {
  const url = `${getGlobals().baseUrl}/item-list/item?id=${itemId}`;
  const token = window.localStorage.getItem("token");

  fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.data === "deleted") removeItemFromList(itemId, itemListId);
    });
}

function removeItemFromList(itemId, itemListId) {
  const par = $(`#items-list-${itemListId}`);
  $(`#items-list-${itemListId}`).children(`#item-${itemId}:first`).remove();

  if (!par.html().includes("div")) {
    par.html("List is empty");
  }
}

function deleteList(listId) {
  const url = `${getGlobals().baseUrl}/item-list/list?id=${listId}`;
  const token = window.localStorage.getItem("token");

  fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.data === "deleted") removeList(listId);
    });
}

function removeList(listId) {
  $(`#item-list-${listId}:first`).remove();
}

function openItem(itemListId, itemId) {
  const lists = JSON.parse(window.localStorage.getItem("lists"));

  lists
    .filter((list) => list.id === itemListId)
    .flatMap((list) => list.items)
    .filter((item) => item.id === itemId)
    .forEach((item) => {
      $("#pop-up-holder").css("display", "grid");
      $("#item-desc-title").html(item.title);
      $("#item-desc").attr("item-id", itemId);
      $("#item-desc").attr("list-id", itemListId);
      $("#item-desc-create-date").html(item.createDate);
      $("#item-desc-update-date").html(item.updateDate);
      $("#item-desc-desc").val(item.content);
    });
}

function closePopUp() {
  $("#pop-up-holder").css("display", "none");
  $("#item-desc").attr("item-id", "");
  $("#item-desc").attr("list-id", "");
}

function updateItemDetails(content, status, itemId) {
  const url = `${getGlobals().baseUrl}/item-list/update-item`;
  const data = {
    id: itemId,
    content,
    status,
  };
  const token = window.localStorage.getItem("token");
  return fetch(url, {
    method: "PUT",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.message === "success") {
        addItemToLocalStorage(data.data);
      }
    });
}

function updateContentFromPopUp() {
  const content = $("#item-desc-desc").val();
  const itemId = $("#item-desc").attr("item-id");
  const checkboxStatte = $(`#item-status-${itemId}`).attr("checked");
  const status = checkboxStatte ? "DONE" : "NEW";
  updateItemDetails(content, status, itemId).then((e) => closePopUp());
}

function addCheckBoxListener() {
  $(".item-status").click((event) => {
    event.stopPropagation();
    const itemId = event.target.id.substr("item-status-".length);
    itemChecked(itemId, event.target.checked);
  });
}

function itemChecked(itemId, statusBoolean) {
  const content = $(`#item-status-${itemId}`).attr("itemContent");
  const status = statusBoolean ? "DONE" : "NEW";
  updateItemDetails(content, status, itemId);
}
