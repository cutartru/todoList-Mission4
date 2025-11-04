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
        const now = new Date();
        currentDate.textContent = now.toLocaleDateString("id-ID", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        });
    }
    updateDate()});