import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import authConfig from '../config/auth';

export default async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if(!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const user = await promisify(jwt.verify)(token, authConfig.secret);

        req.user = user;
        next();
    } catch (err) {
        return res.status(403).json({ message: "Unauthorized" });
    }
}