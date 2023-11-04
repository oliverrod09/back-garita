const express = require("express")
const router = express.Router();
const {PrismaClient} = require("@prisma/client")
const prisma = new PrismaClient()
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const validateLogin = require("../middlewares/empty/validateLogin")
const authControls = require("../middlewares/authControls")
const authAdmin = require("../middlewares/authAdmin")

router.get("/", authControls, authAdmin,  async(req, res)=>{
    try {
        const roles = await prisma.role.findMany()
        if (!roles) {
            return res.status(401).json({message:"you need to create a role first"})
        }
        return res.status(200).json(roles)
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"server error"})
    }
})

router.post("/", authControls, authAdmin, async (req, res)=>{
    try {
        const {name, level} = req.body 
        const findName = await prisma.role.findFirst({
            where:{
                name:name
            }
        })
        if (findName) {
            return res.status(401).json({message:"this role name already exists"})
        }

        const newRole = await prisma.role.create({
            data:{
                name:name,
                level:level
            }
        })

        return res.status(201).json(newRole)
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"server error"})
    }
})

router.delete("/:id", authControls, authAdmin, async (req, res)=>{
    try {
        const id = req.params.id
        const exist = await prisma.role.findFirst({
            where:{
                id:Number(id)
            }
        })

        if (!exist) {
            return res.status(404).json({message:"this role is not found"})
        }

        const deleteControl = await prisma.controls.deleteMany({
            where:{
                roleId:Number(id)
            }
        })

        const deleteRole = await prisma.role.delete({
            where:{
                id: Number(id)
            }
        })
        return res.status(200).json(deleteRole)
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"server error"})
    }
})

module.exports = router