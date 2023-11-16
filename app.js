const express = require("express");
const app = express();
const routerUser = require("./routes/user")
const routerResidence = require("./routes/residence")
const routerInvitation = require("./routes/invitations")
const routerControl = require("./routes/control")
const routerRole = require("./routes/role")
const cors = require("cors")
app.use(express.json())
app.use(cors())
const port = process.env.PORT


// app.get("/user",(req, res)=>{
//     return res.send("users")
// })

app.use("/users", routerUser)

app.use("/residence", routerResidence)

app.use("/invitations", routerInvitation)

app.use("/control", routerControl)

app.use("/role", routerRole)

app.use((req, res)=>{
    return res.status(404).send("not found")
})


app.listen(port, ()=>{
    console.log("servidor encendido "+port)
})