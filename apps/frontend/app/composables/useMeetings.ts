import type { IMeeting, IMeetingListItem, IMeetingSummary, IPagination } from '@meeting-manager/shared';
import { useMeetingStore } from '~/stores/meeting';

interface MeetingListResponse {
  success: boolean;
  data: IMeetingListItem[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

interface MeetingDetailResponse {
  success: boolean;
  data: IMeeting;
}

interface CreateMeetingPayload {
  title: string;
  description?: string;
  candidateName: string;
  position: string;
  startTime: string;
  endTime: string;
  meetingType: 'online' | 'onsite';
  platform?: string;
  meetingLink?: string;
  location?: string;
  notes?: string;
  interviewNotes?: string;
}

interface UpdateMeetingPayload extends Partial<CreateMeetingPayload> {
  status?: string;
}

interface FeedbackPayload {
  rating: number;
  topic?: string;
  comment?: string;
}

export function useMeetings() {
  const { request } = useApi();
  const meetingStore = useMeetingStore();

  async function fetchMeetings(params?: {
    page?: number;
    search?: string;
    status?: string;
    sort?: string;
    startDate?: string;
    endDate?: string;
  }) {
    meetingStore.setLoading(true);
    meetingStore.setError(null);
    try {
      const query = new URLSearchParams();
      if (params?.page) query.set('page', String(params.page));
      if (params?.search) query.set('search', params.search);
      if (params?.status) query.set('status', params.status);
      if (params?.startDate) query.set('startDate', params.startDate);
      if (params?.endDate) query.set('endDate', params.endDate);
      if (params?.sort) {
        const sortMap: Record<string, { sortBy: string; sortOrder: string }> = {
          date_desc: { sortBy: 'startTime', sortOrder: 'desc' },
          date_asc: { sortBy: 'startTime', sortOrder: 'asc' },
          name_asc: { sortBy: 'candidateName', sortOrder: 'asc' },
          status: { sortBy: 'createdAt', sortOrder: 'desc' },
        };
        const mapped = sortMap[params.sort];
        if (mapped) {
          query.set('sortBy', mapped.sortBy);
          query.set('sortOrder', mapped.sortOrder);
        }
      }
      const qs = query.toString();
      const data = await request<MeetingListResponse>(`/meetings${qs ? `?${qs}` : ''}`);
      if (data.success) {
        const { pagination } = data;
        meetingStore.setMeetings(data.data, {
          currentPage: pagination.page,
          totalPages: pagination.totalPages,
          totalItems: pagination.total,
          itemsPerPage: pagination.limit,
          hasNextPage: pagination.hasNext,
          hasPrevPage: pagination.hasPrev,
        });
      }
      return data;
    } catch (err: unknown) {
      const error = err as { data?: { error?: { message?: string } } };
      meetingStore.setError(error?.data?.error?.message || 'Failed to load meetings');
      throw err;
    } finally {
      meetingStore.setLoading(false);
    }
  }

  async function fetchMeeting(id: string) {
    meetingStore.setLoading(true);
    meetingStore.setError(null);
    try {
      const data = await request<MeetingDetailResponse>(`/meetings/${id}`);
      if (data.success) {
        meetingStore.setCurrentMeeting(data.data);
      }
      return data.data;
    } catch (err: unknown) {
      const error = err as { data?: { error?: { message?: string } } };
      meetingStore.setError(error?.data?.error?.message || 'Failed to load meeting');
      throw err;
    } finally {
      meetingStore.setLoading(false);
    }
  }

  async function createMeeting(payload: CreateMeetingPayload) {
    const data = await request<MeetingDetailResponse>('/meetings', {
      method: 'POST',
      body: payload,
    });
    return data.data;
  }

  async function updateMeeting(id: string, payload: UpdateMeetingPayload) {
    const data = await request<MeetingDetailResponse>(`/meetings/${id}`, {
      method: 'PUT',
      body: payload,
    });
    return data.data;
  }

  async function deleteMeeting(id: string) {
    await request(`/meetings/${id}`, { method: 'DELETE' });
  }

  async function addFeedback(id: string, payload: FeedbackPayload) {
    const data = await request<MeetingDetailResponse>(`/meetings/${id}/feedback`, {
      method: 'POST',
      body: payload,
    });
    return data.data;
  }

  async function fetchSummary() {
    const data = await request<{ success: boolean; data: IMeetingSummary }>('/meetings/summary');
    return data.data;
  }

  return {
    fetchMeetings,
    fetchMeeting,
    fetchSummary,
    createMeeting,
    updateMeeting,
    deleteMeeting,
    addFeedback,
  };
}
