const validate = (req, res, next) => {
    const { name, cedula, cellphone, board, description, expiresAt } = req.body;

    if (!name) {
        return res.status(400).json({ message: "El campo 'nombre' no puede estar vacío" });
    }

    if (!cedula) {
        return res.status(400).json({ message: "El campo 'cedula' no puede estar vacío" });
    }

    if (!cellphone) {
        return res.status(400).json({ message: "El campo 'telefono' no puede estar vacío" });
    }

    if (!board) {
        return res.status(400).json({ message: "El campo 'placa' no puede estar vacío" });
    }

    if (!description) {
        return res.status(400).json({ message: "El campo 'descripcion' no puede estar vacío" });
    }

    if (!expiresAt) {
        return res.status(400).json({ message: "El campo 'expirar' no puede estar vacío" });
    }

    next();
};

module.exports = validate