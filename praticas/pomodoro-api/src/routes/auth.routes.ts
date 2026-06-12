import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { prisma } from '../lib/prisma';

const authRoutes = Router();

authRoutes.post(
  '/register',
  async (request, response) => {
    const {
      name,
      email,
      password,
    } = request.body;

    const userAlreadyExists =
      await prisma.user.findUnique({
        where: {
          email,
        },
      });

    if (userAlreadyExists) {
      return response.status(400).json({
        error: 'Usuário já existe',
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return response.status(201).json(user);
  },
);

authRoutes.post(
  '/login',
  async (request, response) => {
    const { email, password } =
      request.body;

    const user =
      await prisma.user.findUnique({
        where: {
          email,
        },
      });

    if (!user) {
      return response.status(401).json({
        error:
          'Email ou senha inválidos',
      });
    }

    const passwordMatch =
      await bcrypt.compare(
        password,
        user.password,
      );

    if (!passwordMatch) {
      return response.status(401).json({
        error:
          'Email ou senha inválidos',
      });
    }

    const token = jwt.sign(
      {
        userId: user.id,
      },
      'secret-key',
      {
        expiresIn: '1d',
      },
    );

    return response.json({
      token,

      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  },
);

authRoutes.post(
  '/forgot-password',
  async (request, response) => {
    const { email } = request.body;

    const user =
      await prisma.user.findUnique({
        where: {
          email,
        },
      });

    if (!user) {
      return response.status(404).json({
        error: 'Usuário não encontrado',
      });
    }

    const resetToken = jwt.sign(
      {
        userId: user.id,
      },
      'reset-password-secret',
      {
        expiresIn: '15m',
      },
    );

    return response.json({
      message:
        'Token gerado com sucesso',

      token: resetToken,
    });
  },
);

authRoutes.post(
  '/reset-password',
  async (request, response) => {
    const { token, password } =
      request.body;

    try {
      const decoded = jwt.verify(
        token,
        'reset-password-secret',
      ) as {
        userId: number;
      };

      const hashedPassword =
        await bcrypt.hash(password, 10);

      await prisma.user.update({
        where: {
          id: decoded.userId,
        },

        data: {
          password: hashedPassword,
        },
      });

      return response.json({
        message:
          'Senha alterada com sucesso',
      });
    } catch {
      return response.status(400).json({
        error: 'Token inválido',
      });
    }
  },
);

export { authRoutes };