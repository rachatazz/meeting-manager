<template>
  <div class="bg-white border border-slate-200 rounded-lg p-3 sm:p-4 mb-6">
    <!-- Desktop: inline row -->
    <div class="hidden sm:flex sm:flex-row gap-3">
      <div class="relative flex-1">
        <i
          class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none"
        />
        <input
          :value="search"
          type="text"
          placeholder="Search by title, candidate..."
          class="w-full h-10 pl-9 pr-4 border border-slate-200 rounded-md text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[var(--p-primary-color)] focus:ring-1 focus:ring-[var(--p-primary-color)] bg-white"
          @input="$emit('update:search', ($event.target as HTMLInputElement).value)"
        />
      </div>
      <DatePicker
        :model-value="dateRange"
        selection-mode="range"
        date-format="dd M yy"
        placeholder="Date range"
        show-icon
        show-button-bar
        class="w-60"
        @hide="$emit('dateChange')"
        @clear-click="$emit('clearDates')"
        @update:model-value="onDatePickerUpdate"
      />
      <Select
        :model-value="status"
        :options="statusOptions"
        option-label="label"
        option-value="value"
        placeholder="Status"
        class="w-40"
        @update:model-value="onStatusUpdate"
      />
      <Select
        :model-value="sort"
        :options="sortOptions"
        option-label="label"
        option-value="value"
        class="w-44"
        @update:model-value="onSortUpdate"
      />
    </div>

    <!-- Mobile: search + toggle -->
    <div class="flex gap-2 sm:hidden">
      <div class="relative flex-1">
        <i
          class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none"
        />
        <input
          :value="search"
          type="text"
          placeholder="Search by title, candidate..."
          class="w-full h-10 pl-9 pr-4 border border-slate-200 rounded-md text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[var(--p-primary-color)] focus:ring-1 focus:ring-[var(--p-primary-color)] bg-white"
          @input="$emit('update:search', ($event.target as HTMLInputElement).value)"
        />
      </div>
      <button
        class="flex items-center justify-center w-10 h-10 border border-slate-200 rounded-md hover:bg-slate-50 transition-colors flex-shrink-0"
        :class="showMobile ? 'bg-slate-100 border-slate-300' : 'bg-white'"
        aria-label="Toggle filters"
        @click="showMobile = !showMobile"
      >
        <i class="pi pi-sliders-h text-slate-500 text-sm" />
      </button>
    </div>

    <!-- Mobile expanded filters -->
    <div
      v-if="showMobile"
      class="flex flex-col gap-2 mt-3 pt-3 border-t border-slate-100 sm:hidden"
    >
      <DatePicker
        :model-value="dateRange"
        selection-mode="range"
        date-format="dd M yy"
        placeholder="Date range"
        show-icon
        show-button-bar
        class="w-full"
        @hide="$emit('dateChange')"
        @clear-click="$emit('clearDates')"
        @update:model-value="onDatePickerUpdate"
      />
      <div class="grid grid-cols-2 gap-2">
        <Select
          :model-value="status"
          :options="statusOptions"
          option-label="label"
          option-value="value"
          placeholder="Status"
          class="w-full"
          @update:model-value="onStatusUpdate"
        />
        <Select
          :model-value="sort"
          :options="sortOptions"
          option-label="label"
          option-value="value"
          class="w-full"
          @update:model-value="onSortUpdate"
        />
      </div>
    </div>

    <!-- Active filter tags -->
    <MeetingFilterTags
      :search="search"
      :date-range="dateRange"
      :status="status"
      @clear-search="$emit('update:search', '')"
      @clear-dates="$emit('clearDates')"
      @clear-status="$emit('update:status', '')"
      @clear-all="$emit('clearAll')"
    />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  search: string;
  dateRange: Date[] | null;
  status: string;
  sort: string;
}>();

const emit = defineEmits<{
  'update:search': [value: string];
  'update:dateRange': [value: Date[] | null];
  'update:status': [value: string];
  'update:sort': [value: string];
  dateChange: [];
  clearDates: [];
  clearAll: [];
}>();

function onDatePickerUpdate(value: unknown) {
  emit('update:dateRange', value as Date[] | null);
}

function onStatusUpdate(value: unknown) {
  emit('update:status', value as string);
}

function onSortUpdate(value: unknown) {
  emit('update:sort', value as string);
}

const showMobile = ref(false);

const statusOptions = [
  { label: 'All', value: '' },
  { label: 'Confirmed', value: 'confirmed' },
  { label: 'Pending', value: 'pending' },
  { label: 'Cancelled', value: 'cancelled' },
];

const sortOptions = [
  { label: 'Date (Newest)', value: 'date_desc' },
  { label: 'Date (Oldest)', value: 'date_asc' },
  { label: 'Candidate Name (A-Z)', value: 'name_asc' },
  { label: 'Status', value: 'status' },
];
</script>
