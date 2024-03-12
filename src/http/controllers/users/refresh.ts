import { FastifyRequest, FastifyReply } from 'fastify';

export async function refresh(request: FastifyRequest, reply: FastifyReply) {
  await request.jwtVerify({
    onlyCookie: true, // só vai verificar se o refreshToken está no cookie e nada mais
  });

  const token = await reply.jwtSign(
    {},
    {
      sign: {
        sub: request.user.sub,
      },
    }
  );

  const refreshToken = await reply.jwtSign(
    {},
    {
      sign: {
        sub: request.user.sub,
        expiresIn: '7d',
      },
    }
  );

  return reply
    .status(200)
    .setCookie('refreshToken', refreshToken, {
      path: '/',
      secure: true, // não vai conseguir ler o cookie se não for https/o front não acessa a string
      sameSite: true, // só vai enviar o cookie se a requisição for do mesmo site/dominio
      httpOnly: true, // somente o servidor pode ler o cookie
    })
    .send({
      token,
    });
}
