//// main.js

// In this file you can include the rest of your app's specific main process
// code. Vous pouvez également le mettre dans des fichiers séparés et les inclure ici.
// Cette méthode sera appelée quand Electron aura fini
// de s'initialiser et sera prêt à créer des fenêtres de navigation.
// Certaines APIs peuvent être utilisées uniquement quant cet événement est émit.

// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain, nativeTheme } = require('electron')
const path = require('path')

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  win.loadFile('index.html')

  ipcMain.handle('dark-mode:toggle', () => {
    if (nativeTheme.shouldUseDarkColors) {
      nativeTheme.themeSource = 'light'
    } else {
      nativeTheme.themeSource = 'dark'
    }
    return nativeTheme.shouldUseDarkColors
  })

  ipcMain.handle('dark-mode:system', () => {
    nativeTheme.themeSource = 'system'
  })
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// // Progress bar
// let progressInterval

// const createWindow = () => {
//   // Create the browser window.
//   const win = new BrowserWindow({
//     width: 800,
//     height: 600,
//     webPreferences: {
//       preload: path.join(__dirname, 'preload.js')
//     }
//   })

// Json
const fs = require('fs')

// Fichiers Recents
const fileName = ''
  fs.writeFile(fileName, 'Lorem Ipsum', () => {
  app.addRecentDocument(path.join(__dirname, fileName))
})

//   // // Bar de chargement avant que l'app soit prete
//   // const INCREMENT = 0.03
//   // const INTERVAL_DELAY = 100 // ms

//   // let c = 0
//   // progressInterval = setInterval(() => {
//   //   // update progress bar to next value
//   //   // values between 0 and 1 will show progress, >1 will show indeterminate or stick at 100%
//   //   win.setProgressBar(c)

//   //   // increment or reset progress bar
//   //   if (c < 2) {
//   //     c += INCREMENT
//   //   } else {
//   //     c = (-INCREMENT * 5) // reset to a bit less than 0 to show reset state
//   //   }
//   // }, INTERVAL_DELAY)

// // before the app is terminated, clear both timers
// app.on('before-quit', () => {
//   clearInterval(progressInterval)
// })