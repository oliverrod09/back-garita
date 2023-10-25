const validate = (req, res, next) => {
    const { name, email, cedula, residenceIdenti, password } = req.body;

    if (!name) {
        return res.status(400).json({ message: "El campo 'nombre' no puede estar vacío" });
    }

    if (!email) {
        return res.status(400).json({ message: "El campo 'email' no puede estar vacío" });
    }

    if (!cedula) {
        return res.status(400).json({ message: "El campo 'cedula' no puede estar vacío" });
    }

    if (!residenceIdenti) {
        return res.status(400).json({ message: "El campo 'identificador de residencia' no puede estar vacío" });
    }

    if (!password) {
        return res.status(400).json({ message: "El campo 'contraseña' no puede estar vacío" });
    }

    next();
};

module.exports = validate