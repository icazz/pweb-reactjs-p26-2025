import { Request, Response } from 'express';
import prisma from '../db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'; // Impor JWT
import { AuthRequest } from '../middleware/auth.middleware';


// KOKI UNTUK REGISTER
export const register = async (req: Request, res: Response) => {
    const { email, password, username } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Email and password are required",
        });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                username: username,
            },
        });

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: { id: newUser.id, email: newUser.email, created_at: newUser.createdAt },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

// --- KOKI UNTUK LOGIN ---
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email dan password wajib diisi',
    });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email }, 
      process.env.JWT_SECRET as string, 
      { expiresIn: '1d' }
    );

    res.status(200).json({
      success: true,
      message: 'Login successfully',
      data: {
        access_token: token,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// KOKI UNTUK GET ME
export const getMe = async (req: AuthRequest, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Get me successfully',
    data: req.user,
  });
};