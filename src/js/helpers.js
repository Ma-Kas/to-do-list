import { format } from "date-fns";
import generalIcon from "../img/general.svg";
import todayIcon from "../img/today.svg";
import upcomingIcon from "../img/upcoming.svg";
import blankIcon from "../img/blank.svg";
import checkIcon from "../img/check.svg";

export function capitalizeFirstLetter(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

export function matchCorrectIcon(id) {
  switch (id) {
    case "general":
      return generalIcon;
    case "today":
      return todayIcon;
    case "upcoming":
      return upcomingIcon;
    default:
      return blankIcon;
  }
}

export function getTaskFormValues(form) {
  const mainProjectName = document.querySelector(".main-project-name");
  let { projectId } = mainProjectName.dataset;

  if (projectId === "today" || projectId === "upcoming") {
    projectId = "general";
  }

  return {
    title: form.title.value,
    description: form.description.value,
    date: format(new Date(form.date.value), "yyyy-MM-dd"),
    priority: form.priority.value,
    project: projectId,
  };
}

export function getAddProjectFormValues(form) {
  return form["project-name"].value;
}

export function getProjectFromId(projectList, projectId) {
  for (let i = 0; i < projectList.length; i++) {
    if (projectList[i].id === projectId) {
      return projectList[i];
    }
  }
  return null;
}

export function getTaskCount(taskList, projectId) {
  let taskCount = 0;
  taskList.forEach((task) => {
    if (task.projectId === projectId) {
      taskCount++;
    }
  });
  return taskCount;
}

export function getCurrentTaskData(taskItemList, taskItem) {
  const title = taskItem.querySelector(".main-task-item-title").textContent;
  const { projectId } = taskItem.dataset;
  for (let i = 0; i < taskItemList.length; i++) {
    if (
      taskItemList[i].title === title &&
      taskItemList[i].projectId === projectId
    ) {
      return taskItemList[i];
    }
  }
  return null;
}

export function removeAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

export { upcomingIcon, checkIcon };
