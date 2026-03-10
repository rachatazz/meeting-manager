import { defineStore } from 'pinia';
import type { IMeeting, IMeetingListItem, IPagination, MeetingStatus } from '@meeting-manager/shared';

interface MeetingFilters {
  search: string;
  status: MeetingStatus | '';
  sort: string;
  page: number;
}

export const useMeetingStore = defineStore('meeting', () => {
  const meetings = ref<IMeetingListItem[]>([]);
  const currentMeeting = ref<IMeeting | null>(null);
  const pagination = ref<IPagination | null>(null);
  const filters = ref<MeetingFilters>({
    search: '',
    status: '',
    sort: 'date_desc',
    page: 1,
  });
  const loading = ref(false);
  const error = ref<string | null>(null);

  function setMeetings(newMeetings: IMeetingListItem[], newPagination: IPagination) {
    meetings.value = newMeetings;
    pagination.value = newPagination;
  }

  function setCurrentMeeting(meeting: IMeeting | null) {
    currentMeeting.value = meeting;
  }

  function setFilters(newFilters: Partial<MeetingFilters>) {
    filters.value = { ...filters.value, ...newFilters };
  }

  function setLoading(value: boolean) {
    loading.value = value;
  }

  function setError(value: string | null) {
    error.value = value;
  }

  function resetFilters() {
    filters.value = { search: '', status: '', sort: 'date_desc', page: 1 };
  }

  return {
    meetings,
    currentMeeting,
    pagination,
    filters,
    loading,
    error,
    setMeetings,
    setCurrentMeeting,
    setFilters,
    setLoading,
    setError,
    resetFilters,
  };
});
