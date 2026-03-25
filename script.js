const btnAdd = document.getElementById("add");
const specialTask = document.querySelector(".add-task");
const btnSave = document.getElementById("save");
const tasks = document.querySelector(".tasks");
const search = document.getElementById("search");
const cancel = document.querySelector(".cancel");

let taskEditando = null; // ✅ Variável que guarda qual task está editando

// Abrir formulário para NOVA task
btnAdd.addEventListener("click", (e) => {
  e.preventDefault();
  taskEditando = null; // ✅ Marca como "criando nova"
  specialTask.style.display = "flex";
});

// Salvar (criar OU editar)
btnSave.addEventListener("click", (e) => {
  e.preventDefault();

  if (taskEditando) {
    editarTask(); // ✅ Se tá editando, edita
  } else {
    salvarTask(); // ✅ Se não, cria nova
  }

  specialTask.style.display = "none";
});




function renderTask(data) {
  const newTask = document.createElement("div");

  newTask.className = "task";
  newTask.innerHTML = `
    <p class="task-title">${data.title}</p>
    <p class="task-content">${data.content}</p>
    <span class="material-icons task-icon">radio_button_unchecked</span>
    <div class="buttons">
      <button class="edit">Editar</button>
      <button class="delete">Excluir</button>
    </div>
  `;

  tasks.appendChild(newTask);
}

// Criar nova task
function salvarTask() {

  const titleInput = document.getElementById("title");
  const contentInput = document.getElementById("content");

  const data = {
    title: titleInput.value,
    content: contentInput.value,
  };

  renderTask(data);             
  saveTasklocalStorage(data);   

  titleInput.value = "";
  contentInput.value = "";
}

function editarTask() {
  const titleInput = document.getElementById("title");
  const contentInput = document.getElementById("content");

  const oldTitle = taskEditando.querySelector(".task-title").textContent;

  // Atualiza a task que estava editando
  taskEditando.querySelector(".task-title").textContent = titleInput.value;
  taskEditando.querySelector(".task-content").textContent = contentInput.value;

  editTaskLocalStorage(oldTitle, titleInput.value, contentInput.value);

  // Limpa
  titleInput.value = "";
  contentInput.value = "";
  taskEditando = null; //
}

// Delegação de eventos
tasks.addEventListener("click", (e) => {
  // Deletar
  if (e.target.classList.contains("delete")) {
    const taskElement = e.target.closest(".task");
   
    const titleParaRemover = taskElement.querySelector(".task-title").innerText;

    
    removeTaskLocalStorage(titleParaRemover);

    taskElement.remove();
  }

  // Editar
  if (e.target.classList.contains("edit")) {
    taskEditando = e.target.closest(".task"); // ✅ Guarda qual task está editando

    const titulo = taskEditando.querySelector(".task-title").textContent;
    const conteudo = taskEditando.querySelector(".task-content").textContent;

    document.getElementById("title").value = titulo;
    document.getElementById("content").value = conteudo;
    specialTask.style.display = "flex";
  }

  if (e.target.classList.contains("task-icon")) {
    e.target.classList.toggle("done");
    e.target.innerText = e.target.classList.contains("done")
      ? "task_alt"
      : "radio_button_unchecked";

    const task = e.target.closest(".task");
    const titleTask = task.querySelector(".task-title");
    const contentTask = task.querySelector(".task-content");

    const isChecked = e.target.classList.contains("done");

    titleTask.style.textDecoration = isChecked ? "line-through" : "none";
    contentTask.style.textDecoration = isChecked ? "line-through" : "none";
  }
});

// Buscar
search.addEventListener("input", () => {
  const searchValue = search.value.toLowerCase();
  const todasTasks = document.querySelectorAll(".task");

  todasTasks.forEach((task) => {
    const text = task.querySelector(".task-title").innerText.toLowerCase();
    task.style.display = text.includes(searchValue) ? "flex" : "none";
  });
});

// Cancelar
cancel.addEventListener("click", () => {
  specialTask.style.display = "none";
  document.getElementById("title").value = "";
  document.getElementById("content").value = "";
  taskEditando = null;
});



const getTaskslocalStorage = () => {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  return tasks;
};

const  loadTasks = () =>{
  const tasks = getTaskslocalStorage();
  tasks.forEach(task => renderTask(task));
}


const saveTasklocalStorage = (task) => {
  const tasks = getTaskslocalStorage();

  tasks.push(task);

  localStorage.setItem("tasks", JSON.stringify(tasks));
};

const removeTaskLocalStorage = (taskTitle) => {
  const tasks = getTaskslocalStorage();

  const filteredTasks = tasks.filter((task) => 
    task.title.trim().toLowerCase() !== taskTitle.trim().toLowerCase()
  );

  localStorage.setItem("tasks", JSON.stringify(filteredTasks));
};

const editTaskLocalStorage = (oldTitle, newTitle, newContent) => {
  const tasks = getTaskslocalStorage();

  tasks.forEach((task) => {
    if (task.title === oldTitle) {
      task.title = newTitle;
      task.content = newContent;
    }
  });

  localStorage.setItem("tasks", JSON.stringify(tasks));
};


loadTasks();