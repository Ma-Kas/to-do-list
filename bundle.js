/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/helpers.js":
/*!***************************!*\
  !*** ./src/js/helpers.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   capitalizeFirstLetter: () => (/* binding */ capitalizeFirstLetter),\n/* harmony export */   checkIcon: () => (/* reexport default export from named module */ _img_check_svg__WEBPACK_IMPORTED_MODULE_4__),\n/* harmony export */   getAddProjectFormValues: () => (/* binding */ getAddProjectFormValues),\n/* harmony export */   getTaskFormValues: () => (/* binding */ getTaskFormValues),\n/* harmony export */   matchCorrectIcon: () => (/* binding */ matchCorrectIcon),\n/* harmony export */   upcomingIcon: () => (/* reexport default export from named module */ _img_upcoming_svg__WEBPACK_IMPORTED_MODULE_2__)\n/* harmony export */ });\n/* harmony import */ var _img_general_svg__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../img/general.svg */ \"./src/img/general.svg\");\n/* harmony import */ var _img_today_svg__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../img/today.svg */ \"./src/img/today.svg\");\n/* harmony import */ var _img_upcoming_svg__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../img/upcoming.svg */ \"./src/img/upcoming.svg\");\n/* harmony import */ var _img_blank_svg__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../img/blank.svg */ \"./src/img/blank.svg\");\n/* harmony import */ var _img_check_svg__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../img/check.svg */ \"./src/img/check.svg\");\n\n\n\n\n\n\nfunction capitalizeFirstLetter(word) {\n  return word.charAt(0).toUpperCase() + word.slice(1);\n}\n\nfunction matchCorrectIcon(title) {\n  switch (title) {\n    case 'general' : \n      return _img_general_svg__WEBPACK_IMPORTED_MODULE_0__;\n    case 'today' :\n      return _img_today_svg__WEBPACK_IMPORTED_MODULE_1__;\n    case 'upcoming' :\n      return _img_upcoming_svg__WEBPACK_IMPORTED_MODULE_2__;\n    default :\n      return _img_blank_svg__WEBPACK_IMPORTED_MODULE_3__;\n  }\n}\n\nfunction getTaskFormValues(form) {\n  const mainProjectName = document.querySelector('.main-project-name');\n  return {\n    title: form.title.value,\n    description: form.description.value,\n    date: form.date.value,\n    priority: form.priority.value,\n    project: mainProjectName.dataset.projectId,\n  }\n}\n\nfunction getAddProjectFormValues(form) {\n  return form['project-name'].value;\n}\n\n\n\n//# sourceURL=webpack://to-do-list/./src/js/helpers.js?");

/***/ }),

/***/ "./src/js/index.js":
/*!*************************!*\
  !*** ./src/js/index.js ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./helpers */ \"./src/js/helpers.js\");\n\n\n\nlet projectList = [];\nlet taskItemList = [];\n\nclass Project {\n  constructor(title, icon, taskCount) {\n    this.title = title;\n    this.icon = icon;\n    this.id = title.toLowerCase();\n    this.taskCount = taskCount;\n  }\n}\n\nclass TaskItem {\n  constructor(title, description, dueDate, priority, projectId) {\n    this.title = title;\n    this.description = description;\n    this.dueDate = dueDate;\n    this.priority = priority;\n    this.projectId = projectId;\n  }\n}\n\n(function initialPageSetup() {\n  setupEventListeners();\n\n  newProject('General', true);\n  newProject('Today', true);\n  newProject('Upcoming', true);\n  \n  return {}\n})();\n\n\nfunction setupEventListeners() {\n  const sidebarAddProject = document.querySelector('.sidebar-add-project');\n\n  const newProjectModalForm = document.querySelector('.new-project-modal');\n  const cancelProjectBtn = document.getElementById('cancel-project-btn');\n\n  const mainAddTask = document.querySelector('.main-add-task');\n  const createTaskForm = document.querySelector('.create-task');\n  const createTaskCancelBtn = document.getElementById('cancel-task-btn');\n\n  // Sidebar Event Listeners\n  sidebarAddProject.addEventListener('click', () => {\n    toggleFormModalVisibility('.new-project-modal-container');\n  })\n\n  // New Project Modal Listeners\n newProjectModalForm.addEventListener('submit', (e) => {\n    e.preventDefault();\n    newProject((0,_helpers__WEBPACK_IMPORTED_MODULE_0__.getAddProjectFormValues)(newProjectModalForm));\n    toggleFormModalVisibility('.new-project-modal-container');\n    newProjectModalForm.reset();\n  })\n\n  cancelProjectBtn.addEventListener('click', () => {\n    toggleFormModalVisibility('.new-project-modal-container');\n    newProjectModalForm.reset();\n  })\n\n\n  // Add Task Event Listeners\n  mainAddTask.addEventListener('click', () => {\n    toggleFormModalVisibility('.create-task');\n  })\n\n  createTaskCancelBtn.addEventListener('click', (e) => {\n    e.preventDefault();\n    toggleFormModalVisibility('.create-task');\n    createTaskForm.reset()\n  })\n\n  createTaskForm.addEventListener('submit', (e) => {\n    e.preventDefault();\n    const taskData = (0,_helpers__WEBPACK_IMPORTED_MODULE_0__.getTaskFormValues)(createTaskForm);\n    createNewTaskInstance(taskData.title, taskData.description, taskData.date, taskData.priority, taskData.project);\n    createNewTaskDOM(taskData.title, taskData.description, taskData.date, taskData.priority, taskData.project);\n    toggleFormModalVisibility('.create-task');\n    createTaskForm.reset()\n  });\n}\n\nfunction newProject(title, defaultSection = false) {\n  const newProject = createProjectInstance(title, (0,_helpers__WEBPACK_IMPORTED_MODULE_0__.matchCorrectIcon)(title), 0);\n  createProjectDOM(newProject, defaultSection);\n}\n\n// Create new instance of Project class, add to projectList array\nfunction createProjectInstance(title, icon, taskCount) {\n  const newProject = new Project(title, icon, taskCount)\n  projectList.push(newProject);\n  return newProject;\n}\n\n// Create project entry in sidebar \n// Add event listener for click event on project, calling onProjectSelect\nfunction createProjectDOM(newProject, defaultSection) {\n  const sidebarDefaultSection = document.querySelector('.sidebar-default-section');\n  const sidebarProjectSection = document.querySelector('.sidebar-project-section');\n\n  const divProjectItem = document.createElement('div');\n  const imgProjectIcon = document.createElement('img');\n  const divProjectName = document.createElement('div');\n  const divProjectTaskCount = document.createElement('div');\n\n  divProjectItem.classList.add('sidebar-project-item');\n  divProjectItem.dataset.projectId = newProject.id;\n\n  imgProjectIcon.classList.add('sidebar-project-icon');\n  imgProjectIcon.src = newProject.icon;\n  \n  divProjectName.classList.add('sidebar-project-name');\n  divProjectName.textContent = newProject.title;\n\n  divProjectTaskCount.classList.add('sidebar-project-task-count');\n  divProjectTaskCount.textContent = newProject.taskCount;\n\n  if (defaultSection === true) {\n    sidebarDefaultSection.appendChild(divProjectItem);\n  } else {\n    sidebarProjectSection.appendChild(divProjectItem);\n  }\n  \n  divProjectItem.appendChild(imgProjectIcon);\n  divProjectItem.appendChild(divProjectName);\n  divProjectItem.appendChild(divProjectTaskCount);\n\n  divProjectItem.addEventListener('click', (e) => {\n    onProjectSelect(e.currentTarget);\n  });\n}\n\n// Called when clicked on project in sidebar\n// Highlight selected project in sidebar\n// Display tasks for selected project in main window\nfunction onProjectSelect(selectedProjectDOM) {\n  // Remove highlight class from all projects\n  const allProjectsDOM = document.querySelectorAll('.sidebar-project-item');\n  allProjectsDOM.forEach(project => {\n    project.classList.remove('sidebar-project-selected');\n  })\n\n  // Highlight current project\n  selectedProjectDOM.classList.add('sidebar-project-selected');\n\n  updateMainTaskView(selectedProjectDOM);\n}\n\nfunction updateMainTaskView(selectedProjectDOM) {\n  const currentProject = getProjectFromId(selectedProjectDOM.dataset.projectId);\n\n  const mainContentSection = document.getElementById('main-content-section');\n  const mainProjectName = document.querySelector('.main-project-name');\n  const mainTaskOverview = document.querySelector('.main-task-overview');\n\n  mainProjectName.textContent = currentProject.title;\n  mainProjectName.dataset.projectId = currentProject.id;\n}\n\nfunction toggleFormModalVisibility(className) {\n  const elementToToggle = document.querySelector(className);\n  const display = window.getComputedStyle(elementToToggle).display;\n  elementToToggle.style.display = (display === 'none') ? 'flex' : 'none';\n}\n\nfunction createNewTaskInstance(title, description = '', dueDate, priority = '', projectId) {\n  const newTask = new TaskItem(title, description, dueDate, priority, projectId);\n  taskItemList.push(newTask);\n}\n\n// Populate the DOM and add event listeners to new elements\nfunction createNewTaskDOM(title, description = '', dueDate, _priority = '', projectId) {\n  const mainTaskOverview = document.querySelector('.main-task-overview');\n\n  // Create a divider if other tasks are present in list\n  if (mainTaskOverview.hasChildNodes() === true) {\n    const divMainTaskDivider = document.createElement('div');\n    divMainTaskDivider.classList.add('main-task-divider');\n    mainTaskOverview.appendChild(divMainTaskDivider);\n  }\n\n  const divMainTaskItem = document.createElement('div');\n  divMainTaskItem.classList.add('main-task-item');\n\n  const imgMainTaskCheckIcon = document.createElement('img');\n  imgMainTaskCheckIcon.classList.add('main-task-check-icon');\n  imgMainTaskCheckIcon.src = _helpers__WEBPACK_IMPORTED_MODULE_0__.checkIcon;\n\n  const divMainTaskItemContent = document.createElement('div');\n  divMainTaskItemContent.classList.add('main-task-item-content');\n\n  const divMainTaskItemTitle = document.createElement('div');\n  divMainTaskItemTitle.classList.add('main-task-item-title');\n  divMainTaskItemTitle.textContent = title;\n\n  const divMainTaskItemDescription = document.createElement('div');\n  divMainTaskItemDescription.classList.add('main-task-item-description');\n  divMainTaskItemDescription.textContent = description;\n\n  const divMainTaskItemBottom = document.createElement('div');\n  divMainTaskItemBottom.classList.add('main-task-item-bottom');\n\n  const divMainTaskItemDate = document.createElement('div');\n  divMainTaskItemDate.classList.add('main-task-item-date');\n\n  const imgTaskViewDateIcon = document.createElement('img');\n  imgTaskViewDateIcon.classList.add('task-view-date-icon');\n  imgTaskViewDateIcon.src = _helpers__WEBPACK_IMPORTED_MODULE_0__.upcomingIcon;\n\n  const divTaskViewDate = document.createElement('div');\n  divTaskViewDate.textContent = dueDate;\n\n  const divMainTaskItemProject = document.createElement('div');\n  divMainTaskItemProject.classList.add('main-task-item-project');\n\n  const divTaskViewProjectText = document.createElement('div');\n  divTaskViewProjectText.textContent = (0,_helpers__WEBPACK_IMPORTED_MODULE_0__.capitalizeFirstLetter)(projectId);\n\n  const imgTaskViewProjectIcon = document.createElement('img');\n  imgTaskViewProjectIcon.classList.add('task-view-project-icon');\n  imgTaskViewProjectIcon.src = (0,_helpers__WEBPACK_IMPORTED_MODULE_0__.matchCorrectIcon)(projectId);\n\n  // Append to DOM\n  mainTaskOverview.appendChild(divMainTaskItem);\n  divMainTaskItem.appendChild(imgMainTaskCheckIcon);\n  divMainTaskItem.appendChild(divMainTaskItemContent);\n  divMainTaskItemContent.appendChild(divMainTaskItemTitle);\n  divMainTaskItemContent.appendChild(divMainTaskItemDescription);\n  divMainTaskItemContent.appendChild(divMainTaskItemBottom);\n  divMainTaskItemBottom.appendChild(divMainTaskItemDate);\n  divMainTaskItemDate.appendChild(imgTaskViewDateIcon);\n  divMainTaskItemDate.appendChild(divTaskViewDate);\n  divMainTaskItemBottom.appendChild(divMainTaskItemProject);\n  divMainTaskItemProject.appendChild(divTaskViewProjectText);\n  divMainTaskItemProject.appendChild(imgTaskViewProjectIcon);\n\n  // Create Event Listeners\n  imgMainTaskCheckIcon.addEventListener('click', (e) => {\n    completeTask(e.currentTarget.parentElement);\n  });\n\n  divMainTaskItemContent.addEventListener('click', (e) => {\n    toggleTaskViewModal(e.target.closest('.main-task-item'));\n  })\n\n}\n\n// Remove\nfunction completeTask(taskItem) {\n  if (taskItem.previousElementSibling.classList.contains('main-task-divider')) {\n    taskItem.previousElementSibling.remove();\n  };\n  taskItem.remove();\n\n  // TODO code to remove correct task from taskList array\n}\n\nfunction toggleTaskViewModal(taskItem) {\n  // make big modal\n  console.log(taskItem);\n}\n\nfunction getProjectFromId(projectId) {\n  for (let i = 0; i < projectList.length; i++) {\n    if (projectList[i].id === projectId) {\n      return projectList[i];\n    }\n  }\n}\n\n//# sourceURL=webpack://to-do-list/./src/js/index.js?");

/***/ }),

/***/ "./src/img/blank.svg":
/*!***************************!*\
  !*** ./src/img/blank.svg ***!
  \***************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("module.exports = __webpack_require__.p + \"a69d88f5b566c5e7cc14.svg\";\n\n//# sourceURL=webpack://to-do-list/./src/img/blank.svg?");

/***/ }),

/***/ "./src/img/check.svg":
/*!***************************!*\
  !*** ./src/img/check.svg ***!
  \***************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("module.exports = __webpack_require__.p + \"7699c61580660eddf73f.svg\";\n\n//# sourceURL=webpack://to-do-list/./src/img/check.svg?");

/***/ }),

/***/ "./src/img/general.svg":
/*!*****************************!*\
  !*** ./src/img/general.svg ***!
  \*****************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("module.exports = __webpack_require__.p + \"ee9c78bb03a96dd4807c.svg\";\n\n//# sourceURL=webpack://to-do-list/./src/img/general.svg?");

/***/ }),

/***/ "./src/img/today.svg":
/*!***************************!*\
  !*** ./src/img/today.svg ***!
  \***************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("module.exports = __webpack_require__.p + \"5c7ebb3f38df9edad677.svg\";\n\n//# sourceURL=webpack://to-do-list/./src/img/today.svg?");

/***/ }),

/***/ "./src/img/upcoming.svg":
/*!******************************!*\
  !*** ./src/img/upcoming.svg ***!
  \******************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("module.exports = __webpack_require__.p + \"262a8a2a502b5b8e839d.svg\";\n\n//# sourceURL=webpack://to-do-list/./src/img/upcoming.svg?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript)
/******/ 				scriptUrl = document.currentScript.src;
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) {
/******/ 					var i = scripts.length - 1;
/******/ 					while (i > -1 && !scriptUrl) scriptUrl = scripts[i--].src;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl;
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/js/index.js");
/******/ 	
/******/ })()
;