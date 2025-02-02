function addTask() {
    const taskInput = document.getElementById("new-task");
    const taskText = taskInput.value.trim();

    if (taskText === "") {
        alert("Por favor, digite uma tarefa!");
        return;
    }

    const taskList = document.getElementById("task-list");
    const li = document.createElement("li");

    li.innerHTML = `
        <span onclick="toggleTask(this)">${taskText}</span>
        <button onclick="deleteTask(this)">Excluir</button>
    `;

    taskList.appendChild(li);
    taskInput.value = ""; // Limpar o campo de texto
}

function toggleTask(element) {
    element.classList.toggle("completed");
}

function deleteTask(button) {
    const li = button.parentElement;
    li.remove();
}