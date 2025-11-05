const usernameInput = document.getElementById('name-input');
const positionInput = document.getElementById('position-input');
const userInfoForm = document.getElementById('profile-form');
const userDisplayMode = document.getElementById('profile-display-mode'); 
const currentUserDisplay = document.getElementById('current-profile-display');
const editUserBtn = document.getElementById('edit-btn');
const saveUserBtn = document.getElementById('save-btn');
const cancelUserBtn = document.getElementById('cancel-btn');
const typeText = document.getElementById('type-text');
const inputPriority = document.getElementById('priority');
const headAlert = document.getElementById('head-alert');
const containerTaskBox = document.getElementById('container-todo');
const completedBox = document.getElementById('completed-box');
const btnResetAllTasks = document.getElementById('reset-btn');
const currentDate = document.getElementById("live-time");



function updateDate() {
    const date = new Date();
    const optionsWeekday = { weekday: 'long' };
    const dayName = new Intl.DateTimeFormat('id-ID', optionsWeekday).format(date);
    let hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    hours = String(hours).padStart(2, '0');
    // currentDate.textContent = ` ${dayName}, ${hours}:${minutes} ${ampm}`;
    currentDate.textContent = date.toLocaleDateString("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hours
    });
}
    


let todolist = [];
let verifiedId = {
    userId: null,
    positionId: null 
};

let intervalId;

function getFormattedDate(dateObj = new Date()) {
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const day = dateObj.getDate().toString().padStart(2, '0');
    const year = dateObj.getFullYear();
    return `${month}/${day}/${year}`;

}

function getFormattedTime() {
    const date = new Date();
  
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
  
    hours = hours % 12;
    hours = hours ? hours : 12;
    hours = String(hours).padStart(2, '0');
  
    return `${hours}:${minutes} ${ampm}`;

}

function saveTodoList() {
    try {
        localStorage.setItem('todolist', JSON.stringify(todolist));
        console.log('TodoList saved to localStorage:', todolist);
    } catch (e) {
        console.error("Error saving todolist to localStorage:", e);
        showAlert("Failed to save tasks.", "error");
    }
}

function loadTodoList() {
    try {
        const savedTodoList = localStorage.getItem('todolist');
        if (savedTodoList) {
            todolist = JSON.parse(savedTodoList);
            console.log('TodoList loaded from localStorage:', todolist);
        } else {
            todolist = [];
            console.log('TodoList Not Found!');
        }
    } catch (e) {
        console.error("Error loading todolist:", e);
        todolist = [];
        showAlert("Failed to load tasks!", "error");
    }
    renderTodoList();
}

function saveVerifiedId() {
    try {
        localStorage.setItem('verifiedId', JSON.stringify(verifiedId));
        console.log('Username & position saved:', verifiedId);
        updateUserDisplay();
    } catch (e) {
        console.error("Error saving your username & position:", e);
        showAlert("Failed to save user info!", "error");
    }
}

function loadVerifiedId() {
    try {
        const savedVerifiedId = localStorage.getItem('verifiedId');
        if (savedVerifiedId) {
            verifiedId = JSON.parse(savedVerifiedId);
            console.log('User Verified:', verifiedId);
        } else {
            verifiedId = { userId: null, positionId: null };
            console.log('No verifiedId found!');
        }
    } catch (e) {
        console.error("Error loading your username & position:", e);
        verifiedId = { userId: null, positionId: null };
        showAlert("Failed to load user info!", "error");
    }
    updateUserDisplay();
}

function showAlert(message, type = "info") {
    headAlert.textContent = message;
    headAlert.className = 'alert-message';
    if (type === "error") {
        headAlert.style.backgroundColor = '#dc3535ff'; 
    } else if (type === "success") {
        headAlert.style.backgroundColor = '#28a745'; 
    } else {
        headAlert.classList.add('info');
        headAlert.style.backgroundColor = '#f1c40f'; 
    }
    headAlert.style.display = 'block';
    setTimeout(() => {
        headAlert.style.display = 'none';
        headAlert.textContent = '';
        headAlert.style.backgroundColor = '';
    }, 3000);
}

function updateUserDisplay() {
    if (verifiedId.userId && verifiedId.positionId) {
        currentUserDisplay.innerHTML = `<em>${verifiedId.userId} - <em>${verifiedId.positionId}</em>`;
        // Switch display mode
        userDisplayMode.style.display = 'flex';
        userInfoForm.style.display = 'none';
    } else {
        // Switch edit mode
        userDisplayMode.style.display = 'none';
        userInfoForm.style.display = 'flex';
    }
}

function switchToEditMode() {
    usernameInput.value = verifiedId.userId || '';
    positionInput.value = verifiedId.positionId || '';
    userDisplayMode.style.display = 'none';
    userInfoForm.style.display = 'flex';
}
function switchToDisplayMode() {
    userDisplayMode.style.display = 'flex';
    userInfoForm.style.display = 'none';
    updateUserDisplay();
}

function handleUserInfoForm(e) {
    e.preventDefault();
    const username = usernameInput.value.trim();
    const position = positionInput.value.trim();

    if (username && position) {
        verifiedId.userId = username;
        verifiedId.positionId = position;
        saveVerifiedId();
        showAlert("User Verified!", "success");
        switchToDisplayMode();
    } else {
        showAlert("Please fill your username and position!", "error");
    }
}

function handleTodoForm(e) {
    e.preventDefault();

    let inputTextType = typeText.value.trim();
    let selectPriority = inputPriority.value.trim();

    if  (inputTextType === '' || selectPriority === '') {
        showAlert("Please add your task & select priority level!", "error");
        return;
        console.log(username)
    }
    
    if  (inputTextType === '' || selectPriority === '' || verifiedId.userId === null || verifiedId.positionId === null) {
        showAlert("Please verified your ID!", "error");
        return;
    }
    
    const newTask = {
        id: Date.now(),
        task: inputTextType,
        priority: selectPriority,
        status: 'Ongoing',
        date: getFormattedDate(),
        time: getFormattedTime(),
        userId: verifiedId.userId,
        positionId: verifiedId.positionId
    };

    todolist.push(newTask);
    saveTodoList();
    renderTodoList();

    typeText.value = '';
    inputPriority.value = '';
}


function renderTodoList() {
    console.log('Rendering data...');
    
    containerTaskBox.innerHTML = '';
    completedBox.innerHTML = '<h3 id="completed-box-heading">Completed Task</h3>';
    const completedBoxHeading = document.getElementById('completed-box-heading');

    let hasCompletedTasks = false;

    const filteredAndSortedTasks = todolist

        .sort((a, b) => {
            // sort status: ongoing -> done
            if (a.status === 'Ongoing' && b.status === 'Done') return 2;
            if (a.status === 'Done' && b.status === 'Ongoing') return 1;

            const dateA_iso = a.date.split('/').reverse().join('-') + `T${a.time}`;
            const dateB_iso = b.date.split('/').reverse().join('-') + `T${b.time}`;
            
            const dateA = new Date(dateA_iso);
            const dateB = new Date(dateB_iso);
            
            if (dateA < dateB) return 1;
            if (dateA > dateB) return 2;

            const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
            return priorityOrder[b.priority] - priorityOrder[a.priority];
        });

    filteredAndSortedTasks.forEach((task) => {
        let sectionContainer = document.createElement('section');
        sectionContainer.classList.add('container-task-done');
        sectionContainer.dataset.id = task.id;

        let ulContainer = document.createElement('ul');
        ulContainer.classList.add('todo-container');
        sectionContainer.appendChild(ulContainer);

        let liContainer = document.createElement('li');
        liContainer.classList.add('todo-time');
        ulContainer.appendChild(liContainer);

        let divContainer = document.createElement('div');
        divContainer.classList.add('todo-time-box');
        liContainer.appendChild(divContainer);

        // SVG Uncheck
        let uncheckSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        uncheckSvg.innerHTML = '<path d="M266.13,512h-20c-1.59-.32-3.16-.78-4.77-.94-4.47-.43-9-.67-13.43-1.11a240.15,240.15,0,0,1-52.06-11.27A257.23,257.23,0,0,1,26.57,368.44,248,248,0,0,1,1,271.64a49.7,49.7,0,0,0-1-5.77v-20a29.87,29.87,0,0,0,.93-4.78A215.7,215.7,0,0,1,4,213.32a242.44,242.44,0,0,1,22.33-69.61Q57.93,80,117.57,41.12C158.12,14.8,202.7,1.49,250.9.09a251.3,251.3,0,0,1,47.73,3.65,244.74,244.74,0,0,1,69.61,22.34q63.7,31.56,102.61,91.19c26.32,40.54,39.59,85.13,41.07,133.32A248.69,248.69,0,0,1,510.24,284,245.23,245.23,0,0,1,499,336.07,257.12,257.12,0,0,1,370.06,484.73,248.52,248.52,0,0,1,271.91,511,50.23,50.23,0,0,0,266.13,512ZM482.47,256.36C483.09,131.87,381.23,29.92,257,29.45,132.31,29,30.12,130.7,29.71,255.11c-.4,124.67,101.35,226.83,225.79,227.17C380.15,482.61,482.56,380.83,482.47,256.36Z">';
        uncheckSvg.classList.add("uncheckbox-svg");
        uncheckSvg.setAttribute ("viewBox", "0 0 512 512");
        uncheckSvg.setAttribute ("xmlns", "http://www.w3.org/2000/svg");
        divContainer.appendChild(uncheckSvg);

        // SVG Checked
        let checkedSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        checkedSvg.innerHTML = '<path d="M512,241v30l-1.23,10.79c-6.12,55.09-27.16,103.68-64.29,144.89C407.06,470.42,358.21,497.73,300.1,508c-9.64,1.7-19.4,2.67-29.1,4H241a27.65,27.65,0,0,0-3.86-.82c-40-2.83-77.51-14.28-111.69-35.23C59.13,435.3,18.31,376.71,4,300c-1.8-9.59-2.68-19.35-4-29V241c.41-3.6.83-7.19,1.23-10.79C7.35,175.12,28.39,126.52,65.52,85.32,104.94,41.58,153.79,14.27,211.9,4c9.64-1.7,19.4-2.67,29.1-4h30a27.65,27.65,0,0,0,3.86.82c40.05,2.83,77.51,14.28,111.69,35.23C452.87,76.7,493.69,135.29,508,212,509.81,221.55,510.69,231.31,512,241ZM216.87,298.91c-10.17-9.3-19.47-17.84-28.81-26.35-14.17-12.89-28-26.15-42.65-38.51-11.36-9.61-29.08-5.94-36.47,6.58-6.51,11-4,24.17,6.52,33.77q41.19,37.56,82.41,75.07,20.38,18.58,40-.86L395.73,191.9c1.66-1.65,3.32-3.3,4.81-5.08a25.55,25.55,0,0,0-7.25-39c-11-6.17-22.58-3.95-32.94,6.41q-70,70-140,140A42.55,42.55,0,0,0,216.87,298.91Z">';
        checkedSvg.classList.add("checkbox-svg");
        checkedSvg.setAttribute ("viewBox", "0 0 512 512");
        checkedSvg.setAttribute ("xmlns", "http://www.w3.org/2000/svg");
        checkedSvg.style.display = 'none';
        divContainer.appendChild(checkedSvg);

        let newTaskTextElement = document.createElement('p');
        newTaskTextElement.classList.add('todo-text');
        divContainer.appendChild(newTaskTextElement);

        // Trash SVG
        let trashSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        trashSvg.innerHTML = '<path d="M449.12,85.93c-3.16-.06-6.32-.07-9.47-.07H381.88a27.05,27.05,0,0,1-1.21-3.21A106.07,106.07,0,0,0,301.45,3.22c-4.51-1-9.16-1.46-13.74-2.23A38.36,38.36,0,0,1,284,0H228.07a23.13,23.13,0,0,1-3.76,1,103.1,103.1,0,0,0-57.85,24.39,104.23,104.23,0,0,0-35.31,58.25,11.62,11.62,0,0,1-.85,1.85c-1.7.12-3.63.36-5.55.37-19.63,0-39.25,0-58.87,0-5.12,0-9.88.83-14.06,4.06-6.88,5.32-9.46,12.48-8,20.76s6.58,13.73,14.66,16.06a33.41,33.41,0,0,0,8.36,1c6.13.14,12.27,0,18.63,0a34.27,34.27,0,0,1,.65,3.61c.1,1.49,0,3,0,4.5q0,133.19,0,266.39c0,14.14,1.6,27.93,6.94,41.06,14.48,35.62,40.69,57.54,78,66.24,3.37.78,6.9.9,10.35,1.42a31.05,31.05,0,0,1,3.72,1H326.88a21.59,21.59,0,0,1,3.72-1,102.29,102.29,0,0,0,58.16-24.87c19-16.29,30.71-36.9,35.5-61.47,1.47-7.56,1.57-15.22,1.57-22.88V128.23c1.8-.19,3.07-.43,4.34-.44,5.82,0,11.64.12,17.45-.06,9.72-.29,17.42-6.14,20.05-15.16C471.58,99.2,461.77,86.2,449.12,85.93ZM178,76.75c10.21-18.8,26-29.82,46.92-33.66a72.46,72.46,0,0,1,12.42-.9c12.47-.11,24.95-.09,37.42,0,19.35.1,36.13,6.46,49.58,20.75a63.69,63.69,0,0,1,12.29,19.26,28,28,0,0,1,.86,2.92,8.51,8.51,0,0,1-2.1.67q-79.34,0-158.68,0a10.34,10.34,0,0,1-2.4-.75C175.56,82.1,176.57,79.32,178,76.75ZM374.29,439.31c-10.4,16.34-25.26,26.14-44.24,29.57a73.19,73.19,0,0,1-12.91.93q-61.11.1-122.22,0c-17.46,0-33-5.13-46-17.16-13.35-12.37-20.72-27.64-20.79-45.92-.19-43.82-.07-87.64-.07-131.45V128H383.45a25.19,25.19,0,0,1,.51,3.38c.07,3.33,0,6.66,0,10q0,131.46,0,262.91C384,416.91,381.09,428.63,374.29,439.31Z"/><path d="M234.2,298.5V239c0-1.83-.08-3.67,0-5.5.14-7.91-5.79-16.11-13.58-18.51-8.21-2.52-15.77-1.33-22.07,5-4.65,4.66-6.17,10.42-6.16,16.85q.07,61.72,0,123.46c0,1.16,0,2.33.06,3.49a21.31,21.31,0,0,0,14.76,18.89,21,21,0,0,0,22.46-6.81c3.58-4.35,4.61-9.4,4.59-14.92C234.15,340.15,234.2,319.33,234.2,298.5Z"/><path d="M318.44,228.17c-2.28-7.58-10.14-15.92-23.51-14.09-9,1.24-17,10-17,18.81,0,1.83-.08,3.66-.08,5.49q0,30,0,60,0,30.48,0,61a58.4,58.4,0,0,0,.22,6.49c1.23,11.14,12.45,19.57,23.72,17.57,11.08-2,17.85-10.28,17.86-21.91q.09-62.73,0-125.45A27.5,27.5,0,0,0,318.44,228.17Z">';
        trashSvg.classList.add("trash");
        trashSvg.setAttribute ("viewBox", "0 0 512 512");
        trashSvg.setAttribute ("xmlns", "http://www.w3.org/2000/svg");
        divContainer.appendChild(trashSvg);

        let divTaskWrapper = document.createElement('div');
        divTaskWrapper.classList.add('task-wrapper');
        ulContainer.appendChild(divTaskWrapper);

        let divWrapperLeft = document.createElement('div');
        divWrapperLeft.classList.add('wrapper-left');
        divTaskWrapper.appendChild(divWrapperLeft);

        let spanSetAlert = document.createElement('span');
        spanSetAlert.classList.add('set-alert');
        divWrapperLeft.appendChild(spanSetAlert);

        let statusElement = document.createElement('h5');
        statusElement.classList.add('task-status');
        divWrapperLeft.appendChild(statusElement);

        let spanPriority = document.createElement('span');
        spanPriority.classList.add('priority-level');
        divWrapperLeft.appendChild(spanPriority);

        let priorityElement = document.createElement('p');
        priorityElement.classList.add(`priority-${task.priority.toLowerCase()}`);
        spanPriority.appendChild(priorityElement);

        let divWrapperRight = document.createElement('div');
        divWrapperRight.classList.add('wrapper-right');
        divTaskWrapper.appendChild(divWrapperRight);

        let divTimestamp = document.createElement('div');
        divTimestamp.classList.add('timestamp');
        divWrapperRight.appendChild(divTimestamp);

        let submitDateElement = document.createElement('p');
        divTimestamp.appendChild(submitDateElement);
        let submitTimeElement = document.createElement('p');
        divTimestamp.appendChild(submitTimeElement);

        //isi content element
        newTaskTextElement.innerHTML = task.task;
        priorityElement.innerHTML = task.priority;
        statusElement.innerHTML = task.status;
        submitDateElement.innerHTML = task.date;
        submitTimeElement.innerHTML = task.time;

        // style status
        if (task.status === 'Done') {
            ulContainer.classList.add('completed');
            uncheckSvg.style.display = 'none';
            checkedSvg.style.display = 'flex';
            statusElement.style.backgroundColor = '#28a745';
            submitDateElement.style.color = '#b1c1d6';
            submitTimeElement.style.color = '#b1c1d6';
            trashSvg.style.fill = '#b1c1d6';
            completedBox.appendChild(sectionContainer);
            hasCompletedTasks = true;
        } else {
            ulContainer.classList.remove('completed');
            uncheckSvg.style.display = 'flex';
            checkedSvg.style.display = 'none';
            containerTaskBox.appendChild(sectionContainer);
        }

        // function saat icon uncheck di klik
        uncheckSvg.addEventListener('click', function(e) {
            const taskId = parseInt(e.target.closest('.container-task-done').dataset.id);
            const taskToUpdate = todolist.find(t => t.id === taskId);

            if (taskToUpdate) {
                taskToUpdate.status = 'Done';
                taskToUpdate.date = getFormattedDate();
                taskToUpdate.time = getFormattedTime();
                saveTodoList();
                renderTodoList();
                showAlert(`Task has been completed!`, "success");
            }
        });

        trashSvg.addEventListener('click', function(e) {
            const taskId = parseInt(e.target.closest('.container-task-done').dataset.id);
            todolist = todolist.filter(task => task.id !== taskId);
            saveTodoList();
            renderTodoList();
            showAlert("Task deleted successfully!", "success");
        });
    });

    if (hasCompletedTasks) {
        completedBoxHeading.style.display = 'block';
    } else {
        completedBoxHeading.style.display = 'none';
    }
}

function resetAllTasks() {
    if (confirm("Reset all tasks from your local storage?")) {
        todolist = [];
        saveTodoList();
        renderTodoList();
        showAlert("All tasks have been reset!", "success");
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // updateLiveTime();
    updateDate();
    intervalId = setInterval(updateDate, 1000); // 1detik?

    loadVerifiedId();
    loadTodoList();


    if (userInfoForm) {
        userInfoForm.addEventListener('submit', handleUserInfoForm);
    }
    if (editUserBtn) {
        editUserBtn.addEventListener('click', switchToEditMode);
    }
    if (cancelUserBtn) {
        cancelUserBtn.addEventListener('click', switchToDisplayMode);
    }

    // submit form
    const todoForm = document.getElementById('todo-form');
    if (todoForm) {
        todoForm.addEventListener('submit', handleTodoForm);
    }
    if (btnResetAllTasks) {
        btnResetAllTasks.addEventListener('click', resetAllTasks);
    }

});


window.addEventListener('beforeunload', () => {
    if (intervalId) {
        clearInterval(intervalId);
    }
});

window.addEventListener("load", function() {
    const form = document.getElementById('profile-form');
    form.addEventListener("submit", function(e) {
      e.preventDefault();
      const data = new FormData(form);
      const action = e.target.action;
      fetch(action, {
        method: 'POST',
        body: data,
      })
      .then(() => {
        console.log("Form submitted successfully!");
      })
    });
});
