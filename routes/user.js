const express = require("express");
const router = express.Router();
const {PrismaClient} = require("@prisma/client")
const prisma = new PrismaClient()


//ROUTES OF USERS FOR ADMINS

//all users for admin
router.get("/admin", async (req, res)=>{
    try {
        const allUsers = await prisma.user.findMany()
        if (allUsers) {
            return res.status(200).json(allUsers)
        }else{
            return res.status(404).json({message: "there are no users"})
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"server error"})
    }
})

//find user for admin
router.get("/admin/:id", async (req, res)=>{
    try {
        const id = req.params.id
        const findUser = await prisma.user.findFirst({
            where:{
                id:Number(id)
            }
        })
        if (findUser) {
            return res.status(200).json(findUser)
        }else{
            return res.status(404).json({message: "this user is not found"})
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"server error"})
    }
})

//create user for admin
router.post("/admin", async (req, res)=>{
    try {
        const {name, email, cedula, residenceIdenti} = req.body

        const findEmail = await prisma.user.findFirst({
            where:{
                email:email
            }
        })

        if (findEmail) {
            return res.status(409).json({message:"there is already a residence with this email"})
        }

        const findCedula = await prisma.user.findFirst({
            where:{
                cedula:cedula
            }
        })

        if (findCedula) {
            return res.status(409).json({message:"there is already a residence with this cedula"})
        }

        const findIdentifier = await prisma.residences.findFirst({
            where:{
                identifier:residenceIdenti
            }
        })

        if (!findIdentifier) {
            return res.status(404).json({message:"there is no residence with this identifier"})
        }

        const newUser = await prisma.user.create({
            data:{
                name,
                email,
                cedula,
                residenceIdenti
            }
        })
        return res.status(201).json(newUser)

    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"server error"})
    }
})

//update user for admin
router.put("/admin/:id", async (req, res)=>{
    try {
        const id = req.params.id
        const update = req.body
        const {name, email, cedula, residenceIdenti} = req.body
        const exist = await prisma.user.findFirst({
            where:{
                id:Number(id)
            }
        })

        if (!exist) {
            return res.status(404).json({message:"this user is not found"})
        }

        const findEmail = await prisma.user.findFirst({
            where:{
                email:email
            }
        })

        if (findEmail) {
            return res.status(409).json({message:"there is already a residence with this email"})
        }

        const findCedula = await prisma.user.findFirst({
            where:{
                cedula:cedula
            }
        })

        if (findCedula) {
            return res.status(409).json({message:"there is already a residence with this cedula"})
        }

        const findIdentifier = await prisma.residences.findFirst({
            where:{
                identifier:residenceIdenti
            }
        })

        if (!findIdentifier) {
            return res.status(404).json({message:"there is no residence with this identifier"})
        }

        

        const updateUser = await prisma.user.update({
            where:{
                id:Number(id)
            },
            data:update
        })
        return res.status(200).json(updateUser)
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"server error"})
    }
})

//delete user for admin
router.delete("/admin/:id", async (req, res)=>{
    try {
        const id = req.params.id

        const exist = await prisma.user.findFirst({
            where:{
                id:Number(id)
            }
        })

        if (!exist) {
            return res.status(404).json({message:"this user is not found"})
        }

        const deleteUser = await prisma.user.delete({
            where:{
                id:Number(id)
            }
        })

        return res.status(200).json(deleteUser)
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"server error"})
    }
})

//---------------------------------------------------------//
//---------------------------------------------------------//
//---------------------------------------------------------//

// ROUTES FOR USERS ONLY

//all users
// router.get("/", async (req, res)=>{
//     try {
//         const allUsers = await prisma.user.findMany()
//         if (allUsers) {
//             return res.status(200).json(allUsers)
//         }else{
//             return res.status(404).json({message: "there are no users"})
//         }
//     } catch (error) {
//         console.log(error)
//         return res.status(500).json({message:"server error"})
//     }
// })

//find user
router.get("/:id", async (req, res)=>{
    try {
        const id = req.params.id
        const findUser = await prisma.user.findFirst({
            where:{
                id:Number(id)
            }
        })
        if (findUser) {
            return res.status(200).json(findUser)
        }else{
            return res.status(404).json({message: "this user is not found"})
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"server error"})
    }
})

//create user for user
router.post("/", async (req, res)=>{
    try {
        const {name, email, cedula, residenceIdenti} = req.body

        const findEmail = await prisma.user.findFirst({
            where:{
                email:email
            }
        })

        if (findEmail) {
            return res.status(409).json({message:"there is already a residence with this email"})
        }

        const findCedula = await prisma.user.findFirst({
            where:{
                cedula:cedula
            }
        })

        if (findCedula) {
            return res.status(409).json({message:"there is already a residence with this cedula"})
        }

        const findIdentifier = await prisma.residences.findFirst({
            where:{
                identifier:residenceIdenti
            }
        })

        if (!findIdentifier) {
            return res.status(404).json({message:"there is no residence with this identifier"})
        }

        const newUser = await prisma.user.create({
            data:{
                name,
                email,
                cedula,
                residenceIdenti
            }
        })
        return res.status(201).json(newUser)

    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"server error"})
    }
})

//update user for user
router.put("/:id", async (req, res)=>{
    try {
        const id = req.params.id
        const update = req.body
        const {name, email, cedula, residenceIdenti} = req.body
        const exist = await prisma.user.findFirst({
            where:{
                id:Number(id)
            }
        })

        if (!exist) {
            return res.status(404).json({message:"this user is not found"})
        }

        const findEmail = await prisma.user.findFirst({
            where:{
                email:email
            }
        })

        if (findEmail) {
            return res.status(409).json({message:"there is already a residence with this email"})
        }

        const findCedula = await prisma.user.findFirst({
            where:{
                cedula:cedula
            }
        })

        if (findCedula) {
            return res.status(409).json({message:"there is already a residence with this cedula"})
        }

        const findIdentifier = await prisma.residences.findFirst({
            where:{
                identifier:residenceIdenti
            }
        })

        if (!findIdentifier) {
            return res.status(404).json({message:"there is no residence with this identifier"})
        }

        

        const updateUser = await prisma.user.update({
            where:{
                id:Number(id)
            },
            data:update
        })
        return res.status(200).json(updateUser)
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"server error"})
    }
})

//delete user for user
router.delete("/:id", async (req, res)=>{
    try {
        const id = req.params.id

        const exist = await prisma.user.findFirst({
            where:{
                id:Number(id)
            }
        })

        if (!exist) {
            return res.status(404).json({message:"this user is not found"})
        }

        const deleteUser = await prisma.user.delete({
            where:{
                id:Number(id)
            }
        })

        return res.status(200).json(deleteUser)
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"server error"})
    }
})





module.exports = router