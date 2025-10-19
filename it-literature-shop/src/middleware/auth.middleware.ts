// sebagai satpam untuk GET /me

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../db';

export interface AuthRequest extends Request {
    user?: { id: string; email: string };
}

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            message: "Authorization header missing or malformed",
        });
    }
    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET as string
        ) as { userId: string; email: string };

        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: { id: true, email: true },
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found",
            });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Error verifying token:", error);
        res.status(401).json({
            success: false,
            message: "Invalid token",
        });
    }
};