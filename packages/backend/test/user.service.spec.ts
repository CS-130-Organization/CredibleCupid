import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../src/user/user.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User, Gender, SexualOrientation, Referral } from '../src/database/entities';
import { DataSource } from 'typeorm';
import { ProfileValidator } from '../src/scripts/profileValidator';

jest.mock('../src/scripts/profileValidator');

describe('UserService', () => {
  let userService: UserService;
  let userRepository: Repository<User>;

  const mockUserRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
  };

  const mockDataSource = {
    transaction: jest.fn((callback) => callback({ findOne: jest.fn(), save: jest.fn() })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: DataSource, useValue: mockDataSource },
        { provide: getRepositoryToken(User), useValue: mockUserRepository },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('find_user_with_email', () => {
    it('should return a user when found', async () => {
      const mockUser = { email: 'test@example.com' } as User;
      mockUserRepository.findOne.mockResolvedValue(mockUser);

      const result = await userService.find_user_with_email('test@example.com');
      expect(result).toEqual(mockUser);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
    });

    it('should return null if user not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      const result = await userService.find_user_with_email('nonexistent@example.com');
      expect(result).toBeNull();
    });
  });

  describe('create_user', () => {
    it('should create and return a new user', async () => {
      const newUser = { email: 'test@example.com', password: 'hashedpassword' } as User;
      mockUserRepository.save.mockResolvedValue(newUser);

      const result = await userService.create_user('test@example.com', 'hashedpassword');
      expect(result).toEqual(newUser);
    });

    it('should return null if user already exists with credibility score > 0', async () => {
      const existingUser = { email: 'test@example.com', credibility_score: 10 } as User;
      mockUserRepository.findOne.mockResolvedValue(existingUser);

      const result = await userService.create_user('test@example.com', 'password');
      expect(result).toBeNull();
    });
  });

  describe('Prevent male user from updating bio without 3 referrals', () => {
    it('should update user bio successfully', async () => {
      const mockUser = { email: 'test@example.com', guid: '123', referrals: [] as Referral[], gender: Gender.kFemale } as User;
      mockDataSource.transaction
        .mockImplementationOnce(async (cb) => {
          return cb({
            findOne: jest.fn().mockResolvedValue(mockUser),
            find: jest.fn().mockResolvedValue([]),
            save: jest.fn(),
          });
        })
        .mockImplementationOnce(async (cb) => {
          return cb({
            findOne: jest.fn().mockResolvedValue(mockUser),
            find: jest.fn().mockResolvedValue([]),
            save: jest.fn(),
          });
        })
        .mockImplementationOnce(async (cb) => {
          return cb({
            findOne: jest.fn().mockResolvedValue(mockUser),
            find: jest.fn().mockResolvedValue([mockUser, mockUser, mockUser]),
            save: jest.fn(),
          });
        });

      (ProfileValidator.validateText as jest.Mock).mockResolvedValue(90);

      let result = await userService.update_user_bio(
        '123',
        'John',
        'Doe',
        'Bio',
        Gender.kFemale,
        'She/Her',
        SexualOrientation.kStraight,
        Date.now(),
        1800,
        'Engineer',
      );

      expect(result.ok).toBe(true);

      result = await userService.update_user_bio(
        '123',
        'John',
        'Doe',
        'Bio',
        Gender.kMale,
        'He/Him',
        SexualOrientation.kStraight,
        Date.now(),
        1800,
        'Engineer',
      );

      expect(result.ok).toBe(false);

      result = await userService.update_user_bio(
        '123',
        'John',
        'Doe',
        'Bio',
        Gender.kMale,
        'He/Him',
        SexualOrientation.kStraight,
        Date.now(),
        1800,
        'Engineer',
      );

      expect(result.ok).toBe(true);
    });

    it('Dont update bio if user doesnt exist', async () => {
      mockDataSource.transaction.mockImplementationOnce(async (cb) => {
        return cb({
          findOne: jest.fn().mockResolvedValue(null),
        });
      });

      const result = await userService.update_user_bio(
        '123',
        'John',
        'Doe',
        'Bio',
        Gender.kMale,
        'He/Him',
        SexualOrientation.kStraight,
        Date.now(),
        1800,
        'Engineer',
      );

      expect(result.err).toBe(true);
      expect(result.val).toBe('User does not exist!');
    });
  });
});