const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const auth = require("../middlewares/auth")
const Vcreate = require("../middlewares/create_inv")

//use invitation
router.get("/security/:cod", async (req, res) => {
  try {
    const cod = req.params.cod;
    const invitation = await prisma.invitations.findFirst({
      where: {
        cod: cod,
      },
    });
    if (invitation) {
      const validate = await prisma.invitations.update({
        where: {
          id: Number(invitation.id),
        },
        data: {
          used: true,
        },
      });
      return res.status(200).json(invitation);
    }
    return res.status(404).json({ message: "this invitation is not found" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "server error" });
  }
});

//all invitations admin
router.get("/admin/", async (req, res) => {
  try {
    const invitations = await prisma.invitations.findMany();
    if (invitations) {
      return res.status(200).json(invitations);
    }

    return res.status(404).json({ message: "there are no invitations" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "server error" });
  }
});

// find invitation admin
router.get("/admin/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const invitation = await prisma.invitations.findFirst({
      where: {
        id: Number(id),
      },
    });

    if (invitation) {
      const now = new Date();
      const minutes = Math.floor((invitation.expiresAt - now) / 60000);
      console.log(minutes);
      return res.status(200).json(invitation);
    }
    return res.status(404).json({ message: "this invitation is not found" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "server error" });
  }
});

//find invitations of user
router.get("/user", auth, async (req, res) => {
  try {
    var id = 1;
    const token = req.headers["authorization"].split(" ")[1];
    jwt.verify(token, process.env.LOCAL_KEY, async (error, data) => {
        if (error) {
          console.log(error)
          return res.status(404).json({ status: "no estás loggeado" });
        }
        id=data.user.id
      });
    const invitations = await prisma.invitations.findMany({
      where: {
        userId: Number(id),
      },
    });
    return res.status(200).json(invitations);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "server error" });
  }
});


//put expired
router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const exist = await prisma.invitations.findFirst({
      where: {
        id: Number(id),
      },
    });

    if (!exist) {
      return res.status(404).json({ message: "this invitation is not found" });
    }
    const now = new Date();
    const invitation = await prisma.invitations.update({
      where: {
        id: Number(id),
      },
      data: {
        expiresAt: now,
      },
    });
    return res.status(200).json(invitation);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "server error" });
  }
});

//all invitations
router.get("/", async (req, res) => {
  try {
    const invitations = await prisma.invitations.findMany();
    if (invitations) {
      return res.status(200).json(invitations);
    }

    return res.status(404).json({ message: "there are no invitations" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "server error" });
  }
});

//find invitation
router.get("/:id", auth, async (req, res) => {
  try {
    const id = req.params.id;
    const invitation = await prisma.invitations.findFirst({
      where: {
        id: Number(id),
      },
    });

    if (invitation) {
      const now = new Date();
      const minutes = Math.floor((invitation.expiresAt - now) / 60000);
      console.log(minutes);
      return res.status(200).json(invitation);
    }
    return res.status(404).json({ message: "this invitation is not found" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "server error" });
  }
});

//add invitation
router.post("/", auth, Vcreate, async (req, res) => {
  try {
    const { name, cedula, cellphone, board, description, expiresAt } = req.body;
    var userId = 0;
    const token = req.headers["authorization"].split(" ")[1];
    jwt.verify(token, process.env.LOCAL_KEY, async (error, data) => {
      if (error) {
        console.log(error);
        return res.status(404).json({ status: "no estás loggeado" });
      }
      userId = data.user.id;
      console.log(data);
    });

    const now = new Date();
    const expires = new Date(now.getTime() + expiresAt * 60000);
    const findUser = await prisma.user.findFirst({
      where: {
        id: Number(userId),
      },
    });
    if (!findUser) {
      return res.status(404).json({ message: "this user is not found" });
    }
    console.log(findUser);

    const findResidence = await prisma.residences.findFirst({
      where: {
        identifier: findUser.residenceIdenti,
      },
    });

    // const findResidence = await prisma.residences.findFirst({
    //     where:{
    //         id:Number(residenceId)
    //     }
    // })

    if (!findResidence) {
      return res.status(404).json({ message: "this residence is not found" });
    }

    const cod = `${userId}_${uuidv4()}`;

    const newInvitation = await prisma.invitations.create({
      data: {
        name,
        cedula,
        cod,
        cellphone,
        board,
        description,
        expiresAt: expires,
        userId,
        residenceId: findResidence.id,
      },
    });

    return res.status(201).json(newInvitation);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "server error" });
  }
});

//delete invitation
router.delete("/:id", auth, async (req, res) => {
  try {
    const id = req.params.id;
    exist = await prisma.invitations.findFirst({
      where: {
        id: Number(id),
      },
    });

    if (!exist) {
      return res.status(404).json({ message: "this invitation is not found" });
    }
    const deleteInvitation = await prisma.invitations.delete({
      where: {
        id: Number(id),
      },
    });

    return res.status(200).json(deleteInvitation);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "server error" });
  }
});

module.exports = router;
