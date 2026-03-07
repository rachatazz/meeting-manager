import bcrypt from 'bcryptjs';
import {
  register,
  login,
  registerGuest,
  loginGuest,
  refreshAccessToken,
  logout,
} from '../../src/services/auth.service';
import { User } from '../../src/models/User';
import { ValidationError, UnauthorizedError } from '../../src/utils/errors';
import { setupTestDB, teardownTestDB } from '../helpers/db';

beforeAll(async () => {
  await setupTestDB();
});

afterAll(async () => {
  await teardownTestDB();
});

beforeEach(async () => {
  await User.deleteMany({});
});

const validInput = {
  email: 'test@example.com',
  password: 'SecurePass123!',
  fullName: 'Test User',
  role: 'recruiter' as const,
};

describe('register', () => {
  it('should create a user and return tokens', async () => {
    const result = await register(validInput);

    expect(result.user.email).toBe(validInput.email);
    expect(result.user.fullName).toBe(validInput.fullName);
    expect(result.accessToken).toBeDefined();
    expect(result.refreshToken).toBeDefined();
  });

  it('should hash the password', async () => {
    await register(validInput);
    const user = await User.findOne({ email: validInput.email }).select('+password');
    expect(user?.password).not.toBe(validInput.password);
    const isHashed = await bcrypt.compare(validInput.password, user!.password!);
    expect(isHashed).toBe(true);
  });

  it('should throw ValidationError for duplicate email', async () => {
    await register(validInput);
    await expect(register(validInput)).rejects.toThrow(ValidationError);
  });
});

describe('login', () => {
  beforeEach(async () => {
    await register(validInput);
  });

  it('should return tokens for valid credentials', async () => {
    const result = await login({
      email: validInput.email,
      password: validInput.password,
    });
    expect(result.accessToken).toBeDefined();
    expect(result.refreshToken).toBeDefined();
  });

  it('should throw UnauthorizedError for wrong password', async () => {
    await expect(login({ email: validInput.email, password: 'WrongPass123!' })).rejects.toThrow(
      UnauthorizedError,
    );
  });

  it('should throw UnauthorizedError for non-existent user', async () => {
    await expect(
      login({ email: 'nobody@example.com', password: 'SecurePass123!' }),
    ).rejects.toThrow(UnauthorizedError);
  });
});

describe('refreshAccessToken', () => {
  it('should return new access token for valid refresh token', async () => {
    const { refreshToken } = await register(validInput);
    const result = await refreshAccessToken(refreshToken);
    expect(result.accessToken).toBeDefined();
  });

  it('should throw UnauthorizedError for invalid token', async () => {
    await expect(refreshAccessToken('invalid-token')).rejects.toThrow(UnauthorizedError);
  });
});

describe('logout', () => {
  it('should remove refresh token from user', async () => {
    const { user, refreshToken } = await register(validInput);
    await logout(user.id, refreshToken);

    const dbUser = await User.findById(user.id);
    expect(dbUser?.refreshTokens).not.toContain(refreshToken);
  });
});

const validGuest = {
  fullName: 'Guest User',
  fingerprint: 'unit-test-fingerprint-abc123',
};

describe('registerGuest', () => {
  it('should create a guest user and return tokens', async () => {
    const result = await registerGuest(validGuest);

    expect(result.user.email).toBeNull();
    expect(result.user.fullName).toBe(validGuest.fullName);
    expect(result.user.role).toBe('recruiter');
    expect(result.accessToken).toBeDefined();
    expect(result.refreshToken).toBeDefined();
  });

  it('should create guest without password', async () => {
    await registerGuest(validGuest);
    const user = await User.findOne({ userType: 'guest' }).select('+password');
    expect(user?.password).toBeNull();
    expect(user?.userType).toBe('guest');
  });

  it('should throw ValidationError for duplicate fingerprint', async () => {
    await registerGuest(validGuest);
    await expect(registerGuest(validGuest)).rejects.toThrow(ValidationError);
  });
});

describe('loginGuest', () => {
  beforeEach(async () => {
    await registerGuest(validGuest);
  });

  it('should return tokens for valid fingerprint', async () => {
    const result = await loginGuest({ fingerprint: validGuest.fingerprint });
    expect(result.accessToken).toBeDefined();
    expect(result.refreshToken).toBeDefined();
    expect(result.user.email).toBeNull();
    expect(result.user.fullName).toBe(validGuest.fullName);
  });

  it('should throw UnauthorizedError for unknown fingerprint', async () => {
    await expect(loginGuest({ fingerprint: 'unknown-fingerprint' })).rejects.toThrow(
      UnauthorizedError,
    );
  });

  it('should cap refresh tokens at 5', async () => {
    for (let i = 0; i < 6; i++) {
      await loginGuest({ fingerprint: validGuest.fingerprint });
    }
    const user = await User.findOne({ userType: 'guest' });
    expect(user?.refreshTokens.length).toBeLessThanOrEqual(5);
  });
});
