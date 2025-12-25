 const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const searchInput = document.getElementById("searchInput");
const progressText = document.getElementById("progressText");
const progressFill = document.getElementById("progressFill");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

async function loadQuote() {
  try {
    const response = await fetch("https://api.quotable.io/random");
    const data = await response.json();

    document.getElementById("quote").textContent =
      `"${data.content}" — ${data.author}`;
  } catch (error) {
    document.getElementById("quote").textContent =
      "Stay focused and keep going 💪";
  
    console.error("Quote API error:", error);
  }
}

// Call the function
loadQuote();


// Render
function renderTasks(filter = "") {
  taskList.innerHTML = "";

  tasks
    .filter(t => t.text.toLowerCase().includes(filter.toLowerCase()))
    .forEach((task, index) => {
      const li = document.createElement("li");
      if (task.completed) li.classList.add("completed");

      const left = document.createElement("div");
      left.className = "task-left";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = task.completed;
      checkbox.onchange = () => {
        task.completed = checkbox.checked;
        saveTasks();
      };

      const span = document.createElement("span");
      span.textContent = task.text;

      left.appendChild(checkbox);
      left.appendChild(span);

      const editBtn = document.createElement("button");
      editBtn.textContent = "Edit";
      editBtn.className = "edit-btn";
      editBtn.onclick = () => {
        const newText = prompt("Edit task", task.text);
        if (newText) {
          task.text = newText;
          saveTasks();
        }
      };

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "X";
      deleteBtn.className = "delete-btn";
      deleteBtn.onclick = () => {
        tasks.splice(index, 1);
        saveTasks();
      };

      li.append(left, editBtn, deleteBtn);
      taskList.appendChild(li);
    });

  updateProgress();
}

// Progress
function updateProgress() {
  const completed = tasks.filter(t => t.completed).length;
  const total = tasks.length;
  progressText.textContent = `${completed} / ${total} Completed`;
  progressFill.style.width = total ? (completed / total) * 100 + "%" : "0%";
}

// Save
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks(searchInput.value);
}

// Add
addBtn.onclick = () => {
  if (!taskInput.value.trim()) return;
  tasks.push({ text: taskInput.value, completed: false });
  taskInput.value = "";
  saveTasks();
};

// Search
searchInput.oninput = () => {
  renderTasks(searchInput.value);
};

renderTasks();
