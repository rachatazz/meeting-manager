<template>
  <div class="flex flex-col gap-4">
    <!-- Date & Time row -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div>
        <label class="block text-sm font-medium text-slate-700 mb-1"
          >Date <span class="text-red-500">*</span></label
        >
        <DatePicker
          :model-value="form.date"
          placeholder="Select Date"
          date-format="M dd, yy"
          class="w-full"
          :class="{ 'border-red-500': errors.date }"
          :min-date="new Date()"
          @update:model-value="$emit('update', 'date', $event)"
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
          :model-value="form.startTime"
          :options="timeOptions"
          option-label="label"
          option-value="value"
          placeholder="Start Time"
          class="w-full"
          :class="{ 'border-red-500': errors.startTime }"
          @update:model-value="$emit('update', 'startTime', $event)"
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
          :model-value="form.endTime"
          :options="timeOptions"
          option-label="label"
          option-value="value"
          placeholder="End Time"
          class="w-full"
          :class="{ 'border-red-500': errors.endTime }"
          @update:model-value="$emit('update', 'endTime', $event)"
        />
        <small v-if="errors.endTime" class="text-red-500 text-xs mt-0.5 block">{{
          errors.endTime
        }}</small>
      </div>
    </div>

    <!-- Meeting Type + Platform/Location -->
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
              :model-value="form.meetingType"
              input-id="type-online"
              value="online"
              class="hidden"
              @update:model-value="$emit('update', 'meetingType', $event)"
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
              :model-value="form.meetingType"
              input-id="type-onsite"
              value="onsite"
              class="hidden"
              @update:model-value="$emit('update', 'meetingType', $event)"
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
      <!-- Platform (online) -->
      <div v-if="form.meetingType === 'online'">
        <label class="block text-sm font-medium text-slate-700 mb-1"
          >Platform <span class="text-red-500">*</span></label
        >
        <Select
          :model-value="form.platform"
          :options="platforms"
          placeholder="Select Platform"
          class="w-full"
          editable
          :class="{ 'border-red-500': errors.platform }"
          @update:model-value="$emit('update', 'platform', $event)"
        />
        <small v-if="errors.platform" class="text-red-500 text-xs mt-0.5 block">{{
          errors.platform
        }}</small>
      </div>
      <!-- Location (onsite) -->
      <div v-if="form.meetingType === 'onsite'">
        <label class="block text-sm font-medium text-slate-700 mb-1"
          >Room / Location <span class="text-red-500">*</span></label
        >
        <InputText
          :model-value="form.location"
          placeholder="e.g., Conference Room 301"
          class="w-full"
          :class="{ 'border-red-500': errors.location }"
          @update:model-value="$emit('update', 'location', $event)"
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
          :model-value="form.meetingLink"
          placeholder="e.g., https://zoom.us/j/123456789"
          class="w-full pl-9"
          @update:model-value="$emit('update', 'meetingLink', $event)"
        />
        <i
          class="pi pi-link absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  form: {
    date: Date | null;
    startTime: string;
    endTime: string;
    meetingType: 'online' | 'onsite';
    platform: string;
    meetingLink: string;
    location: string;
  };
  errors: Record<string, string>;
}>();

defineEmits<{
  update: [field: string, value: unknown];
}>();

const platforms = ['Zoom', 'Google Meet', 'Microsoft Teams'];

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
</script>
