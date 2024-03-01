import { Prisma, User } from '@prisma/client';
import { UsersRepository } from '../users-repository';
import { randomUUID } from 'node:crypto';

export class InMemoryUsersRepository implements UsersRepository {
  private users: User[] = [];

  async create(data: Prisma.UserCreateInput) {
    const newUser: User = {
      id: randomUUID(),
      name: data.name,
      email: data.email,
      password_hash: data.password_hash,
      created_at: new Date(),
    };

    this.users.push(newUser);

    return newUser;
  }

  async findByEmail(email: string) {
    const user = this.users.find((u) => u.email === email);

    return user || null;
  }
}
