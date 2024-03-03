import { GymsRepository } from '@/repositories/gyms-repository';
import { Gym, Prisma } from '@prisma/client';
import { randomUUID } from 'node:crypto';

export class InMemoryGymsRepository implements GymsRepository {
  public gyms: Gym[] = [];

  async create(data: Prisma.GymCreateInput) {
    const newGym: Gym = {
      id: data.id ?? randomUUID(),
      title: data.title,
      description: data.description ?? null,
      phone: data.phone ?? null,
      latitude: new Prisma.Decimal(data.latitude.toString()),
      longitude: new Prisma.Decimal(data.longitude.toString()),
    };

    this.gyms.push(newGym);

    return newGym;
  }

  async findById(id: string) {
    const gym = this.gyms.find((item) => item.id === id);

    if (!gym) {
      return null;
    }

    return gym;
  }
}
