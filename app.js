const express = require("express");
const app = express();
const routerUser = require("./routes/user")
const routerResidence = require("./routes/residence")
const routerInvitation = require("./routes/invitations")

app.use(express.json())

// app.get("/user",(req, res)=>{
//     return res.send("users")
// })

app.use("/users", routerUser)

app.use("/residence", routerResidence)

app.use("/invitations", routerInvitation)


app.use((req, res)=>{
    return res.status(404).send("no existe")
})


app.listen('3000', ()=>{
    console.log("servidor encendido")
})