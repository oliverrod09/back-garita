const express = require("express");
const router = express.Router();
const {PrismaClient} = require("@prisma/client")
const prisma = new PrismaClient()


//all invitations
router.get("/", async (req, res)=>{
    try {
        const invitations = await prisma.invitations.findMany()
        if (invitations) {
            return res.status(200).json(invitations)
        }

        return res.status(404).json({message: "there are no invitations"})
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"server error"})
    }
})

//find invitation
router.get("/:id", async (req, res)=>{
    try {
        const id = req.params.id
        const invitation = await prisma.invitations.findFirst({
            where:{
                id: Number(id)
            }
        })


        if (invitation) {
            // const now = new Date()
            // const minutes = Math.floor((invitation.expiresAt-now)/60000)
            // console.log(minutes)
            return res.status(200).json(invitation)
            
        }
        return res.status(404).json({message: "this user is not found"})

    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"server error"})
    }
})


//add invitation
router.post("/", async (req, res)=>{
    try {
        const {name, cedula, cellphone, board, description, expiresAt, userId, residenceId} = req.body
        const now = new Date()
        const expires = new Date(now.getTime() +(expiresAt * 60000))
        const findUser = await prisma.user.findFirst({
            where:{
                id:Number(userId)
            }
        })

        if (!findUser) {
            return res.status(404).json({message:"this user is not found"})
        }

        const findResidence = await prisma.residences.findFirst({
            where:{
                id:Number(residenceId)
            }
        })

        if (!findResidence) {
            return res.status(404).json({message:"this residence is not found"})
        }

        
        const newInvitation = await prisma.invitations.create({
            data:{
                name,
                cedula,
                cellphone,
                board,
                description,
                expiresAt:expires,
                userId,
                residenceId
            }
        })

        return res.status(201).json(newInvitation)
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"server error"})
    }
})



module.exports = router