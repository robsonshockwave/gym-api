import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { expect, describe, it, beforeEach } from 'vitest';
import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms';

let gymsRepository: InMemoryGymsRepository;
let sut: FetchNearbyGymsUseCase;

describe('Fetch Nearby Gyms Use Case', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new FetchNearbyGymsUseCase(gymsRepository);
  });

  it('should be able to fetch nearby gyms', async () => {
    await gymsRepository.create({
      title: 'Near Gym 1',
      description: null,
      phone: null,
      latitude: -22.114991,
      longitude: -45.057684,
    });

    await gymsRepository.create({
      title: 'Near Gym 2',
      description: null,
      phone: null,
      latitude: -22.129218,
      longitude: -45.012971,
    });

    await gymsRepository.create({
      title: 'Far Gym 1',
      description: null,
      phone: null,
      latitude: -27.114991,
      longitude: -49.057684,
    });

    const { gyms } = await sut.execute({
      userLatitude: -22.114991,
      userLongitude: -45.057684,
    });

    expect(gyms).toHaveLength(2);
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Near Gym 1' }),
      expect.objectContaining({ title: 'Near Gym 2' }),
    ]);
  });
});
