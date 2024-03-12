import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials-erro';
import { makeAuthenticateUseCase } from '@/use-cases/factories/make-authenticate-use-case';
import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const authenticateBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  });

  const { email, password } = authenticateBodySchema.parse(request.body);

  try {
    const authenticateUseCase = makeAuthenticateUseCase();

    const { user } = await authenticateUseCase.execute({ email, password });

    const token = await reply.jwtSign(
      {},
      {
        sign: {
          sub: user.id,
        },
      }
    );

    const refreshToken = await reply.jwtSign(
      {},
      {
        sign: {
          sub: user.id,
          expiresIn: '7d',
        },
      }
    );

    return reply
      .status(200)
      .setCookie('refreshToken', refreshToken, {
        path: '/',
        secure: true, // não vai conseguir ler o cookie se não for https/o front não acessa a string
        sameSite: true, // só vai enviar o cookie se a requisição for do mesmo site
        httpOnly: true, // somente o servidor pode ler o cookie
      })
      .send({
        token,
      });
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return reply.status(400).send({
        message: error.message,
      });
    }

    throw error;
  }
}
