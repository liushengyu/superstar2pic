const {
    ipcMain,
    app,
    BrowserWindow
} = require("electron")
const path=require("path")



let mainWindow

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600
    })
    console.log(path.join(__dirname,"../superstar2pic_page/dist/index.html"))
    mainWindow.loadFile(path.join(__dirname,"../superstar2pic_page/dist/index.html"));

    mainWindow.on("closed", () => {
        mainWindow = null
    })
}
app.on("ready", createWindow)

app.on("window-all-closed", () => {
    if (process.platform !== 'darwin')
        app.quit()
})

app.on("activate",()=>{
    if(mainWindow==null)
    {
        createWindow()
    }
})

