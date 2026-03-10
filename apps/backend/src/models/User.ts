import { Schema, model, Document, Types } from 'mongoose';

export interface IUserDocument extends Document {
  _id: Types.ObjectId;
  email: string | null;
  password: string | null;
  fullName: string;
  role: 'recruiter' | 'interviewer' | 'admin';
  userType: 'user' | 'guest';
  fingerprint: string | null;
  refreshTokens: string[];
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUserDocument>(
  {
    email: {
      type: String,
      required: false,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: false,
      default: null,
      select: false,
    },
    fingerprint: {
      type: String,
      required: false,
      unique: true,
      sparse: true,
      select: false,
      index: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ['recruiter', 'interviewer', 'admin'],
      default: 'recruiter',
      index: true,
    },
    userType: {
      type: String,
      enum: ['user', 'guest'],
      default: 'user',
      index: true,
    },
    refreshTokens: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform(_doc: unknown, ret: Record<string, unknown>) {
        delete ret._id;
        delete ret.password;
        delete ret.fingerprint;
        delete ret.refreshTokens;
      },
    },
  },
);

userSchema.index({ createdAt: -1 });

export const User = model<IUserDocument>('User', userSchema);
