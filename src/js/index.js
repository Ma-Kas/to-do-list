const generalIcon = '../src/img/general.svg';
const todayIcon = '../src/img/today.svg';
const upcomingIcon = '../src/img/upcoming.svg';
const blankIcon = '../src/img/blank.svg';

let projectList = [];
let toDoItemList = [];

class Project {
  constructor(title, icon, toDoItems) {
    this.title = title;
    this.icon = icon;
    this.toDoItems = toDoItems;
  }
}

class ToDoItem {
  constructor(title, description, dueDate, priority, projectId, itemId) {
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
    this.projectId = projectId;
    this.itemId = itemId;
  }
}

(function initialPageSetup() {
  const sidebarAddProject = document.querySelector('.sidebar-add-project');
  const mainAddTask = document.querySelector('.main-add-task');
  const createTaskCancelBtn = document.getElementById('cancel-task-btn');
  const createTaskSubmitBtn = document.getElementById('create-task-btn');

  sidebarAddProject.addEventListener('click', () => {
    newProject('new project');
  })

  mainAddTask.addEventListener('click', () => {
    toggleAddTaskForm();
  })

  createTaskCancelBtn.addEventListener('click', (e) => {
    e.preventDefault();
    toggleAddTaskForm();
  })

  createTaskSubmitBtn.addEventListener('click', (e) => {
    e.preventDefault();
    getTaskFormValues();
    createNewTask();
    toggleAddTaskForm();
  })


  newProject('general', true);
  newProject('today', true);
  newProject('upcoming', true);
  
  return {

  }
})();


function newProject(title, defaultSection = false) {
  createProjectInstance(title, matchCorrectIcon(title), []);
  createProjectDOM(title, matchCorrectIcon(title), [], defaultSection);
}

// Create new instance of Project class, add to projectList array
function createProjectInstance(title, icon, toDoItems) {
  const newProject = new Project(title, icon, toDoItems)
  projectList.push(newProject);
}

// Create project entry in sidebar 
// Add event listener for click event on project, calling onProjectSelect
function createProjectDOM(title, icon, toDoItems, defaultSection) {
  const sidebarDefaultSection = document.querySelector('.sidebar-default-section');
  const sidebarProjectSection = document.querySelector('.sidebar-project-section');

  const divProjectItem = document.createElement('div');
  const imgProjectIcon = document.createElement('img');
  const divProjectName = document.createElement('div');
  const divProjectTaskCount = document.createElement('div');

  divProjectItem.classList.add('sidebar-project-item');
  divProjectItem.dataset.projectId = title;

  imgProjectIcon.classList.add('sidebar-project-icon');
  imgProjectIcon.src = icon;
  
  divProjectName.classList.add('sidebar-project-name');
  divProjectName.textContent = capitalizeFirstLetter(title);

  divProjectTaskCount.classList.add('sidebar-project-task-count');
  divProjectTaskCount.textContent = toDoItems.length;

  if (defaultSection === true) {
    sidebarDefaultSection.appendChild(divProjectItem);
  } else {
    sidebarProjectSection.appendChild(divProjectItem);
  }
  
  divProjectItem.appendChild(imgProjectIcon);
  divProjectItem.appendChild(divProjectName);
  divProjectItem.appendChild(divProjectTaskCount);

  divProjectItem.addEventListener('click', (e) => {
    onProjectSelect(e.currentTarget);
  });
}

function capitalizeFirstLetter(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function matchCorrectIcon(title) {
  switch (title) {
    case 'general' : 
      return generalIcon;
    case 'today' :
      return todayIcon;
    case 'upcoming' :
      return upcomingIcon;
    default :
      return blankIcon;
  }
}

// Called when clicked on project in sidebar
// Highlight selected project in sidebar
// Display tasks for selected project in main window
function onProjectSelect(selectedProject) {
  // Remove highlight class from all projects
  const allProjectsDOM = document.querySelectorAll('.sidebar-project-item');
  allProjectsDOM.forEach(project => {
    project.classList.remove('sidebar-project-selected');
  })

  // Highlight current project
  selectedProject.classList.add('sidebar-project-selected');

  updateMainTaskView(selectedProject);
}

function updateMainTaskView(currentProject) {
  const mainContentSection = document.getElementById('main-content-section');
  const mainProjectName = document.querySelector('.main-project-name');
  const mainTaskOverview = document.querySelector('.main-task-overview');

  mainProjectName.textContent = capitalizeFirstLetter(currentProject.dataset.projectId);
}

function toggleAddTaskForm() {
  const createTaskForm = document.querySelector('.create-task');
  const display = window.getComputedStyle(createTaskForm).display;
  createTaskForm.style.display = (display === 'none') ? 'flex' : 'none';
}

function getTaskFormValues() {
  console.log(this.title.value);
  console.log(this.description.value);
  console.log(this.date.value);
  console.log(this.priority.value);
}

function createNewTask(title, description = '', dueDate, priority = '', projectId, itemId) {
  const newTask = new ToDoItem(title, description, dueDate, priority, projectId, itemId);
  toDoItemList.push(newTask);
}

