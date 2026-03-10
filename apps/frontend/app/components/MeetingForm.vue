<template>
  <div class="bg-white border border-slate-200 rounded-xl shadow-sm">
    <form @submit.prevent="handleSubmit">
      <!-- Header: Title + Status -->
      <div
        class="px-5 sm:px-6 pt-5 sm:pt-6 pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
      >
        <h3 class="text-lg font-semibold text-slate-900">
          {{ mode === 'edit' ? 'Edit Meeting' : 'Meeting Details' }}
        </h3>
        <!-- Status pill selector (edit mode) -->
        <div v-if="mode === 'edit'" class="flex items-center bg-slate-100 rounded-full p-0.5">
          <button
            v-for="opt in statusOptions"
            :key="opt.value"
            type="button"
            class="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all"
            :class="
              form.status === opt.value
                ? statusStyles[opt.value]?.active
                : 'text-slate-500 hover:text-slate-700'
            "
            @click="form.status = opt.value as typeof form.status"
          >
            <span class="w-1.5 h-1.5 rounded-full" :class="statusStyles[opt.value]?.dot" />
            {{ opt.label }}
          </button>
        </div>
      </div>

      <!-- Section 1: Meeting Info + Candidate -->
      <div class="px-5 sm:px-6 py-4">
        <MeetingFormBasicInfo :form="form" :errors="errors" @update="onFieldUpdate" />
      </div>

      <div class="border-t border-slate-100 mx-5 sm:mx-6" />

      <!-- Section 2: Schedule & Location -->
      <div class="px-5 sm:px-6 py-4">
        <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
          Schedule & Location
        </p>
        <MeetingFormSchedule :form="form" :errors="errors" @update="onFieldUpdate" />
      </div>

      <div class="border-t border-slate-100 mx-5 sm:mx-6" />

      <!-- Section 3: Notes -->
      <div class="px-5 sm:px-6 py-4">
        <label class="block text-sm font-medium text-slate-700 mb-1">Notes</label>
        <Textarea
          v-model="form.notes"
          placeholder="Additional notes or requirements..."
          :rows="2"
          class="w-full"
          style="resize: vertical"
        />
      </div>

      <!-- Actions -->
      <div
        class="border-t border-slate-200 px-5 sm:px-6 py-4 flex justify-between bg-slate-50/50 rounded-b-xl"
      >
        <Button
          type="button"
          label="Cancel"
          severity="secondary"
          outlined
          @click="$emit('cancel')"
        />
        <Button
          type="submit"
          :label="loading ? 'Saving...' : mode === 'edit' ? 'Update Meeting' : 'Book Meeting'"
          :icon="
            loading
              ? 'pi pi-spin pi-spinner'
              : mode === 'edit'
                ? 'pi pi-check'
                : 'pi pi-calendar-plus'
          "
          :disabled="loading"
        />
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import type { IMeeting } from '@meeting-manager/shared';

const props = defineProps<{
  meeting?: IMeeting;
  mode: 'create' | 'edit';
  loading?: boolean;
}>();

const emit = defineEmits<{
  cancel: [];
  submit: [
    payload: {
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
      status?: string;
    },
  ];
}>();

const statusOptions = [
  { label: 'Pending', value: 'pending' as const },
  { label: 'Confirmed', value: 'confirmed' as const },
  { label: 'Cancelled', value: 'cancelled' as const },
];

const statusStyles: Record<string, { active: string; dot: string }> = {
  pending: { active: 'bg-white shadow-sm text-amber-700', dot: 'bg-amber-500' },
  confirmed: { active: 'bg-white shadow-sm text-emerald-700', dot: 'bg-emerald-500' },
  cancelled: { active: 'bg-white shadow-sm text-red-700', dot: 'bg-red-500' },
};

function parseDateAndTime(isoStr: string) {
  const d = new Date(isoStr);
  const h = d.getHours().toString().padStart(2, '0');
  const m = d.getMinutes().toString().padStart(2, '0');
  return { date: d, time: `${h}:${m}` };
}

const initialStart = props.meeting ? parseDateAndTime(props.meeting.startTime) : null;
const initialEnd = props.meeting ? parseDateAndTime(props.meeting.endTime) : null;

const form = reactive({
  title: props.meeting?.title ?? '',
  description: props.meeting?.description ?? '',
  candidateName: props.meeting?.candidateName ?? '',
  position: props.meeting?.position ?? '',
  date: initialStart?.date ?? (null as Date | null),
  startTime: initialStart?.time ?? '',
  endTime: initialEnd?.time ?? '',
  meetingType: (props.meeting?.meetingType ?? 'online') as 'online' | 'onsite',
  platform: props.meeting?.platform ?? '',
  meetingLink: props.meeting?.meetingLink ?? '',
  location: props.meeting?.location ?? '',
  notes: props.meeting?.notes ?? '',
  status: props.meeting?.status ?? 'pending',
});

const errors = reactive<Record<string, string>>({});

function onFieldUpdate(field: string, value: unknown) {
  (form as Record<string, unknown>)[field] = value;
}

function buildDateTime(date: Date, timeStr: string): string {
  const [h = 0, m = 0] = timeStr.split(':').map(Number);
  const d = new Date(date);
  d.setHours(h, m, 0, 0);
  return d.toISOString();
}

function validate(): boolean {
  Object.keys(errors).forEach((k) => delete errors[k]);
  if (!form.title.trim()) errors.title = 'Title is required';
  if (!form.candidateName.trim()) errors.candidateName = 'Candidate name is required';
  if (!form.position) errors.position = 'Position is required';
  if (!form.date) errors.date = 'Date is required';
  if (!form.startTime) errors.startTime = 'Start time is required';
  if (!form.endTime) errors.endTime = 'End time is required';
  if (form.startTime && form.endTime && form.startTime >= form.endTime) {
    errors.endTime = 'End time must be after start time';
  }
  if (form.meetingType === 'online' && !form.platform) errors.platform = 'Platform is required';
  if (form.meetingType === 'onsite' && !form.location.trim())
    errors.location = 'Room/Location is required';
  return Object.keys(errors).length === 0;
}

function handleSubmit() {
  if (!validate() || !form.date) return;
  emit('submit', {
    title: form.title,
    description: form.description || undefined,
    candidateName: form.candidateName,
    position: form.position,
    startTime: buildDateTime(form.date, form.startTime),
    endTime: buildDateTime(form.date, form.endTime),
    meetingType: form.meetingType,
    platform: form.meetingType === 'online' ? form.platform : undefined,
    meetingLink: form.meetingType === 'online' && form.meetingLink ? form.meetingLink : undefined,
    location: form.meetingType === 'onsite' ? form.location : undefined,
    notes: form.notes || undefined,
    status: props.mode === 'edit' ? form.status : undefined,
  });
}
</script>
