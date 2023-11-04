const express = require("express")
const router = express.Router()
const {PrismaClient} = require("@prisma/client")
const prisma = new PrismaClient()
const authControls = require("../middlewares/authControls")
const authAdmin = require("../middlewares/authAdmin")


//all residences
router.get("/", authControls, authAdmin, async(req, res)=>{
    try {
        const allResidences = await prisma.residences.findMany()
        return res.status(200).json(allResidences)
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"server error"})
    }
})

//create residences
router.post("/", authControls, authAdmin, async (req, res)=>{
    try {
        const {number, address, identifier} = req.body

        const findNumber = await prisma.residences.findFirst({
            where:{
                number:number
            }
        })

        if (findNumber) {
            return res.status(409).json({message:"there is already a residence with this number"})
        }

        const findIdentifier = await prisma.residences.findFirst({
            where:{
                identifier:identifier
            }
        })

        if (findIdentifier) {
            return res.status(409).json({message:"there is already a residence with this identifier"})
        }

        const newResidence = await prisma.residences.create({
            data:{
                number,
                address,
                identifier
            }
        })
        return res.status(201).json(newResidence)
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"server error"})
    }
})

//find residence
router.get("/:id", authControls, async (req, res)=>{
    try {
        const id = req.params.id
        const findResidence = await prisma.residences.findFirst({
            where:{
                id:Number(id)
            }
        })
        if (findResidence) {
            return res.status(200).json(findResidence)
        }else{
            return res.status(404).json({message:"this residence is not found"})
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"server error"})
    }
})

//update residence
router.put("/:id", authControls, authAdmin, async (req, res)=>{
    try {
        const update = req.body
        const id = req.params.id

        const exist = await prisma.residences.findFirst({
            where:{
                id:Number(id)
            }
        })

        if (!exist) {
            return res.status(404).json({message:"this residence is not found"})
        }

        const updateResidence = await prisma.residences.update({
            where:{
                id:Number(id)
            },
            data:update
        })
        return res.status(200).json(updateResidence)
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"server error"})
    }
})

//delete residence
router.delete("/:id", authControls, authAdmin, async (req, res)=>{
    try {
        const id = req.params.id
        const exist = await prisma.residences.findFirst({
            where:{
                id:Number(id)
            }
        })

        if (!exist) {
            return res.status(404).json({message:"this residence is not found"})
        }

        const deleteInvitation = await prisma.invitations.deleteMany({
            where:{
                residenceId:Number(id)
            }
        }) 
        const deleteUser = await prisma.user.deleteMany({
            where:{
                residenceIdenti:exist.identifier
            }
        })
        const deleteResidence = await prisma.residences.delete({
            where:{
                id:Number(id)
            }
        })
        return res.status(200).json(deleteResidence)

    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"server error"})
    }
})

module.exports = router