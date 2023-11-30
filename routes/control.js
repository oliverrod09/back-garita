const express = require("express")
const router = express.Router();
const {PrismaClient} = require("@prisma/client")
const prisma = new PrismaClient()
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const validateLogin = require("../middlewares/empty/validateLogin")
const authControls = require("../middlewares/authControls")
const authAdmin = require("../middlewares/authAdmin")
const idTokenControl = require("../controllers/control/idToken")


// ROUTES FOR USERS ADMIN
//create controls
router.post("/", authControls, async (req, res)=>{
    try {
        const {name, email, password, roleId} = req.body
        const findEmail = await prisma.controls.findFirst({
            where:{
                email:email
            }
        })

        if (findEmail) {
            return res.status(401).json({message:"there is already a user with this email"})
        }

        const findRole = await prisma.role.findFirst({
            where:{
                id:Number(roleId)
            }
        })

        if (!findRole) {
            return res.status(401).json({message:"the assigned role does not exist"})
        }

        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(password, salt)

        const newControl = await prisma.controls.create({
            data:{
                name:name,
                email:email,
                roleId:Number(roleId),
                salt:salt,
                hash:hash
            }
        })
        return res.status(201).json(newControl)
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"server error"})
    }
})

//update controls
router.put("/admin/:id", authControls, async (req, res)=>{
    try {
        const id = req.params.id
        const {name, email, roleId, password} = req.body
        const update = req.body
        const control = await prisma.controls.findFirst({
            where:{
                id:Number(id)
            }
        })
        if (!control) {
            return res.status(404).json({message:"this user is not found"})
        }
        if (email !== control.email) {
            const findEmailExist = await prisma.controls.findFirst({
                where:{
                    email:email
                }
            })
            if (findEmailExist) {
                return res.status(409).json({message: "there is already a user control with this email"})
            }
        }

        const findRole = await prisma.role.findFirst({
            where:{
                id:Number(roleId)
            }
        })
        if (!findRole) {
            return res.status(409).json({message: "role not found"})
        }

        if (password) {
            const salt = bcrypt.genSaltSync(10)
            const hash = bcrypt.hashSync(password, salt)
            update.salt = salt
            update.hash = hash
        }

        delete update.password

        const updateControl = await prisma.controls.update({
            where:{
                id:Number(id)
            },
            data:update
        })
        return res.status(200).json(updateControl)
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"server error"})
    }
})

//get controls
router.get("/", authControls, authAdmin, async(req, res)=>{
    try {
        const controls = await prisma.controls.findMany({
            include:{
                role:true
            },
            orderBy:{
                id:"desc"
            }
        })
        // if (!controls) {
        //     return res.status(404).json({message:"no users added"})
        // }
        return res.status(200).json(controls)
    } catch (error) {
        console.log(error)
        res.status(404).json({message:"server error"})
    }
})

//get controls id
router.get("/:id", authControls, authAdmin, async(req, res)=>{
    try {
        const id = req.params.id
        const findUserControl = await prisma.controls.findFirst({
            where:{
                id:Number(id)
            },
            include:{
                role:true
            }
        })
        if (findUserControl) {
            return res.status(200).json(findUserControl)
        }
        return res.status(404).json({message: "user control is not found"})
    } catch (error) {
        console.log(error)
        res.status(404).json({message:"server error"})
    }
})

//---------------------------------------------------------//
//---------------------------------------------------------//
//---------------------------------------------------------//

// ROUTES FOR USERS CONTROLS


//login controls
router.post("/login", validateLogin, async (req, res)=>{
    try {
        const {email, password} = req.body

        const control = await prisma.controls.findFirst({
            where:{
                email:email
            },
            include:{
                role:true
            }
        })
        
        if (!control) {
            return res.status(404).json({message:"this email is not registered"})
        }

        const hashPassword = bcrypt.hashSync(password, control.salt)
        if (hashPassword==control.hash) {
            jwt.sign({control}, process.env.ADMIN_KEY, {expiresIn:"12h"}, (error, token)=>{
                if (error) {
                    console.log(error)
                    return res.status(404).json({message:"token not generated"})
                }
                return res.status(200).json({token: token, level: control.role.level})
            })
        }else{
            return res.status(401).json({message:"password incorrect"})
        }
    } catch (error) {
        console.log(error)
        res.status(404).json({message:"server error"})
    }
})

router.put("/", authControls, async (req, res)=>{
    try {
        const token = req.headers["authorization"].split(" ")[1]
        const id = await idTokenControl(token)
        console.log("aqui"+id)
        const data = req.body
        const control = await prisma.controls.findFirst({
            where:{
                id:Number(id)
            }
        })
        if (!control) {
            return res.status(404).json({message:"this user is not found"})
        }
        const updateControl = await prisma.controls.update({
            where:{
                id:Number(id)
            },
            data:data
        })
        return res.status(200).json(updateControl)
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"server error"})
    }
})

router.delete("/:id", authControls, async (req, res)=>{
    try {
        const id = req.params.id
        const exist = await prisma.controls.findFirst({
            where:{
                id:Number(id)
            }
        })
        if (!exist) {
            return res.status(404).json({message:"this user is not found"})
        }

        const deleteControl = await prisma.controls.delete({
            where:{
                id:Number(id)
            }
        })
        return res.status(200).json(deleteControl)

    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"server error"})
    }
})



module.exports = router