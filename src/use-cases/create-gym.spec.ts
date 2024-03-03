import { expect, describe, it, beforeEach } from 'vitest';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { CreateGymUseCase } from './create-gym';

let gymsRepository: InMemoryGymsRepository;
let sut: CreateGymUseCase;

describe('Create Gym Use Case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new CreateGymUseCase(gymsRepository);
  });

  it('should be able to register', async () => {
    const { gym } = await sut.execute({
      latitude: -22.129218,
      longitude: -45.012971,
      phone: null,
      title: 'Gym title',
      description: null,
    });

    expect(gym.id).toEqual(expect.any(String));
  });
});
