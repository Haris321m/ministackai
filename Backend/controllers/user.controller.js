import user from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import {compare} from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config({ override: true });

async function createUser(req, res) {
    const data = req.body;
    try {
        console.log(data)
        const newU=await user.createuser(data)
        console.log(newU)
        const token=jwt.sign({ id: newU.Id, email: newU.Email , role: newU.Role }, process.env.JWT_SECRET , { expiresIn: '30d' })
        res.status(201).json({newU, token});
    } catch (error) {
        res.status(500).json({ error: 'Failed to create user', details: error.message });
    }
}

function getUserById(req, res) {
    const id = parseInt(req.params.id, 10);
    user.getuserById(id)
        .then((user) => {
            if (user) {
                res.status(200).json(user);
            } else {
                res.status(404).json({ error: 'User not found' });
            }
        })
        .catch((error) => {
            res.status(500).json({ error: 'Failed to retrieve user', details: error.message });
        });
}

function getAllUsers(req, res) {
    user.getAllUsers()
        .then((users) => {
            res.status(200).json(users);
        })
        .catch((error) => {
            res.status(500).json({ error: 'Failed to retrieve users', details: error.message });
        });
}
async function updateUser(req, res) {
    const id = parseInt(req.params.id, 10);
    const data = req.body;
    await user.updateUser(id, data)
        .then((user) => {
            if (user) {
                res.status(200).json(user);
            } else {
                res.status(404).json({ error: 'User not found' });
            }
        })
        .catch((error) => {
            res.status(500).json({ error: 'Failed to update user', details: error.message });
        });
}

async function deleteUser(req, res) {
    const id = parseInt(req.params.id, 10);
    await user.deleteUser(id)
        .then((user) => {
            if (user) {
                res.status(200).json({ message: 'User deleted successfully' });
            } else {
                res.status(404).json({ error: 'User not found' });
            }
        })
        .catch((error) => {
            res.status(500).json({ error: 'Failed to delete user', details: error.message });
        });
}

async function LoginUser(req, res) {
    try {
        console.log(req.body)
        const { email, password } = req.body;
    
        const dbuser=await user.loginUser(email)
        console.log(dbuser)
        if(!dbuser){
            return res.status(401).json({ error: 'Invalid email' });
        }
        const isMatch=await compare(password, dbuser.PasswordHash)
        console.log(isMatch)
        if(!isMatch){
            return res.status(401).json({ error: 'Invalid password' });
        }
        const token=jwt.sign({ id: dbuser.Id, email: dbuser.Email, role:dbuser.Role  }, process.env.JWT_SECRET , { expiresIn: '30d' })
        console.log('Login successful:', dbuser,token);
        res.status(200).json({dbuser, token});       
    } catch (error) {
        res.status(500).json({ error: 'Login failed', details: error.message });
    }
}

export default {
    createUser,
    getUserById,
    getAllUsers,
    updateUser,
    deleteUser,
    LoginUser
};