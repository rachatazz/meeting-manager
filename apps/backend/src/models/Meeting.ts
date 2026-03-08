import { Schema, model, Document, Types } from 'mongoose';

export interface IFeedbackDocument {
  _id: Types.ObjectId;
  interviewerId: Types.ObjectId;
  topic?: string;
  comment?: string;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IMeetingDocument extends Document {
  _id: Types.ObjectId;
  title: string;
  description?: string;
  candidateName: string;
  position: string;
  startTime: Date;
  endTime: Date;
  meetingType: 'online' | 'onsite';
  platform?: string;
  meetingLink?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  notes?: string;
  interviewNotes?: string;
  feedback: IFeedbackDocument[];
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const jsonTransform = {
  virtuals: true,
  versionKey: false,
  transform(_doc: unknown, ret: Record<string, unknown>) {
    delete ret._id;
  },
};

const feedbackJsonTransform = {
  virtuals: true,
  versionKey: false,
  transform(_doc: unknown, ret: Record<string, unknown>) {
    delete ret._id;
    ret.interviewer = ret.interviewerId;
    delete ret.interviewerId;
  },
};

const feedbackSchema = new Schema<IFeedbackDocument>(
  {
    interviewerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    topic: {
      type: String,
      trim: true,
      maxlength: 200,
    },
    comment: {
      type: String,
      trim: true,
      maxlength: 2000,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
  },
  { timestamps: true, toJSON: feedbackJsonTransform }
);

const meetingSchema = new Schema<IMeetingDocument>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 200,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 2000,
    },
    candidateName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    position: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    startTime: {
      type: Date,
      required: true,
      index: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    meetingType: {
      type: String,
      enum: ['online', 'onsite'],
      required: true,
    },
    platform: {
      type: String,
      trim: true,
    },
    meetingLink: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled'],
      default: 'pending',
      index: true,
    },
    notes: {
      type: String,
      maxlength: 2000,
    },
    interviewNotes: {
      type: String,
      maxlength: 5000,
    },
    feedback: [feedbackSchema],
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
  },
  { timestamps: true, toJSON: jsonTransform }
);

meetingSchema.index({ status: 1, startTime: 1 });
meetingSchema.index({ candidateName: 'text', position: 'text' });
meetingSchema.index({ createdAt: -1 });

export const Meeting = model<IMeetingDocument>('Meeting', meetingSchema);
