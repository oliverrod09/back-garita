const jwt = require("jsonwebtoken")


function takeout(token){
    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.ADMIN_KEY, (error, data) => {
            if (error) {
                return reject({message:"Invalid token", token:token})
            }
            const id = data.control.id
            console.log(id)
            resolve(id)
        })
    })
}

module.exports = takeout