const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');


class UserControl {
    // function to register a user
    static register_post = async (req, res) => {
        const userData = req.body;
        try {
            const existingUser = await userModel.findOne({ email: userData.email });
            if (existingUser) {
                res.status(409).json({ error: 'Email already registered' });
            }
            else {
                const newUser = new userModel(userData);
                await newUser.save();
                res.status(201).json({ message: 'Registration successful' });
            }
        }
        catch (err) {
            res.status(500).json({ error: 'Registration failed' });
        }
    }

    // function to login a user
    static login_post = async (req, res) => {
        const { email, password } = req.body;
        try {
            const existingUser = await userModel.findOne({ email });
            if (existingUser) {
                // Compare the provided password with the hashed password in the database
                const passwordMatch = await bcrypt.compare(password, existingUser.password);
                if (passwordMatch) {
                    res.status(200).json({ message: 'Login successful', existingUser });
                }
                else {
                    res.status(401).json({ error: 'Password is incorrect' });
                }
            }
            else{
                res.status(404).json({ error: 'Email is incorrect' });
            }
        }
        catch (err) {
            res.status(500).json({ error: 'Login failed' });
        }
    }

    // function to reset password
    static reset_pass_post = async (req, res) => {
        const { email, name, password } = req.body;

        try {
            const existingUser = await userModel.findOne({ email });
            if (!existingUser) {
                res.status(404).json({ error: 'Email does not exist' });
            }
            else {
                // Hash the new password before updating it in the database
                const salt = await bcrypt.genSalt(12);
                const hash = await bcrypt.hash(password, salt);
                await userModel.updateOne(
                    { email },
                    {
                        $set: { password: hash }
                    }
                )
                res.status(200).json({ message: 'Password reset successful' });
            }

        } catch (err) {
            res.status(500).json({ error: 'Password reset failed' });
        }
    }

    // function to hash confirm password
    static hash_password = async (req, res) => {
        const { password, saltRounds } = req.body;
        try {
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            res.status(200).json({ hashedPassword });
        } catch (err) {
            res.status(500).json({ error: 'Password hashing failed' });
        }
    }
}

module.exports = UserControl;