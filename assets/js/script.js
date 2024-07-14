document.addEventListener('DOMContentLoaded', () => {
   const addTaskBtn = document.querySelector('#add-task-btn');
   const taskInput = document.querySelector('#new-task');
   const taskList = document.querySelector('#task-list');
   const clearTasksBtn = document.querySelector('#clear-tasks-btn');
   const modalInput = document.querySelector('#taskInput');
   const closeBtn = document.querySelector('.popup__close');
   const cancelBtn = document.querySelector('.cancel-btn');
   const popup = document.querySelector('.popup');
   const overlay = document.querySelector('.overlay');
   const form = popup.querySelector('form');

   let currentTaskSpan = null;

   const saveTasksToLocalStorage = () => {
      const tasks = Array.from(taskList.querySelectorAll('li')).map((li) => li.querySelector('span').textContent);
      localStorage.setItem('tasks', JSON.stringify(tasks));
   };

   const loadTasksFromLocalStorage = () => {
      const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
      tasks.forEach((taskText) => addTaskToList(taskText));
   };

   const addTaskToList = (taskText) => {
      const listItem = document.createElement('li');

      const taskSpan = document.createElement('span');
      taskSpan.textContent = taskText;

      const nameBtn = document.createElement('img');
      nameBtn.src = 'assets/icons/description.png';
      nameBtn.alt = 'description';
      nameBtn.classList.add('description-btn');

      const deleteBtn = document.createElement('img');
      deleteBtn.src = 'assets/icons/task-delete.png';
      deleteBtn.alt = 'delete';
      deleteBtn.classList.add('delete-btn');

      nameBtn.addEventListener('click', (e) => {
         e.preventDefault();
         openModal(taskSpan);
         form.addEventListener('submit', formSubmitHandler);
      });

      deleteBtn.addEventListener('click', () => {
         listItem.style.animation = 'fadeOut 0.5s forwards';
         listItem.addEventListener('animationend', () => {
            taskList.removeChild(listItem);
            saveTasksToLocalStorage();
         });
      });

      listItem.appendChild(taskSpan);
      listItem.appendChild(nameBtn);
      listItem.appendChild(deleteBtn);
      taskList.appendChild(listItem);
   };

   const openModal = (taskSpan) => {
      currentTaskSpan = taskSpan;
      document.body.style.overflow = 'hidden';
      popup.style.display = 'flex';
      overlay.style.display = 'block';
      modalInput.value = taskSpan.textContent;
   };

   const closeModal = () => {
      document.body.style.overflow = '';
      popup.style.display = 'none';
      overlay.style.display = 'none';
      modalInput.value = '';
      form.removeEventListener('submit', formSubmitHandler);
   };

   const formSubmitHandler = (event) => {
      event.preventDefault();
      const newTaskText = modalInput.value.trim();
      if (newTaskText !== '') {
         currentTaskSpan.textContent = newTaskText.length > 50 ? `${newTaskText.slice(0, 50)}...` : newTaskText;
         closeModal();
         saveTasksToLocalStorage();
      }
   };

   addTaskBtn.addEventListener('click', () => {
      const taskText = taskInput.value.trim();

      if (taskText !== '') {
         addTaskToList(taskText);
         taskInput.value = '';
         taskInput.focus();
         saveTasksToLocalStorage();
      }
   });

   overlay.addEventListener('click', (e) => {
      if (e.target === overlay || e.target === closeBtn || e.target === cancelBtn) {
         e.preventDefault();
         closeModal();
      }
   });

   closeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      closeModal();
   });

   cancelBtn.addEventListener('click', (e) => {
      e.preventDefault();
      closeModal();
   });

   clearTasksBtn.addEventListener('click', () => {
      taskList.innerHTML = '';
      saveTasksToLocalStorage();
   });

   loadTasksFromLocalStorage();
});
