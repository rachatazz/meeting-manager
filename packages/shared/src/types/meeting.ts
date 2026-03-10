export type MeetingStatus = 'pending' | 'confirmed' | 'cancelled';
export type MeetingType = 'online' | 'onsite';

export interface IFeedback {
  id: string;
  interviewer: {
    id: string;
    fullName: string;
  };
  topic?: string;
  comment?: string;
  rating: number;
  createdAt: string;
}

export interface IMeeting {
  id: string;
  title: string;
  description?: string;
  candidateName: string;
  position: string;
  startTime: string;
  endTime: string;
  meetingType: MeetingType;
  platform?: string;
  meetingLink?: string;
  location?: string;
  status: MeetingStatus;
  notes?: string;
  interviewNotes?: string;
  feedback: IFeedback[];
  createdBy: {
    id: string;
    fullName: string;
    email?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface IMeetingListItem {
  id: string;
  title: string;
  description?: string;
  candidateName: string;
  position: string;
  startTime: string;
  endTime: string;
  meetingType: MeetingType;
  platform?: string;
  meetingLink?: string;
  location?: string;
  status: MeetingStatus;
  notes?: string;
  interviewNotes?: string;
  createdBy: {
    id: string;
    fullName: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface IMeetingSummary {
  total: number;
  byStatus: {
    pending: number;
    confirmed: number;
    cancelled: number;
  };
}

export interface IPagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}
