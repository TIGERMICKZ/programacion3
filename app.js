const STORAGE_KEY = "students_list_v1";
const MOCK_URL = "https://demo.mockable.io/mi-endpoint-carreras";

let students = [];
let carrerasList = [];
let editModal;

function init() {
  loadCarreras();
  loadStudents();
  editModal = new bootstrap.Modal(document.getElementById("modal-edit"));
}

function showPane(pane) {
  
  document.querySelectorAll(".card-pane").forEach(x => 
    x.classList.add("hidden")
  );
  
  document.getElementById(`pane-${pane}`).classList.remove("hidden");
  
  document.querySelectorAll(".nav-option").forEach(x => 
    x.classList.remove("active")
  );
  document.getElementById(`nav-${pane}`).classList.add("active");
  
  if (pane === "list") renderList();
}



async function loadCarreras() {
  try {
    const r = await fetch("http://demo4485784.mockable.io/programacion");
    const data = await r.json();
    carrerasList = Array.isArray(data) ? data : data.carreras;
  } catch {
    carrerasList = ["T.P. Sistemas", "Contabilidad", "Ing. Mecánica"];
  }
  fillCarreras();
}

function fillCarreras() {
  const c1 = document.getElementById("select-carrera");
  const c2 = document.getElementById("edit-carrera");

  c1.innerHTML = <option value="">-- Seleccione opción --</option>;
  c2.innerHTML = <option value="">-- Seleccione opción --</option>;

  carrerasList.forEach(c => {
    c1.innerHTML += <option value="${c}">${c}</option>;
    c2.innerHTML += <option value="${c}">${c}</option>;
  });
}

function loadStudents() {
  students = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [
    { nombres: "Carlos", apellidos: "Perez", edad: 32, carrera: "T.P. Sistemas", estrato: 1 },
    { nombres: "Diana", apellidos: "Trejos", edad: 25, carrera: "Contabilidad", estrato: 3 },
    { nombres: "Juan", apellidos: "Perez", edad: 40, carrera: "Ing. Mecanica", estrato: 2 }
  ];
}

function saveStudents() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
}

function saveStudent() {
  const nombres = document.getElementById("input-nombres").value.trim();
  const apellidos = document.getElementById("input-apellidos").value.trim();
  const edad = Number(document.getElementById("input-edad").value);
  const carrera = document.getElementById("select-carrera").value;
  const estrato = Number(document.getElementById("input-estrato").value);

  const s = { nombres, apellidos, edad, carrera, estrato };

  students.push(s);
  saveStudents();

  alert("Estudiante guardado correctamente");

  document.getElementById("form-create").reset();
  showPane("list");
}

function renderList() {
  const tbody = document.getElementById("tbody-students");
  tbody.innerHTML = "";

  students.forEach((s, i) => {
    tbody.innerHTML += `
      <tr>
        <td>${i}</td>
        <td>${s.nombres}</td>
        <td>${s.apellidos}</td>
        <td>${s.edad}</td>
        <td>${s.carrera}</td>
        <td>${s.estrato}</td>
        <td>
          <button class="btn btn-warning btn-sm" onclick="openEdit(${i})">Editar</button>
          <button class="btn btn-danger btn-sm" onclick="deleteAt(${i})">Eliminar</button>
        </td>
      </tr>
    `;
  });
}

function deleteById() {
  const id = Number(document.getElementById("input-delete-id").value);
  if (id >= 0 && id < students.length) {
    students.splice(id, 1);
    saveStudents();
    alert("Eliminado");
    renderList();
  }
}

function deleteAt(id) {
  students.splice(id, 1);
  saveStudents();
  renderList();
}

function openEdit(id) {
  const s = students[id];

  document.getElementById("edit-id").value = id;
  document.getElementById("edit-nombres").value = s.nombres;
  document.getElementById("edit-apellidos").value = s.apellidos;
  document.getElementById("edit-edad").value = s.edad;
  document.getElementById("edit-carrera").value = s.carrera;
  document.getElementById("edit-estrato").value = s.estrato;

  editModal.show();
}

function applyEdit() {
  const id = Number(document.getElementById("edit-id").value);

  students[id] = {
    nombres: document.getElementById("edit-nombres").value.trim(),
    apellidos: document.getElementById("edit-apellidos").value.trim(),
    edad: Number(document.getElementById("edit-edad").value),
    carrera: document.getElementById("edit-carrera").value,
    estrato: Number(document.getElementById("edit-estrato").value)
  };

  saveStudents();
  editModal.hide();
  renderList();
}

function closeEditModal() {
  editModal.hide();
} 