const {app, BrowserWindow, ipcMain} = require("electron")
const prompt = require("electron-prompt")
const Path = require("path")
const Fs = require("fs")

let Win;

app.on("ready", async () => {
    console.log("App running...")
    
    Win = new BrowserWindow({
        width: 800,
        height: 600,
        autoHideMenuBar: true,
        resizable: true,
        webPreferences: {
            nodeIntegration: true, //For using require in web
            contextIsolation: false
        }
    })

    
    await Win.loadFile(__dirname + "/src/Page.html")
    Win.webContents.openDevTools() //just for debugging
})

ipcMain.on("action", (event, arg) => {
    if(arg == "ask"){
        let Data = Fs.readFileSync(__dirname + "/data/Saved", {encoding: "utf-8", flag: "r"})
        console.log(Data)

        event.sender.send("data", Data)
    }
})

ipcMain.on("action-sync", (event, arg) => {
    if(arg[0] == "open-dialog"){
        prompt({
            title: "AppDialog",
            label: "Rewrite?",
            value: arg[1],
            type: "input"
        }).then((res) => {
            if(res !== null){
                event.returnValue = "Success"

                Win.webContents.send("changed-name", res)
            }
        })

  
    }
})

ipcMain.on("action-save", (event, arg) => {

    var ToWrite = ""

    arg.forEach((values, keys) => {
        ToWrite += (keys + "\n")
        ToWrite += (values + "\n")
    })

    Fs.writeFileSync(__dirname + "/data/Saved", ToWrite)
})