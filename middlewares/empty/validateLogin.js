
const Validate = (req, res, next) =>{
    const {user, password} = req.body;
    if (user.length==0) {
        return res.status(400).json({message:"user content is empty"});
    }else if(password.length==0){
        return res.status(400).json({message:"password content is empty"});
    }
    next();
}

module.exports = Validate;