import { app } from '@/app';
import request from 'supertest';

export async function createAndAuthenticateUser() {
  await request(app.server).post('/users').send({
    name: 'Robson Arruda',
    email: 'robson@teste.com',
    password: '123456',
  });

  const authResponse = await request(app.server).post('/sessions').send({
    email: 'robson@teste.com',
    password: '123456',
  });

  const { token } = authResponse.body;

  return { token };
}
