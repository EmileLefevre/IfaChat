const express = require("express");
const http = require("http");
const app = express();
const server = http.Server(app);
const io = require("socket.io")(server);
//172.20.65.251 = mon IP.
const ip = "127.0.0.1"
const port = 4242;
app.use(express.static('public')); // ou './public'
app.get('/', (req, res) => {
    res.sendFile("index.html", {root:__dirname});
})

const users = [];
const publicMessages = [];
io.on("connection", (socket) => { //socket = le client
    socket.emit("init", {message : "bienvenu cher client du chat houhanhou"});
    //attente de l'emission de sendLog appelé dans script.js
    socket.on("sendLog", (data) => {
        //sécu par auth pour voir si l'utilisateur existe
        data.id = socket.id // socket.id est un identifaint unique de chaque utilisateur
        users.push(data);
        //console.dir(users);
    })
    socket.on("publicMessage", (data) => {
        data.id = socket.id;
        publicMessages.push(data)
        //console.dir(publicMessages);
        socket.broadcast.emit("publicMessageGlobal", data);
    })
    socket.on("disconnect", () => {
        let indexDisconect;
        users.forEach((element, index) => {
            if (element.id === socket.id)
                indexDisconect = index; 
        });
        users.splice(indexDisconect, 1); // splice sert a supprimer une (ou plusieurs) entrée de tableau a partir de son index (indexDosconnected) 
        console.dir(users);
    })

})

server.listen(port, ip, () => {
    console.log("Demarer sur http://" + ip + ":" + port);
})