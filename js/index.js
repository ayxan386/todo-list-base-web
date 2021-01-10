function listHolderLoaded() {
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
  const newItemList = formItemList(listData.name, listData.id);
  $("#item-lists").append(newItemList);
}

function formItemList(name, id) {
  const str = `
<div class="item-list" id="item-list-${id}">
          <div class="row">
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
            <div
              class="list-item list-group-item d-flex justify-content-between align-items-center"
            >
              Hello there
            </div>
          </div>
        </div>
`;
  return str;
}

function openNav(id) {
  console.log(id);
  document.getElementById(`list-${id}`).style.width = "100%";
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
