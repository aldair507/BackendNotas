import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createAccessToken } from '../libs/jwt.js';
import { TOKEN_SECRET } from '../config.js';

// Handler para el registro de un nuevo usuario
export const register = async (req, res) => {
    const { email, password, username } = req.body;

    try {
        // Verificar si el correo ya existe
        const userFound = await User.findOne({ email });
        if (userFound) {
            return res.status(400).json({ errors: ["The email already exists"] });
        }

        // Hash de la contraseña
        const passwordHash = await bcrypt.hash(password, 10);

        // Crear un nuevo usuario
        const newUser = new User({
            username,
            email,
            password: passwordHash,
        });

        // Guardar el usuario en la base de datos
        const userSaved = await newUser.save();
        const token = createAccessToken({ id: userSaved._id });

        // Configurar la cookie de autenticación
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'none'
        });

        // Responder con la información del usuario
        return res.status(201).json({
            id: userSaved._id,
            username: userSaved.username,
            email: userSaved.email,
            createdAt: userSaved.createdAt,
            updatedAt: userSaved.updatedAt,
        });

    } catch (err) {
        console.error('Error in register function:', err);
        return res.status(500).json({ message: 'An error occurred during registration' });
    }
};

// Handler para el inicio de sesión
export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Buscar el usuario por correo
        const userFound = await User.findOne({ email });
        if (!userFound) {
            return res.status(400).json({ message: "User not found" });
        }

        // Comparar la contraseña proporcionada con la almacenada
        const isMatch = await bcrypt.compare(password, userFound.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Incorrect password" });
        }

        // Crear un nuevo token de acceso
        const token = createAccessToken({ id: userFound._id });
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'none'
        });

        // Responder con la información del usuario
        return res.json({
            id: userFound._id,
            username: userFound.username,
            email: userFound.email,
            createdAt: userFound.createdAt,
            updatedAt: userFound.updatedAt,
        });

    } catch (err) {
        console.error('Error in login function:', err);
        return res.status(500).json({ message: 'An error occurred during login' });
    }
};

// Handler para cerrar sesión
export const logout = (req, res) => {
    res.clearCookie('token');
    return res.sendStatus(200);
};

// Handler para obtener el perfil del usuario
export const profile = async (req, res) => {
    try {
        const userFound = await User.findById(req.user.id);
        if (!userFound) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.json({
            id: userFound._id,
            username: userFound.username,
            email: userFound.email,
            createdAt: userFound.createdAt,
            updatedAt: userFound.updatedAt,
        });

    } catch (err) {
        console.error('Error fetching user profile:', err);
        return res.status(500).json({ message: 'An error occurred while fetching the profile' });
    }
};

// Handler para verificar el token de acceso
export const verifyToken = async (req, res) => {
    const { token } = req.cookies;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    jwt.verify(token, TOKEN_SECRET, async (err, user) => {
        if (err) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        try {
            const userFound = await User.findById(user.id);
            if (!userFound) {
                return res.status(401).json({ message: 'Unauthorized' });
            }

            return res.json({
                id: userFound._id,
                username: userFound.username,
                email: userFound.email,
            });

        } catch (err) {
            console.error('Error finding user for token verification:', err);
            return res.status(500).json({ message: 'An error occurred during token verification' });
        }
    });
};
