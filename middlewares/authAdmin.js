const jwt = require("jsonwebtoken")


const Validate = (req, res, next)=>{
    var level = 0
    const token = req.headers["authorization"].split(" ")[1]
    if (!token) {
        return res.status.json({message:"you have not sent the token"})
    }
    jwt.verify(token, process.env.ADMIN_KEY, (error, data)=>{
        if (error) {
            return res.status(404).json({message:"Invalid token", token:token})
        }
        level = data.control.role.level
        if (level==1) {
            next()
        }else{
            return res.status(404).json({message:"Does not have the necessary permits"})
        }
        
    })
}

module.exports = Validate