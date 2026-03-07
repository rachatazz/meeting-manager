import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { env } from '../config/env';
import { ValidationError, UnauthorizedError } from '../utils/errors';
import type {
  RegisterInput,
  GuestRegisterInput,
  GuestLoginInput,
  LoginInput,
} from '../validators/auth.validator';

interface TokenPayload {
  id: string;
  email: string | null;
  role: string;
}

interface AuthResult {
  user: {
    id: string;
    email: string | null;
    fullName: string;
    role: string;
  };
  accessToken: string;
  refreshToken: string;
}

function generateAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  } as jwt.SignOptions);
}

function generateRefreshToken(payload: TokenPayload): string {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN,
  } as jwt.SignOptions);
}

export async function register(input: RegisterInput): Promise<AuthResult> {
  const existing = await User.findOne({ email: input.email });
  if (existing) {
    throw new ValidationError([{ field: 'email', message: 'Email already registered' }]);
  }

  const hashedPassword = await bcrypt.hash(input.password, 10);
  const user = await User.create({
    email: input.email,
    password: hashedPassword,
    fullName: input.fullName,
    role: input.role,
    userType: 'user',
  });

  const payload: TokenPayload = {
    id: user._id.toString(),
    email: user.email,
    role: user.role,
  };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  user.refreshTokens.push(refreshToken);
  await user.save();

  return {
    user: {
      id: user._id.toString(),
      email: user.email,
      fullName: user.fullName,
      role: user.role,
    },
    accessToken,
    refreshToken,
  };
}

export async function login(input: LoginInput): Promise<AuthResult> {
  const user = await User.findOne({ email: input.email }).select('+password');
  if (!user) {
    throw new UnauthorizedError('Invalid email or password');
  }

  if (!user.password) {
    throw new UnauthorizedError('Invalid email or password');
  }

  const isMatch = await bcrypt.compare(input.password, user.password);
  if (!isMatch) {
    throw new UnauthorizedError('Invalid email or password');
  }

  const payload: TokenPayload = {
    id: user._id.toString(),
    email: user.email,
    role: user.role,
  };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  user.refreshTokens.push(refreshToken);
  if (user.refreshTokens.length > 5) {
    user.refreshTokens = user.refreshTokens.slice(-5);
  }
  await user.save();

  return {
    user: {
      id: user._id.toString(),
      email: user.email,
      fullName: user.fullName,
      role: user.role,
    },
    accessToken,
    refreshToken,
  };
}

export async function registerGuest(input: GuestRegisterInput): Promise<AuthResult> {
  const existing = await User.findOne({ fingerprint: input.fingerprint }).select('+fingerprint');
  if (existing) {
    throw new ValidationError([
      { field: 'fingerprint', message: 'This browser session is already registered' },
    ]);
  }

  const user = await User.create({
    fullName: input.fullName,
    fingerprint: input.fingerprint,
    userType: 'guest',
    role: 'recruiter',
  });

  const payload: TokenPayload = {
    id: user._id.toString(),
    email: null,
    role: user.role,
  };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  user.refreshTokens.push(refreshToken);
  await user.save();

  return {
    user: {
      id: user._id.toString(),
      email: null,
      fullName: user.fullName,
      role: user.role,
    },
    accessToken,
    refreshToken,
  };
}

export async function loginGuest(input: GuestLoginInput): Promise<AuthResult> {
  const user = await User.findOne({ fingerprint: input.fingerprint }).select('+fingerprint');
  if (!user) {
    throw new UnauthorizedError('Invalid fingerprint');
  }

  const payload: TokenPayload = {
    id: user._id.toString(),
    email: null,
    role: user.role,
  };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  user.refreshTokens.push(refreshToken);
  if (user.refreshTokens.length > 5) {
    user.refreshTokens = user.refreshTokens.slice(-5);
  }
  await user.save();

  return {
    user: {
      id: user._id.toString(),
      email: null,
      fullName: user.fullName,
      role: user.role,
    },
    accessToken,
    refreshToken,
  };
}

export async function refreshAccessToken(token: string): Promise<{ accessToken: string }> {
  let payload: TokenPayload;
  try {
    payload = jwt.verify(token, env.JWT_REFRESH_SECRET) as TokenPayload;
  } catch {
    throw new UnauthorizedError('Invalid or expired refresh token');
  }

  const user = await User.findById(payload.id);
  if (!user || !user.refreshTokens.includes(token)) {
    throw new UnauthorizedError('Invalid refresh token');
  }

  const newPayload: TokenPayload = {
    id: user._id.toString(),
    email: user.email,
    role: user.role,
  };

  const accessToken = generateAccessToken(newPayload);
  return { accessToken };
}

export async function logout(userId: string, refreshToken: string): Promise<void> {
  await User.findByIdAndUpdate(userId, {
    $pull: { refreshTokens: refreshToken },
  });
}
