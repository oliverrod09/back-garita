
const Validate = (req, res, next) =>{
    const {email, password} = req.body;
    if (email.length==0) {
        return res.status(400).json({message:"email content is empty"});
    }else if(password.length==0){
        return res.status(400).json({message:"password content is empty"});
    }
    next();
}

module.exports = Validate;