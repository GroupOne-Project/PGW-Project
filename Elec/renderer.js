// Electron Theme Switch 
document.getElementById('toggle-dark-mode').addEventListener('click', async () => {
  const isDarkMode = await window.darkMode.toggle()
  document.getElementById('theme-source').innerHTML = isDarkMode ? 'Dark' : 'Light'
})

document.getElementById('reset-to-system').addEventListener('click', async () => {
  await window.darkMode.system()
  document.getElementById('theme-source').innerHTML = 'System'
})


//  Notifications
// const username = require('os').userInfo()

const NOTIFICATION_TITLE = 'PGW Project'

const NOTIFICATION_BODY = [
    'Welcome !',
    'Welcome to PGW project',
    'Manage Project is our passion 😁',
    'The best project manager',
    'Hi 👋, Welcome !'
]
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}
const rand = getRandomInt(3); 

const CLICK_MESSAGE = 'Notification clicked!'

new Notification(NOTIFICATION_TITLE, { body: NOTIFICATION_BODY[rand] })
  // .onclick = () => document.getElementById("output").innerText = CLICK_MESSAGE


// // Connection status

// const updateOnlineStatus = () => {
//   document.getElementById('status').innerHTML = navigator.onLine ? 'Online' : 'Offline'
// }  
// window.addEventListener('online', updateOnlineStatus)
// window.addEventListener('offline', updateOnlineStatus)
  
// updateOnlineStatus()