import notificationsPopupTemplate from './NotificationPopup.tmpl.xml';
import rendering from '../../utils/rendering.js';

/**
 * Show notification
 * @param {string} notificationText
 */
export default function showNotification(notificationText) {
    const notificationsDiv = document.getElementById('notificationsDiv');
    const el = rendering.createElementsFromTmpl(notificationsPopupTemplate({notificationText: notificationText}));
    notificationsDiv.appendChild(el);
    setTimeout(() => {
        notificationsDiv.removeChild(notificationsDiv.firstChild);
    }, 5000);
}
