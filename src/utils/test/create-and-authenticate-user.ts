import { app } from '@/app';
import { prisma } from '@/lib/prisma';
import { hash } from 'bcryptjs';
import request from 'supertest';

export async function createAndAuthenticateUser(isAdmin = false) {
  await prisma.user.create({
    data: {
      name: 'Robson Arruda',
      email: 'robson@teste.com',
      password_hash: await hash('123456', 6),
      role: isAdmin ? 'ADMIN' : 'MEMBER',
    },
  });

  const authResponse = await request(app.server).post('/sessions').send({
    email: 'robson@teste.com',
    password: '123456',
  });

  const { token } = authResponse.body;

  return { token };
}
