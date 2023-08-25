let crud_create = document.querySelector(".crud_create");
let crud_title__input = document.querySelector(".crud_title__input");
let crud_desc__input = document.querySelector(".crud_desc__input");
let servicesList = document.querySelector("#servicesList1");
let mainModal = document.querySelector(".main-modal");
let inpEdit = document.querySelector(".inp-edit");
let btnCloser = document.querySelector(".btn-closer");
let btnSave = document.querySelector(".btn-save");
let selectedImage = document.getElementById("selectedImage");
let imagePreview = document.getElementById("imagePreview");

crud_create.addEventListener("click", () => {
  if (
    !crud_title__input.value.trim() ||
    !crud_desc__input.value.trim() ||
    !selectedImage.files[0]
  ) {
    alert("Заполните все поля, включая выбор фото");
    return;
  }

  let obj = {
    title: crud_title__input.value,
    description: crud_desc__input.value,
    image: URL.createObjectURL(selectedImage.files[0]),
  };

  setItemToStorage(obj);
  renderServices();

  crud_title__input.value = "";
  crud_desc__input.value = "";
  selectedImage.value = "";
  imagePreview.src = "";
});

selectedImage.addEventListener("change", () => {
    if (selectedImage.files.length > 0) {
      const file = selectedImage.files[0];
      const reader = new FileReader();
  
      reader.onload = function (event) {
        imagePreview.src = event.target.result;
      };
  
      reader.readAsDataURL(file);
    } else {
      imagePreview.src = "";
    }
  });

btnSave.addEventListener("click", () => {
  let data = getServicesFromLocalStorage();
  let index = inpEdit.getAttribute("data-index");
  if (!inpEdit.value.trim()) {
    alert("Заполните поле");
    return;
  }
  let newService = {
    title: inpEdit.value,
    description: data[index].description,
  };
  data.splice(index, 1, newService);
  saveServicesToLocalStorage(data);
  mainModal.style.display = "none";
  inpEdit.value = "";
  renderServices();
});

btnCloser.addEventListener("click", () => {
  mainModal.style.display = "none";
});


function setItemToStorage(service) {
  let services = getServicesFromLocalStorage();
  services.push(service);
  saveServicesToLocalStorage(services);
}

function getServicesFromLocalStorage() {
  const servicesJson = localStorage.getItem("services");
  return JSON.parse(servicesJson) || [];
}

function saveServicesToLocalStorage(services) {
  const servicesJson = JSON.stringify(services);
  localStorage.setItem("services", servicesJson);
}

function renderServices() {
  const services = getServicesFromLocalStorage();
  servicesList.innerHTML = "";

  services.forEach((service, index) => {
    const serviceItem = document.createElement("li");
    serviceItem.className = "services__item1";

    serviceItem.innerHTML += `
    <div>
    <img src="${service.image}" alt="" class="services__icon1">
    <h4 class="services__title1">${service.title}</h4>
    <p class="services__desc1">${service.description}</p>
    <button onclick="updateService(${index})">Update</button>
    <button onclick="deleteService(${index})">Delete</button>
  </div>
      `;
    servicesList.appendChild(serviceItem);
  });
}


function updateService(index) {
  const services = getServicesFromLocalStorage();
  inpEdit.setAttribute("data-index", index);
  inpEdit.value = services[index].title;
  mainModal.style.display = "block";
}

function deleteService(index) {
  const services = getServicesFromLocalStorage();
  services.splice(index, 1);
  saveServicesToLocalStorage(services);
  renderServices();
}

renderServices();

