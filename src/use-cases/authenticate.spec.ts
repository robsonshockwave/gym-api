import { expect, describe, it } from 'vitest';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { AuthenticateUseCase } from './authenticate';
import { hash } from 'bcryptjs';
import { InvalidCredentialsError } from './errors/invalid-credentials-erro';

describe('Authenticate Use Case', () => {
  it('should be able to authenticate', async () => {
    const usersRepository = new InMemoryUsersRepository();
    const sut = new AuthenticateUseCase(usersRepository);

    await usersRepository.create({
      name: 'Robson Teste',
      email: 'robson@teste.com',
      password_hash: await hash('123456', 6),
    });

    const { user } = await sut.execute({
      email: 'robson@teste.com',
      password: '123456',
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it('should not be able to authenticate with wrong email', async () => {
    const usersRepository = new InMemoryUsersRepository();
    const sut = new AuthenticateUseCase(usersRepository);

    await expect(
      async () =>
        await sut.execute({
          email: 'robson@teste.com',
          password: '123456',
        })
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it('should not be able to authenticate with wrong password', async () => {
    const usersRepository = new InMemoryUsersRepository();
    const sut = new AuthenticateUseCase(usersRepository);

    await usersRepository.create({
      name: 'Robson Teste',
      email: 'robson@teste.com',
      password_hash: await hash('123456', 6),
    });

    await expect(
      async () =>
        await sut.execute({
          email: 'robson@teste.com',
          password: '12345678910',
        })
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});
