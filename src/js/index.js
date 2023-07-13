import {
  capitalizeFirstLetter, 
  matchCorrectIcon, 
  getAddProjectFormValues, 
  getTaskFormValues,
  upcomingIcon,
  checkIcon,
} from "./helpers";


let projectList = [];
let taskItemList = [];

class Project {
  constructor(title, icon, taskCount) {
    this.title = title;
    this.icon = icon;
    this.id = title.toLowerCase();
    this.taskCount = taskCount;
  }
}

class TaskItem {
  constructor(title, description, dueDate, priority, projectId) {
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
    this.projectId = projectId;
  }
}

(function initialPageSetup() {
  setupEventListeners();

  newProject('General', true);
  newProject('Today', true);
  newProject('Upcoming', true);
  
  return {}
})();


function setupEventListeners() {
  const sidebarAddProject = document.querySelector('.sidebar-add-project');

  const newProjectModalForm = document.querySelector('.new-project-modal');
  const cancelProjectBtn = document.getElementById('cancel-project-btn');

  const mainAddTask = document.querySelector('.main-add-task');
  const createTaskForm = document.querySelector('.create-task');
  const createTaskCancelBtn = document.getElementById('cancel-task-btn');

  // Sidebar Event Listeners
  sidebarAddProject.addEventListener('click', () => {
    toggleFormModalVisibility('.new-project-modal-container');
  })

  // New Project Modal Listeners
 newProjectModalForm.addEventListener('submit', (e) => {
    e.preventDefault();
    newProject(getAddProjectFormValues(newProjectModalForm));
    toggleFormModalVisibility('.new-project-modal-container');
    newProjectModalForm.reset();
  })

  cancelProjectBtn.addEventListener('click', () => {
    toggleFormModalVisibility('.new-project-modal-container');
    newProjectModalForm.reset();
  })


  // Add Task Event Listeners
  mainAddTask.addEventListener('click', () => {
    toggleFormModalVisibility('.create-task');
  })

  createTaskCancelBtn.addEventListener('click', (e) => {
    e.preventDefault();
    toggleFormModalVisibility('.create-task');
    createTaskForm.reset()
  })

  createTaskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const taskData = getTaskFormValues(createTaskForm);
    createNewTaskInstance(taskData.title, taskData.description, taskData.date, taskData.priority, taskData.project);
    createNewTaskDOM(taskData.title, taskData.description, taskData.date, taskData.priority, taskData.project);
    toggleFormModalVisibility('.create-task');
    createTaskForm.reset()
  });
}

function newProject(title, defaultSection = false) {
  const newProject = createProjectInstance(title, matchCorrectIcon(title), 0);
  createProjectDOM(newProject, defaultSection);
}

// Create new instance of Project class, add to projectList array
function createProjectInstance(title, icon, taskCount) {
  const newProject = new Project(title, icon, taskCount)
  projectList.push(newProject);
  return newProject;
}

// Create project entry in sidebar 
// Add event listener for click event on project, calling onProjectSelect
function createProjectDOM(newProject, defaultSection) {
  const sidebarDefaultSection = document.querySelector('.sidebar-default-section');
  const sidebarProjectSection = document.querySelector('.sidebar-project-section');

  const divProjectItem = document.createElement('div');
  const imgProjectIcon = document.createElement('img');
  const divProjectName = document.createElement('div');
  const divProjectTaskCount = document.createElement('div');

  divProjectItem.classList.add('sidebar-project-item');
  divProjectItem.dataset.projectId = newProject.id;

  imgProjectIcon.classList.add('sidebar-project-icon');
  imgProjectIcon.src = newProject.icon;
  
  divProjectName.classList.add('sidebar-project-name');
  divProjectName.textContent = newProject.title;

  divProjectTaskCount.classList.add('sidebar-project-task-count');
  divProjectTaskCount.textContent = newProject.taskCount;

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

// Called when clicked on project in sidebar
// Highlight selected project in sidebar
// Display tasks for selected project in main window
function onProjectSelect(selectedProjectDOM) {
  // Remove highlight class from all projects
  const allProjectsDOM = document.querySelectorAll('.sidebar-project-item');
  allProjectsDOM.forEach(project => {
    project.classList.remove('sidebar-project-selected');
  })

  // Highlight current project
  selectedProjectDOM.classList.add('sidebar-project-selected');

  updateMainTaskView(selectedProjectDOM);
}

function updateMainTaskView(selectedProjectDOM) {
  const currentProject = getProjectFromId(selectedProjectDOM.dataset.projectId);

  const mainContentSection = document.getElementById('main-content-section');
  const mainProjectName = document.querySelector('.main-project-name');
  const mainTaskOverview = document.querySelector('.main-task-overview');

  mainProjectName.textContent = currentProject.title;
  mainProjectName.dataset.projectId = currentProject.id;
}

function toggleFormModalVisibility(className) {
  const elementToToggle = document.querySelector(className);
  const display = window.getComputedStyle(elementToToggle).display;
  elementToToggle.style.display = (display === 'none') ? 'flex' : 'none';
}

function createNewTaskInstance(title, description = '', dueDate, priority = '', projectId) {
  const newTask = new TaskItem(title, description, dueDate, priority, projectId);
  taskItemList.push(newTask);
}

// Populate the DOM and add event listeners to new elements
function createNewTaskDOM(title, description = '', dueDate, _priority = '', projectId) {
  const mainTaskOverview = document.querySelector('.main-task-overview');

  // Create a divider if other tasks are present in list
  if (mainTaskOverview.hasChildNodes() === true) {
    const divMainTaskDivider = document.createElement('div');
    divMainTaskDivider.classList.add('main-task-divider');
    mainTaskOverview.appendChild(divMainTaskDivider);
  }

  const divMainTaskItem = document.createElement('div');
  divMainTaskItem.classList.add('main-task-item');

  const imgMainTaskCheckIcon = document.createElement('img');
  imgMainTaskCheckIcon.classList.add('main-task-check-icon');
  imgMainTaskCheckIcon.src = checkIcon;

  const divMainTaskItemContent = document.createElement('div');
  divMainTaskItemContent.classList.add('main-task-item-content');

  const divMainTaskItemTitle = document.createElement('div');
  divMainTaskItemTitle.classList.add('main-task-item-title');
  divMainTaskItemTitle.textContent = title;

  const divMainTaskItemDescription = document.createElement('div');
  divMainTaskItemDescription.classList.add('main-task-item-description');
  divMainTaskItemDescription.textContent = description;

  const divMainTaskItemBottom = document.createElement('div');
  divMainTaskItemBottom.classList.add('main-task-item-bottom');

  const divMainTaskItemDate = document.createElement('div');
  divMainTaskItemDate.classList.add('main-task-item-date');

  const imgTaskViewDateIcon = document.createElement('img');
  imgTaskViewDateIcon.classList.add('task-view-date-icon');
  imgTaskViewDateIcon.src = upcomingIcon;

  const divTaskViewDate = document.createElement('div');
  divTaskViewDate.textContent = dueDate;

  const divMainTaskItemProject = document.createElement('div');
  divMainTaskItemProject.classList.add('main-task-item-project');

  const divTaskViewProjectText = document.createElement('div');
  divTaskViewProjectText.textContent = capitalizeFirstLetter(projectId);

  const imgTaskViewProjectIcon = document.createElement('img');
  imgTaskViewProjectIcon.classList.add('task-view-project-icon');
  imgTaskViewProjectIcon.src = matchCorrectIcon(projectId);

  // Append to DOM
  mainTaskOverview.appendChild(divMainTaskItem);
  divMainTaskItem.appendChild(imgMainTaskCheckIcon);
  divMainTaskItem.appendChild(divMainTaskItemContent);
  divMainTaskItemContent.appendChild(divMainTaskItemTitle);
  divMainTaskItemContent.appendChild(divMainTaskItemDescription);
  divMainTaskItemContent.appendChild(divMainTaskItemBottom);
  divMainTaskItemBottom.appendChild(divMainTaskItemDate);
  divMainTaskItemDate.appendChild(imgTaskViewDateIcon);
  divMainTaskItemDate.appendChild(divTaskViewDate);
  divMainTaskItemBottom.appendChild(divMainTaskItemProject);
  divMainTaskItemProject.appendChild(divTaskViewProjectText);
  divMainTaskItemProject.appendChild(imgTaskViewProjectIcon);

  // Create Event Listeners
  imgMainTaskCheckIcon.addEventListener('click', (e) => {
    completeTask(e.currentTarget.parentElement);
  });

  divMainTaskItemContent.addEventListener('click', (e) => {
    toggleTaskViewModal(e.target.closest('.main-task-item'));
  })

}

// Remove
function completeTask(taskItem) {
  if (taskItem.previousElementSibling.classList.contains('main-task-divider')) {
    taskItem.previousElementSibling.remove();
  };
  taskItem.remove();

  // TODO code to remove correct task from taskList array
}

function toggleTaskViewModal(taskItem) {
  // make big modal
  console.log(taskItem);
}

function getProjectFromId(projectId) {
  for (let i = 0; i < projectList.length; i++) {
    if (projectList[i].id === projectId) {
      return projectList[i];
    }
  }
}