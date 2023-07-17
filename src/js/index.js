import {
  capitalizeFirstLetter, 
  matchCorrectIcon, 
  getAddProjectFormValues, 
  getTaskFormValues,
  getProjectFromId,
  getTaskCount,
  getCurrentTaskData,
  removeAllChildNodes,
  upcomingIcon,
  checkIcon,
} from "./helpers";

import { format, parseISO, isWithinInterval, addDays, add, } from 'date-fns';


let projectList = [];
let taskItemList = [];

class Project {
  constructor(title) {
    this.title = title;
    this.icon = matchCorrectIcon(title.toLowerCase());
    this.id = title.toLowerCase();
    this.taskCount = getTaskCount(taskItemList, title.toLowerCase());
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

  const taskViewModalCloseBtn = document.querySelector('.task-view-modal-close-icon');

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
    updateSidebarTaskCount();
    toggleFormModalVisibility('.create-task');
    createTaskForm.reset()
  });

  // Task View Modal Event Listeners
  taskViewModalCloseBtn.addEventListener('click', (e) => {
    toggleFormModalVisibility('.task-view-modal-container');
  })
}

function newProject(title, defaultSection = false) {
  const newProject = createProjectInstance(title);
  createProjectDOM(newProject, defaultSection);
}

// Create new instance of Project class, add to projectList array
function createProjectInstance(title) {
  const newProject = new Project(title)
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
  const currentProject = getProjectFromId(projectList, selectedProjectDOM.dataset.projectId);

  const mainProjectName = document.querySelector('.main-project-name');
  const mainTaskOverview = document.querySelector('.main-task-overview');

  mainProjectName.textContent = currentProject.title;
  mainProjectName.dataset.projectId = currentProject.id;

  // Clear task view
  removeAllChildNodes(mainTaskOverview);

  // Populate task view with all tasks for current project
  switch (currentProject.id) {
    case 'today' :
      // Display tasks with dueDate today
      taskItemList.forEach(task => {
        if (task.dueDate === format(new Date(), 'yyyy-MM-dd')) {
          createNewTaskDOM(task.title, task.description, task.dueDate, task.priority, task.projectId);
        }
      });
      break;
    
    case 'upcoming' :
      // Display tasks with dueDate 7 days from tomorrow
      taskItemList.forEach(task => {
        if (isWithinInterval(new Date(parseISO(task.dueDate)), {
          start: new Date(),
          end: addDays(new Date(), 7)
        }) === true) {
          createNewTaskDOM(task.title, task.description, task.dueDate, task.priority, task.projectId);
        }
      });
      break;
    
    default :
      taskItemList.forEach(task => {
        if (task.projectId === currentProject.id) {
          createNewTaskDOM(task.title, task.description, task.dueDate, task.priority, task.projectId);
        }
      });
  }

}

// When adding or deleting task, update count in sidebar
function updateSidebarTaskCount() {
  const projectItems = document.querySelectorAll('.sidebar-project-item');
  const today = format(new Date(), 'yyyy-MM-dd');


  projectItems.forEach(project => {
    const id = project.dataset.projectId;
    const taskCountDOM = project.querySelector('.sidebar-project-task-count');
    let taskCount = 0;

    switch (id) {
      case 'today' :
        // Count all tasks with dueDate today
        taskItemList.forEach(task => {
          if (task.dueDate === today) {
            taskCount++;
          }
        });
        break;
      case 'upcoming' :
        // Count all tasks with dueDate 7 days from tomorrow
        taskItemList.forEach(task => {
          if (isWithinInterval(new Date(parseISO(task.dueDate)), {
            start: new Date(),
            end: addDays(new Date(), 7)
          }) === true) {
            taskCount++;
          }
        });
        break;
      default :
        // Count all tasks associated with said projectId
        taskItemList.forEach(task => {
          if (task.projectId === id) {
            taskCount++;
          }
        });
    }
    taskCountDOM.textContent = taskCount;
  });
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
  if (mainTaskOverview.querySelector('.main-task-item') !== null) {
    const divMainTaskDivider = document.createElement('div');
    divMainTaskDivider.classList.add('main-task-divider');
    mainTaskOverview.appendChild(divMainTaskDivider);
  }

  const divMainTaskItem = document.createElement('div');
  divMainTaskItem.classList.add('main-task-item');
  divMainTaskItem.dataset.projectId = projectId;

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
    setupTaskViewModal(e.target.closest('.main-task-item'));
    toggleFormModalVisibility('.task-view-modal-container');
  })

}

// Remove selected task from DOM and taskItemList array, update sidebar
function completeTask(taskItem) {
  // Logic to remove divider line as well, if present
  if (taskItem.previousElementSibling !== null) {
    if (taskItem.previousElementSibling.classList.contains('main-task-divider')) {
      taskItem.previousElementSibling.remove();
    }
  }
 
  taskItem.remove();

  const task = getCurrentTaskData(taskItemList, taskItem);
  const index = taskItemList.indexOf(task);
  taskItemList.splice(index, 1);

  updateSidebarTaskCount();
}

function setupTaskViewModal(taskItem) {
  const task = getCurrentTaskData(taskItemList, taskItem);
  const project = getProjectFromId(projectList, task.projectId);

  const headerProject = document.querySelector('.task-view-modal-header-project');
  const headerProjectIcon = headerProject.querySelector(':scope > img');
  const headerProjectTitle = headerProject.querySelector(':scope > div');

  headerProjectIcon.src = project.icon;
  headerProjectTitle.textContent = project.title;

  const taskTitle = document.querySelector('.task-view-modal-main-left-header');
  taskTitle.textContent = task.title;

  const taskDescriptionContainer = document.querySelector('.task-view-modal-main-left-description');
  const taskDescription = taskDescriptionContainer.querySelector(':scope > div');
  taskDescription.textContent = (task.description === '') ? 'Description' : task.description;

  const rightProject = document.querySelector('.task-view-modal-main-right-item-project');
  const rightProjectIcon = rightProject.querySelector(':scope > img');
  const rightProjectTitle = rightProject.querySelector(':scope > div');

  rightProjectIcon.src = project.icon;
  rightProjectTitle.textContent = project.title;

  const rightDueDateContainer = document.querySelector('.task-view-modal-main-right-item-date');
  const rightDueDate = rightDueDateContainer.querySelector(':scope > div');
  rightDueDate.textContent = task.dueDate;

  const rightPriorityContainer = document.querySelector('.task-view-modal-main-right-item-priority');
  const rightPriority = rightPriorityContainer.querySelector(':scope > div');
  rightPriority.textContent = `Priority ${task.priority}`;
}