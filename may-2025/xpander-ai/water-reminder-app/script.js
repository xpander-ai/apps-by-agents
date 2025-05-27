// script.js - Handles water intake tracking, reminder scheduling, notifications, and state persistence
document.addEventListener('DOMContentLoaded', () => {
  const intakeDisplay = document.getElementById('intake-display');
  const addWaterButton = document.getElementById('add-water-button');
  const reminderForm = document.getElementById('reminder-form');
  const intervalInput = document.getElementById('interval');
  const remindersLog = document.getElementById('reminders-log');

  let waterIntake = parseInt(localStorage.getItem('waterIntake')) || 0;
  let reminderInterval = parseInt(localStorage.getItem('reminderInterval')) || null;
  let reminders = JSON.parse(localStorage.getItem('reminders')) || [];

  function updateIntakeDisplay() {
    intakeDisplay.textContent = `${waterIntake} ml`;
  }

  function updateRemindersLog() {
    remindersLog.innerHTML = '';
    reminders.forEach(entry => {
      const li = document.createElement('li');
      li.textContent = entry;
      remindersLog.appendChild(li);
    });
  }

  function showNotification() {
    if (Notification.permission === 'granted') {
      new Notification('Time to drink water! 💧');
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          new Notification('Time to drink water! 💧');
        }
      });
    }
  }

  function logReminder() {
    const timestamp = new Date().toLocaleTimeString();
    const entry = `Reminder at ${timestamp}`;
    reminders.unshift(entry);
    localStorage.setItem('reminders', JSON.stringify(reminders));
    updateRemindersLog();
  }

  let reminderTimer = null;
  function scheduleReminders() {
    if (reminderInterval) {
      if (reminderTimer) clearInterval(reminderTimer);
      reminderTimer = setInterval(() => {
        showNotification();
        logReminder();
      }, reminderInterval * 60 * 1000);
    }
  }

  addWaterButton.addEventListener('click', () => {
    waterIntake += 250;
    localStorage.setItem('waterIntake', waterIntake);
    updateIntakeDisplay();
  });

  reminderForm.addEventListener('submit', event => {
    event.preventDefault();
    const interval = parseInt(intervalInput.value);
    if (interval > 0) {
      reminderInterval = interval;
      localStorage.setItem('reminderInterval', reminderInterval);
      scheduleReminders();
    }
  });

  updateIntakeDisplay();
  updateRemindersLog();
  if (reminderInterval) {
    intervalInput.value = reminderInterval;
    scheduleReminders();
  }
});