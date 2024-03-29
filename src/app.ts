import fastify from 'fastify';
import fastifyCookie from '@fastify/cookie';
import { ZodError } from 'zod';
import { env } from './env';
import fastifyJwt from '@fastify/jwt';
import { usersRoutes } from './http/controllers/users/routes';
import { gymsRoutes } from './http/controllers/gyms/routes';
import { checkInsRoutes } from './http/controllers/check-ins/routes';
import cors from '@fastify/cors';

export const app = fastify();

app.register(cors, {
  origin: true,
  credentials: true,
});

{
  /** No front-end é preciso adicionar o seguinte código para conseguir setar o refreshToken nos cookies do navegador:
   * const api = axios.create({
   *  baseURL: 'http://localhost:3333',
   *  withCredentials: true,
   * })
   */
}

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: 'refreshToken',
    signed: false, // o cookie não vai ser assinado e validado se foi gerado pelo servidor
  },
  sign: {
    expiresIn: '10m',
  },
});

app.register(fastifyCookie);

app.register(usersRoutes);
app.register(gymsRoutes);
app.register(checkInsRoutes);

app.setErrorHandler((error, request, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: 'Validation error',
      issues: error.format(),
    });
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error);
  } else {
    // TODO: Send error to monitoring service - Datadog, Sentry, New Relic, etc
  }

  return reply.status(500).send({
    message: 'Internal server error',
  });
});
