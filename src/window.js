const {getPics}=require('./screenPic')
const {
    ipcMain,
    app,
    BrowserWindow
} = require("electron")


const path=require("path")

ipcMain.on("send-message",(event,arg)=>{
    console.log("arg:",arg)
    getPics(arg,event,sendMsg2Render)

})

let mainWindow

function sendMsg2Render(event,msg)
{
    event.reply("downloadResult",msg)
}
function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences:{
            nodeIntegration:true
        }
    })
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

