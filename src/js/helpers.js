import generalIcon from '../img/general.svg';
import todayIcon from '../img/today.svg';
import upcomingIcon from '../img/upcoming.svg';
import blankIcon from '../img/blank.svg';
import checkIcon from '../img/check.svg';

export function capitalizeFirstLetter(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

export function matchCorrectIcon(title) {
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

export function getTaskFormValues(form) {
  const mainProjectName = document.querySelector('.main-project-name');
  return {
    title: form.title.value,
    description: form.description.value,
    date: form.date.value,
    priority: form.priority.value,
    project: mainProjectName.dataset.projectId,
  }
}

export function getAddProjectFormValues(form) {
  return form['project-name'].value;
}

export { upcomingIcon, checkIcon }