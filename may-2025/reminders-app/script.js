const { createApp } = Vue;

createApp({
  data() {
    return {
      lists: JSON.parse(localStorage.getItem('lists') || '[]'),
      selectedListId: null,
      newListTitle: '',
      newReminder: { title: '', due: '' },
    };
  },
  computed: {
    selectedList() {
      return this.lists.find((l) => l.id === this.selectedListId);
    },
  },
  methods: {
    saveLists() {
      localStorage.setItem('lists', JSON.stringify(this.lists));
    },
    addList() {
      const title = this.newListTitle.trim();
      if (title) {
        const id = Date.now();
        this.lists.push({ id, title, reminders: [] });
        this.newListTitle = '';
        this.selectList(id);
        this.saveLists();
      }
    },
    selectList(id) {
      this.selectedListId = id;
    },
    deleteList(id) {
      this.lists = this.lists.filter((l) => l.id !== id);
      if (this.selectedListId === id) {
        this.selectedListId = this.lists.length ? this.lists[0].id : null;
      }
      this.saveLists();
    },
    addReminder() {
      if (!this.selectedList) return;
      const title = this.newReminder.title.trim();
      const due = this.newReminder.due;
      if (title && due) {
        const id = Date.now();
        this.selectedList.reminders.push({ id, title, due, completed: false });
        this.newReminder = { title: '', due: '' };
        this.saveLists();
        this.scheduleNotification(id, title, due);
      }
    },
    editReminder(rem) {
      const newTitle = prompt('Edit reminder title', rem.title);
      const newDue = prompt('Edit reminder due date/time', rem.due);
      if (newTitle !== null && newDue !== null) {
        rem.title = newTitle.trim();
        rem.due = newDue;
        this.saveLists();
      }
    },
    deleteReminder(id) {
      if (!this.selectedList) return;
      this.selectedList.reminders = this.selectedList.reminders.filter((r) => r.id !== id);
      this.saveLists();
    },
    formatDate(datetime) {
      const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
      return new Date(datetime).toLocaleString(undefined, options);
    },
    requestPermission() {
      if ('Notification' in window) {
        Notification.requestPermission();
      }
    },
    scheduleNotification(id, title, due) {
      if (Notification.permission !== 'granted') return;
      const delay = new Date(due) - new Date();
      if (delay > 0) {
        setTimeout(() => {
          new Notification('Reminder', { body: title });
        }, delay);
      }
    },
    scheduleAll() {
      if (Notification.permission !== 'granted') return;
      this.lists.forEach((list) => {
        list.reminders.forEach((rem) => {
          if (!rem.completed) {
            this.scheduleNotification(rem.id, rem.title, rem.due);
          }
        });
      });
    },
  },
  mounted() {
    this.scheduleAll();
  },
}).mount('#app');