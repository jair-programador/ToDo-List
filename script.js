function addTask() {
    const taskInput = document.getElementById('task-input');
    const deadlineInput = document.getElementById('deadline-input');
    const categoryInput = document.getElementById('category-input');
    const priorityInput = document.getElementById('priority-input');
    const taskList = document.getElementById('task-list');

    if (taskInput.value.trim() !== '') {
        const li = document.createElement('li');
        li.classList.add(`prioridade-${priorityInput.value}`);  // Aplica o estilo da prioridade
        li.innerHTML = `${taskInput.value} - <small>Prazo: ${deadlineInput.value}</small> 
                         <strong>[${categoryInput.value}]</strong> 
                         <em>Prioridade: ${priorityInput.value}</em> 
                         <button onclick="removeTask(this)">Excluir</button>`;
        taskList.appendChild(li);
        taskInput.value = '';
        deadlineInput.value = '';
        categoryInput.selectedIndex = 0;
        priorityInput.selectedIndex = 0;
    }
}

// Função para alternar o estado da tarefa (concluída ou não)
function toggleTask(element) {
    element.classList.toggle("completed");

    // Atualizar o status da tarefa no localStorage
    updateTaskStatus(element.textContent, element.classList.contains("completed"));
}

// Função para editar uma tarefa
function editTask(button) {
    const li = button.parentElement;
    const span = li.querySelector("span");
    const originalText = span.textContent;

    // Criar um campo de input para editar
    const input = document.createElement("input");
    input.type = "text";
    input.value = originalText;
    li.insertBefore(input, span);
    li.removeChild(span); // Remover o texto original

    // Alterar o botão de editar para salvar
    button.textContent = "Salvar";
    button.setAttribute("onclick", "saveEditedTask(this)");

    // Atualizar o botão para "Cancelar" (opcional)
    const cancelButton = document.createElement("button");
    cancelButton.textContent = "Cancelar";
    cancelButton.setAttribute("onclick", "cancelEdit(this)");
    li.appendChild(cancelButton);
}

// Função para salvar a tarefa editada
function saveEditedTask(button) {
    const li = button.parentElement;
    const input = li.querySelector("input");
    const newText = input.value.trim();

    if (newText === "") {
        alert("A tarefa não pode estar vazia!");
        return;
    }

    const span = document.createElement("span");
    span.textContent = newText;
    span.onclick = () => toggleTask(span);

    li.insertBefore(span, input); // Substitui o campo de input pelo novo texto
    li.removeChild(input); // Remove o campo de input

    button.textContent = "Editar";
    button.setAttribute("onclick", "editTask(this)");

    // Atualiza o botão de cancelamento
    const cancelButton = li.querySelector("button[onclick='cancelEdit(this)']");
    li.removeChild(cancelButton);

    // Salvar as alterações no localStorage
    updateTaskText(originalText, newText);
}

// Função para cancelar a edição de uma tarefa
function cancelEdit(button) {
    const li = button.parentElement;
    const input = li.querySelector("input");
    const originalText = input.value.trim();

    // Voltar ao texto original
    const span = document.createElement("span");
    span.textContent = originalText;
    span.onclick = () => toggleTask(span);
    
    li.insertBefore(span, input);
    li.removeChild(input);

    // Alterar o botão de editar de volta
    const editButton = li.querySelector("button[onclick='saveEditedTask(this)']");
    editButton.textContent = "Editar";
    editButton.setAttribute("onclick", "editTask(this)");

    // Remover o botão de cancelar
    li.removeChild(button);
}

// Função para excluir uma tarefa
function deleteTask(button) {
    const li = button.parentElement;
    li.remove();

    // Excluir a tarefa do localStorage
    removeTask(li.textContent.trim());
}

// Função para salvar tarefa no localStorage
function saveTask(text, completed) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push({ text, completed });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Função para atualizar o texto da tarefa no localStorage
function updateTaskText(oldText, newText) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const task = tasks.find(t => t.text === oldText);
    if (task) {
        task.text = newText;
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
}

// Função para remover uma tarefa do localStorage
function removeTask(text) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.filter(t => t.text !== text);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Função para carregar as tarefas salvas no localStorage
function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => {
        const taskList = document.getElementById("task-list");
        const li = document.createElement("li");
        li.innerHTML = `
            <span onclick="toggleTask(this)" class="${task.completed ? 'completed' : ''}">${task.text}</span>
            <button onclick="editTask(this)">Editar</button>
            <button onclick="deleteTask(this)">Excluir</button>
        `;
        taskList.appendChild(li);
    });
}

// Carregar as tarefas ao abrir a página
document.addEventListener('DOMContentLoaded', loadTasks);

// Ao carregar a página, verifique o tema salvo
window.onload = function() {
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
        document.body.classList.remove('light-mode');
    } else {
        document.body.classList.add('light-mode');
        document.body.classList.remove('dark-mode');
    }
};

// Função para alternar entre os temas e salvar a preferência
document.getElementById('toggle-theme').addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    document.body.classList.toggle('light-mode');

    // Salva a preferência do tema no localStorage
    if (document.body.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark');
    } else {
        localStorage.setItem('theme', 'light');
    }
});

// Função para filtrar tarefas com base na pesquisa
function filterTasks() {
    const searchQuery = document.getElementById('search').value.toLowerCase();
    const tasks = document.querySelectorAll('#task-list li');
    tasks.forEach(task => {
        const taskText = task.textContent.toLowerCase();
        if (taskText.includes(searchQuery)) {
            task.style.display = '';
        } else {
            task.style.display = 'none';
        }
    });
}
