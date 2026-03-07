export type MeetingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';
export type MeetingType = 'online' | 'onsite';

export interface IFeedback {
  id: string;
  interviewer: {
    id: string;
    fullName: string;
  };
  comment: string;
  rating: number;
  createdAt: string;
}

export interface IMeeting {
  id: string;
  candidateName: string;
  position: string;
  startTime: string;
  endTime: string;
  meetingType: MeetingType;
  platform?: string;
  meetingLink?: string;
  status: MeetingStatus;
  notes?: string;
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
  candidateName: string;
  position: string;
  startTime: string;
  endTime: string;
  meetingType: MeetingType;
  platform?: string;
  status: MeetingStatus;
  notes?: string;
  createdBy: {
    id: string;
    fullName: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface IPagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}
