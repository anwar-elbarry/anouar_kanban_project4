// Data
const tasks = [
    {
        id: 0,
        title: "amrabet",
        priority: "P3",
        status: "Todo",
        dueDate: "2024-04-12", 
        description: "this is the description"
    },
    {
        id: 1,
        title: "web",
        priority: "P2",
        status: "Todo",
        dueDate: "2024-12-24",
        description: "this is the description"
    },
    {
        id: 2,
        title: "loop",
        priority: "P1",
        status: "In progress",
        dueDate: "2020-03-03", 
        description: "this is the description"
    },
    {
        id: 3,
        title: "task brook",
        priority: "P3",
        status: "In progress",
        dueDate: "2024-03-13", 
        description: "this is the description"
    },
    {
        id: 4,
        title: "gym",
        priority: "P2",
        status: "In progress",
        dueDate: "2024-07-05",
        description: "this is the description"
    },
    {
        id: 5,
        title: "change icons",
        priority: "P2",
        status: "Done",
        dueDate: "2028-01-23",
        description: "this is the description this is the description this is the description this is the description this is the descriptionthis is the description"
    }
];


// Select DOM elements
const addTask = document.querySelector('#add_one');
const container = document.querySelector('.container');
const updateModal = document.querySelector('.task-modal');
const modal = document.querySelector('.modal');
const todoList = document.getElementById("todo_list");
const progressList = document.getElementById("in_progress_list");
const doneList = document.getElementById("done_list");
const todoCounter = document.getElementById("todo_counter");
const progressCounter = document.getElementById("progress_counter");
const doneCounter = document.getElementById("done_counter");

// Show modal (add task)
addTask.addEventListener('click', () => {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    container.classList.add('blur');
});

const cancel_add = document.getElementById('cancel_btn');
cancel_add.addEventListener('click', () => {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    container.classList.remove('blur');
});

// Function to create a new task item with status dropdown
function createTaskItem(task) {
    const newItem = document.createElement("li");
    newItem.classList.add("task-item", `priority-${task.priority}`);
    newItem.setAttribute("id", `task-${task.id}`);
    newItem.innerHTML = `
        <div class="flex justify-between"> <h4>${task.title}</h4> <i data-id="${task.id}" class="fa-solid fa-info" style="color: #0041b3;"></i> </div> 
        <p class="description hidden">${task.description}</p>
        <div class="app_footer">
            <p id="date">${task.dueDate}</p>
            <select class="status-dropdown">
                <option value="Todo" ${task.status === "Todo" ? "selected" : ""}>Todo</option>
                <option value="In progress" ${task.status === "In progress" ? "selected" : ""}>In progress</option>
                <option value="Done" ${task.status === "Done" ? "selected" : ""}>Done</option>
            </select>
            <span class="del_edi">
                <i class="fa-solid fa-trash" style="color: #000000;"></i>
                <i data-id="${task.id}" class="fa-solid fa-pen-to-square" style="color: #000000;"></i>
            </span>
        </div>
    `;
    addHoverEffect(newItem);
    addStatusChangeHandler(newItem, task); // Add status change handler
    return newItem;
}

// Function to add status change handler
function addStatusChangeHandler(listItem, task) {
    const statusDropdown = listItem.querySelector(".status-dropdown");
    statusDropdown.addEventListener("change", () => {
        task.status = statusDropdown.value;
        moveTaskToCorrectList(listItem, task);
        updateCounters(); // Update the counters after moving the task
    });
}

// Function to move task to the correct list based on status
function moveTaskToCorrectList(listItem, task) {
    // Remove task from current list
    listItem.remove();

    // Add task to the correct list based on its new status
    if (task.status === "Todo") {
        todoList.appendChild(listItem);
    } else if (task.status === "In progress") {
        progressList.appendChild(listItem);
    } else if (task.status === "Done") {
        doneList.appendChild(listItem);
    }
}



// Add hover effects
function addHoverEffect(listItem) {
    listItem.addEventListener('mouseover', () => {
        listItem.querySelector('.description').classList.remove('hidden');
    });
    listItem.addEventListener('mouseout', () => {
        listItem.querySelector('.description').classList.add('hidden');
    });
}

// Update counters
function updateCounters() {
    todoCounter.textContent = todoList.querySelectorAll('li').length;
    progressCounter.textContent = progressList.querySelectorAll('li').length;
    doneCounter.textContent = doneList.querySelectorAll('li').length;
}

// Add tasks to DOM initially
tasks.forEach(task => {
    const newItem = createTaskItem(task);
    if (task.status === "Todo") {
        todoList.appendChild(newItem);
    } else if (task.status === "In progress") {
        progressList.appendChild(newItem);
    } else if (task.status === "Done") {
        doneList.appendChild(newItem);
    }
});
updateCounters();

// Event delegation for delete functionality
container.addEventListener('click', function(event) {
    if (event.target.classList.contains('fa-trash')) {
        event.target.closest('li').remove();
        updateCounters();
        alert("Task deleted successfully!");
    }
});

// Add new task
document.getElementById("submit_btn").addEventListener("click", function(event) {
    event.preventDefault();
    
    const title = document.getElementById("title_add").value.trim();
    const description = document.getElementById("description").value.trim();
    const priority = document.getElementById("priority").value;
    const status = document.getElementById("status").value;
    const dueDate = document.getElementById("due_date").value.trim();

    if (!title || !description || !priority || !status || !dueDate) {
        alert("Please fill out all fields.");
        return;
    }

    const newTask = {
        id: tasks.length,
        title,
        priority,
        status,
        dueDate,
        description
    };
    tasks.push(newTask);

    const newItem = createTaskItem(newTask);
    if (status === "Todo") {
        todoList.appendChild(newItem);
    } else if (status === "In progress") {
        progressList.appendChild(newItem);
    } else if (status === "Done") {
        doneList.appendChild(newItem);
    }
    renderSortedTasks();
    updateCounters();
    alert("Task added successfully!");
    document.getElementById("modalForm").reset();
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    container.classList.remove('blur');
});

// Handle task edit
let itemId;
container.addEventListener('click', function(event) {
    if (event.target.classList.contains('fa-pen-to-square')) {
        updateModal.classList.remove('hidden');
        updateModal.classList.add('flex');
        container.classList.add('blur');
        
        itemId = parseInt(event.target.dataset.id, 10);
        const taskToEdit = tasks.find(task => task.id === itemId);
        
        if (taskToEdit) {
            document.getElementById("description_update").value = taskToEdit.description;
            document.getElementById("priority_update").value = taskToEdit.priority;
            document.getElementById("due_date_update").value = taskToEdit.dueDate;
        }
    }
});

// Update task
document.getElementById('submit_btn_update').addEventListener('click', function() {
    const description = document.getElementById("description_update").value.trim();
    const priority = document.getElementById("priority_update").value;
    const dueDate = document.getElementById("due_date_update").value.trim();

    if (!description || !priority || !dueDate) {
        alert('Please fill out all fields');
        return;
    }

    const taskToUpdate = tasks.find(task => task.id === itemId);
    if (taskToUpdate) {
        taskToUpdate.description = description;
        taskToUpdate.priority = priority;
        taskToUpdate.dueDate = dueDate;

        const updatedItem = createTaskItem(taskToUpdate);
        document.querySelector(`[data-id="${itemId}"]`).closest('li').replaceWith(updatedItem);
        renderSortedTasks();
        updateCounters();
    }

    updateModal.classList.add('hidden');
    updateModal.classList.remove('flex');
    container.classList.remove('blur');
    
});

// Hide update modal
document.getElementById('cancel_btn_update').addEventListener('click', () => {
    updateModal.classList.add('hidden');
    updateModal.classList.remove('flex');
    container.classList.remove('blur');
});


// task information
const infoModal = document.querySelector('.information_modal');
const titleInfo = document.getElementById('title_info');
const descriptionInfo = document.getElementById('description_info');
const dateInfo = document.getElementById('date_info');
const statusInfo = document.getElementById('status_info');
const taskInfo = document.querySelector('.info_task')
container.addEventListener('click' , function(event) {
    if(event.target.classList.contains('fa-info')){
       infoModal.classList.remove('hidden');
       infoModal.classList.add('flex');
       container.classList.add('blur');

       itemId = parseInt(event.target.dataset.id, 10);
        const taskToShow = tasks.find(task => task.id === itemId);
      
        if(taskToShow){
            titleInfo.textContent = taskToShow.title;
            descriptionInfo.textContent = taskToShow.description;
            dateInfo.textContent = taskToShow.dueDate;
            statusInfo.textContent = taskToShow.status;

           
        }
        if(taskToShow.priority === "P1"){
            taskInfo.classList.add('p1_info')
          }
          else if(taskToShow.priority === "P2"){
            taskInfo.classList.add('p2_info')
          }
          else{
            taskInfo.classList.add('p3_info')
          }


    }
});
const xMark = document.querySelector('.fa-xmark');
xMark.addEventListener('click', () => {
    infoModal.classList.add('hidden');
       infoModal.classList.remove('flex');
       container.classList.remove('blur');

       taskInfo.classList.remove('p1_info', 'p2_info', 'p3_info');
});
// Minor improvements and organization for clarity and performance

// Sort tasks by priority and due date (ascending)
function sortTasks() {
    tasks.sort((a, b) => {
        if (a.priority !== b.priority) {
            return a.priority.localeCompare(b.priority);
        }
        const dateA = new Date(a.dueDate);
        const dateB = new Date(b.dueDate);
        return dateA - dateB;
    });
}

// Render tasks in sorted order
function renderSortedTasks() {
    // Clear all task lists
    todoList.innerHTML = '';
    progressList.innerHTML = '';
    doneList.innerHTML = '';

    // Sort and append tasks in the correct order
    sortTasks();
    tasks.forEach(task => {
        const newItem = createTaskItem(task);
        if (task.status === "Todo") {
            todoList.appendChild(newItem);
        } else if (task.status === "In progress") {
            progressList.appendChild(newItem);
        } else if (task.status === "Done") {
            doneList.appendChild(newItem);
        }
    });

    updateCounters(); // Update counters after sorting
}

// Initialize by rendering sorted tasks
renderSortedTasks();


