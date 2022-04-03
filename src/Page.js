const {ipcRenderer} = require("electron")
jQuery(() => {
    //ask for saved TODO data
    ipcRenderer.send("action", "ask")

    ipcRenderer.on("data", (event, arg) => {
        console.log(arg)

        var Segm = arg.split("\n")
        Segm.pop()

        for(let i = 0; i < (Segm.length / 2); i++){
            $("#todolist").append(`<div class="elem">
                                <p class="ClickableText" onclick="Rewrite(${i})" style="font-size: 25px">${Segm[i * 2]}</p>
                                <p class="ClickableUnder" onclick="RewritePar(${i})"style="margin-left: font-size 15px;">${Segm[i * 2 + 1]}</p>
                                <button id="Remove" style="padding: 4px 6px;" onclick=Remove(${i})>Remove</button>
                                </div>`) 
        }
    })
})

//functions
$(document).on("click", "#top1", () => {
    //Add todo
    let NumOfTODOS = $(".elem").length
    $("#todolist").append(`<div class="elem">
                                <p class="ClickableText" onclick="Rewrite(${NumOfTODOS})" style="font-size: 25px">todo${NumOfTODOS}</p>
                                <p class="ClickableUnder" onclick="RewritePar(${NumOfTODOS})"style="margin-left: font-size 15px;">Add description...</p>
                                <button id="Remove" style="padding: 4px 6px;" onclick=Remove(${NumOfTODOS})>Remove</button>
                            </div>`)
})

$(document).on("click", "#top2", () => {
    //remove all
    $("#todolist").children().remove()
    
})

$(document).on("click", "#top3", () => {
    var Result = new Map()

    //save
    $("#todolist").children().each((index, value) => {
        Result.set(value.children[0].innerHTML, value.children[1].innerHTML)
    })

    ipcRenderer.send("action-save", Result)
})

function Rewrite(index){
    var TODOheaders = document.getElementsByClassName("ClickableText")
    var TODOS = document.getElementsByClassName("elem")

    ipcRenderer.send("action-sync", ["open-dialog", TODOheaders[index].innerHTML])

    ipcRenderer.on("changed-name", (event, arg) => {
        TODOheaders[index].innerHTML = arg

        for(let i = 0; i < TODOS.length; i++){
            TODOS[i].children[0].setAttribute("onclick", `Rewrite(${i})`)
        }
        ipcRenderer.removeAllListeners("changed-name")
         
    })

}

function RewritePar(index){
    var TODOheaders = document.getElementsByClassName("ClickableUnder")
    var TODOS = document.getElementsByClassName("elem")

    ipcRenderer.send("action-sync", ["open-dialog", TODOheaders[index].innerHTML])

    ipcRenderer.on("changed-name", (event, arg) => {
        TODOheaders[index].innerHTML = arg

        for(let i = 0; i < TODOS.length; i++){
            TODOS[i].children[1].setAttribute("onclick", `RewritePar(${i})`)
        }
        ipcRenderer.removeAllListeners("changed-name")
    })
}

function Remove(index){
    var TODOS = document.getElementsByClassName("elem")
    TODOS[index].remove()

    TODOS = document.getElementsByClassName("elem")
    for(let i = 0; i < TODOS.length; i++){
        TODOS[i].children[2].setAttribute("onclick", `Remove(${i})`)
    }
}