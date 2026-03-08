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
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-4">
          <!-- Title (full width) -->
          <div class="sm:col-span-2">
            <label class="block text-sm font-medium text-slate-700 mb-1"
              >Title <span class="text-red-500">*</span></label
            >
            <InputText
              v-model="form.title"
              placeholder="e.g., Technical Interview - Round 1"
              class="w-full"
              :class="{ 'border-red-500': errors.title }"
            />
            <small v-if="errors.title" class="text-red-500 text-xs mt-0.5 block">{{
              errors.title
            }}</small>
          </div>
          <!-- Description (full width) -->
          <div class="sm:col-span-2">
            <label class="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <Textarea
              v-model="form.description"
              placeholder="Brief description of the meeting..."
              :rows="2"
              class="w-full"
              style="resize: vertical"
            />
          </div>
          <!-- Candidate Name -->
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1"
              >Candidate Name <span class="text-red-500">*</span></label
            >
            <div class="relative">
              <InputText
                v-model="form.candidateName"
                placeholder="Start typing to search..."
                class="w-full pr-10"
                :class="{ 'border-red-500': errors.candidateName }"
              />
              <i
                class="pi pi-search absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none"
              />
            </div>
            <small v-if="errors.candidateName" class="text-red-500 text-xs mt-0.5 block">{{
              errors.candidateName
            }}</small>
          </div>
          <!-- Position -->
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1"
              >Position <span class="text-red-500">*</span></label
            >
            <Select
              v-model="form.position"
              :options="positions"
              editable
              placeholder="Select Position"
              class="w-full"
              :class="{ 'border-red-500': errors.position }"
            />
            <small v-if="errors.position" class="text-red-500 text-xs mt-0.5 block">{{
              errors.position
            }}</small>
          </div>
        </div>
      </div>

      <div class="border-t border-slate-100 mx-5 sm:mx-6" />

      <!-- Section 2: Schedule & Location -->
      <div class="px-5 sm:px-6 py-4">
        <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
          Schedule & Location
        </p>
        <div class="flex flex-col gap-4">
          <!-- Date & Time row -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1"
                >Date <span class="text-red-500">*</span></label
              >
              <DatePicker
                v-model="form.date"
                placeholder="Select Date"
                date-format="M dd, yy"
                class="w-full"
                :class="{ 'border-red-500': errors.date }"
                :min-date="new Date()"
              />
              <small v-if="errors.date" class="text-red-500 text-xs mt-0.5 block">{{
                errors.date
              }}</small>
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1"
                >Start Time <span class="text-red-500">*</span></label
              >
              <Select
                v-model="form.startTime"
                :options="timeOptions"
                option-label="label"
                option-value="value"
                placeholder="Start Time"
                class="w-full"
                :class="{ 'border-red-500': errors.startTime }"
              />
              <small v-if="errors.startTime" class="text-red-500 text-xs mt-0.5 block">{{
                errors.startTime
              }}</small>
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1"
                >End Time <span class="text-red-500">*</span></label
              >
              <Select
                v-model="form.endTime"
                :options="timeOptions"
                option-label="label"
                option-value="value"
                placeholder="End Time"
                class="w-full"
                :class="{ 'border-red-500': errors.endTime }"
              />
              <small v-if="errors.endTime" class="text-red-500 text-xs mt-0.5 block">{{
                errors.endTime
              }}</small>
            </div>
          </div>

          <!-- Meeting Type + Platform/Location in one row -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <!-- Meeting Type compact cards -->
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1"
                >Meeting Type <span class="text-red-500">*</span></label
              >
              <div class="grid grid-cols-2 gap-2">
                <label
                  class="flex items-center gap-2 px-3 py-2.5 border rounded-lg cursor-pointer transition-all"
                  :class="
                    form.meetingType === 'online'
                      ? 'border-blue-500 bg-blue-50/60 ring-1 ring-blue-500'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  "
                >
                  <RadioButton
                    v-model="form.meetingType"
                    input-id="type-online"
                    value="online"
                    class="hidden"
                  />
                  <i
                    class="pi pi-video text-sm"
                    :class="form.meetingType === 'online' ? 'text-blue-600' : 'text-slate-400'"
                  />
                  <span
                    class="text-sm font-medium"
                    :class="form.meetingType === 'online' ? 'text-blue-700' : 'text-slate-700'"
                    >Online</span
                  >
                </label>
                <label
                  class="flex items-center gap-2 px-3 py-2.5 border rounded-lg cursor-pointer transition-all"
                  :class="
                    form.meetingType === 'onsite'
                      ? 'border-blue-500 bg-blue-50/60 ring-1 ring-blue-500'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  "
                >
                  <RadioButton
                    v-model="form.meetingType"
                    input-id="type-onsite"
                    value="onsite"
                    class="hidden"
                  />
                  <i
                    class="pi pi-map-marker text-sm"
                    :class="form.meetingType === 'onsite' ? 'text-blue-600' : 'text-slate-400'"
                  />
                  <span
                    class="text-sm font-medium"
                    :class="form.meetingType === 'onsite' ? 'text-blue-700' : 'text-slate-700'"
                    >Onsite</span
                  >
                </label>
              </div>
            </div>
            <!-- Platform -->
            <div v-if="form.meetingType === 'online'">
              <label class="block text-sm font-medium text-slate-700 mb-1"
                >Platform <span class="text-red-500">*</span></label
              >
              <Select
                v-model="form.platform"
                :options="platforms"
                placeholder="Select Platform"
                class="w-full"
                editable
                :class="{ 'border-red-500': errors.platform }"
              />
              <small v-if="errors.platform" class="text-red-500 text-xs mt-0.5 block">{{
                errors.platform
              }}</small>
            </div>
            <!-- Location -->
            <div v-if="form.meetingType === 'onsite'">
              <label class="block text-sm font-medium text-slate-700 mb-1"
                >Room / Location <span class="text-red-500">*</span></label
              >
              <InputText
                v-model="form.location"
                placeholder="e.g., Conference Room 301"
                class="w-full"
                :class="{ 'border-red-500': errors.location }"
              />
              <small v-if="errors.location" class="text-red-500 text-xs mt-0.5 block">{{
                errors.location
              }}</small>
            </div>
          </div>
          <!-- Meeting Link (online only) -->
          <div v-if="form.meetingType === 'online'">
            <label class="block text-sm font-medium text-slate-700 mb-1">Meeting Link</label>
            <div class="relative">
              <InputText
                v-model="form.meetingLink"
                placeholder="e.g., https://zoom.us/j/123456789"
                class="w-full pl-9"
              />
              <i
                class="pi pi-link absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none"
              />
            </div>
          </div>
        </div>
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

const positions = [
  'Software Engineer',
  'Backend Developer',
  'Frontend Developer',
  'Full Stack Developer',
  'DevOps Engineer',
  'QA Engineer',
  'Product Manager',
  'UI/UX Designer',
];

const platforms = ['Zoom', 'Google Meet', 'Microsoft Teams'];

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

const timeOptions = computed(() => {
  const options: { label: string; value: string }[] = [];
  for (let h = 8; h <= 20; h++) {
    for (const m of [0, 15, 30, 45]) {
      if (h === 20 && m > 0) break;
      const hour12 = h > 12 ? h - 12 : h === 0 ? 12 : h;
      const ampm = h < 12 ? 'AM' : 'PM';
      const label = `${hour12}:${m.toString().padStart(2, '0')} ${ampm}`;
      const value = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
      options.push({ label, value });
    }
  }
  return options;
});

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
  location: '',
  notes: props.meeting?.notes ?? '',
  status: props.meeting?.status ?? 'pending',
});

const errors = reactive<Record<string, string>>({});

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
