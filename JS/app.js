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


document.addEventListener("DOMContentLoaded", () => {
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
    updateDate()});

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
        headAlert.style.backgroundColor = '#8b35dcff'; // Red
    } else if (type === "success") {
        headAlert.style.backgroundColor = '#28a745'; // Green
    } else {
        headAlert.classList.add('info');
        headAlert.style.backgroundColor = '#f1c40f'; // Yellow
    }
    headAlert.style.display = 'block';
    setTimeout(() => {
        headAlert.style.display = 'none';
        headAlert.textContent = '';
        headAlert.style.backgroundColor = '';
    }, 3000);
}

