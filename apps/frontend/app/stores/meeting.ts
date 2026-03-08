import { defineStore } from 'pinia';
import type { IMeeting, IMeetingListItem, IPagination, MeetingStatus } from '@meeting-manager/shared';

interface MeetingFilters {
  search: string;
  status: MeetingStatus | '';
  sort: string;
  page: number;
}

interface MeetingState {
  meetings: IMeetingListItem[];
  currentMeeting: IMeeting | null;
  pagination: IPagination | null;
  filters: MeetingFilters;
  loading: boolean;
  error: string | null;
}

export const useMeetingStore = defineStore('meeting', {
  state: (): MeetingState => ({
    meetings: [],
    currentMeeting: null,
    pagination: null,
    filters: {
      search: '',
      status: '',
      sort: 'date_desc',
      page: 1,
    },
    loading: false,
    error: null,
  }),

  actions: {
    setMeetings(meetings: IMeetingListItem[], pagination: IPagination) {
      this.meetings = meetings;
      this.pagination = pagination;
    },

    setCurrentMeeting(meeting: IMeeting | null) {
      this.currentMeeting = meeting;
    },

    setFilters(filters: Partial<MeetingFilters>) {
      this.filters = { ...this.filters, ...filters };
    },

    setLoading(loading: boolean) {
      this.loading = loading;
    },

    setError(error: string | null) {
      this.error = error;
    },

    resetFilters() {
      this.filters = { search: '', status: '', sort: 'date_desc', page: 1 };
    },
  },
});
