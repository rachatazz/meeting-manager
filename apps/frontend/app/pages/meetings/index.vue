<template>
  <div class="max-w-5xl mx-auto px-4 sm:px-8 py-6 sm:py-8">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl sm:text-3xl font-bold text-slate-900">All Meetings</h1>
        <p v-if="pagination" class="text-sm text-slate-500 mt-1">
          {{ pagination.totalItems }} meeting{{ pagination.totalItems === 1 ? '' : 's' }} total
        </p>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white border border-slate-200 rounded-lg p-3 sm:p-4 mb-6">
      <!-- Desktop: original inline row -->
      <div class="hidden sm:flex sm:flex-row gap-3">
        <div class="relative flex-1">
          <i
            class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none"
          />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search by title, candidate..."
            class="w-full h-10 pl-9 pr-4 border border-slate-200 rounded-md text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[var(--p-primary-color)] focus:ring-1 focus:ring-[var(--p-primary-color)] bg-white"
            @input="debouncedSearch"
          />
        </div>
        <DatePicker
          v-model="dateRange"
          selection-mode="range"
          date-format="dd M yy"
          placeholder="Date range"
          show-icon
          show-button-bar
          class="w-60"
          @hide="onDateRangeChange"
          @clear-click="clearDates"
        />
        <Select
          id="status-filter-desktop"
          v-model="statusFilter"
          :options="statusOptions"
          option-label="label"
          option-value="value"
          placeholder="Status"
          class="w-40"
          @change="applyFilters"
        />
        <Select
          id="sort-filter-desktop"
          v-model="sortFilter"
          :options="sortOptions"
          option-label="label"
          option-value="value"
          class="w-44"
          @change="applyFilters"
        />
      </div>

      <!-- Mobile: search + toggle -->
      <div class="flex gap-2 sm:hidden">
        <div class="relative flex-1">
          <i
            class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none"
          />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search by title, candidate..."
            class="w-full h-10 pl-9 pr-4 border border-slate-200 rounded-md text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[var(--p-primary-color)] focus:ring-1 focus:ring-[var(--p-primary-color)] bg-white"
            @input="debouncedSearch"
          />
        </div>
        <button
          class="flex items-center justify-center w-10 h-10 border border-slate-200 rounded-md hover:bg-slate-50 transition-colors flex-shrink-0"
          :class="showMobileFilters ? 'bg-slate-100 border-slate-300' : 'bg-white'"
          aria-label="Toggle filters"
          @click="showMobileFilters = !showMobileFilters"
        >
          <i class="pi pi-sliders-h text-slate-500 text-sm" />
        </button>
      </div>

      <!-- Mobile expanded filters -->
      <div v-if="showMobileFilters" class="flex flex-col gap-2 mt-3 pt-3 border-t border-slate-100 sm:hidden">
        <DatePicker
          v-model="dateRange"
          selection-mode="range"
          date-format="dd M yy"
          placeholder="Date range"
          show-icon
          show-button-bar
          class="w-full"
          @hide="onDateRangeChange"
          @clear-click="clearDates"
        />
        <div class="grid grid-cols-2 gap-2">
          <Select
            v-model="statusFilter"
            :options="statusOptions"
            option-label="label"
            option-value="value"
            placeholder="Status"
            class="w-full"
            @change="applyFilters"
          />
          <Select
            v-model="sortFilter"
            :options="sortOptions"
            option-label="label"
            option-value="value"
            class="w-full"
            @change="applyFilters"
          />
        </div>
      </div>

      <!-- Active filters -->
      <div
        v-if="hasActiveFilters"
        class="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-slate-100"
      >
        <span class="text-xs text-slate-400">Filters:</span>
        <span
          v-if="searchQuery"
          class="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 rounded text-xs text-slate-600"
        >
          "{{ searchQuery }}"
          <i
            class="pi pi-times text-[10px] cursor-pointer hover:text-slate-900"
            @click="clearSearch"
          />
        </span>
        <span
          v-if="dateRange && dateRange[0]"
          class="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 rounded text-xs text-slate-600"
        >
          {{ formatDateLabel(dateRange) }}
          <i
            class="pi pi-times text-[10px] cursor-pointer hover:text-slate-900"
            @click="clearDates"
          />
        </span>
        <span
          v-if="statusFilter"
          class="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 rounded text-xs text-slate-600 capitalize"
        >
          {{ statusFilter }}
          <i
            class="pi pi-times text-[10px] cursor-pointer hover:text-slate-900"
            @click="clearStatus"
          />
        </span>
        <button
          class="text-xs text-[var(--p-primary-color)] hover:underline ml-auto"
          @click="clearAllFilters"
        >
          Clear all
        </button>
      </div>
    </div>

    <!-- Loading skeleton -->
    <div v-if="loading" class="flex flex-col gap-4">
      <div
        v-for="n in 3"
        :key="n"
        class="bg-white border border-slate-200 rounded-lg p-6 h-36 shimmer"
      />
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="bg-white border border-slate-200 rounded-lg p-12 text-center">
      <i class="pi pi-exclamation-triangle text-4xl text-red-400 mb-3 block" />
      <p class="text-slate-900 font-semibold mb-2">Failed to load meetings</p>
      <p class="text-sm text-slate-500 mb-4">{{ error }}</p>
      <Button label="Try Again" @click="() => loadMeetings()" />
    </div>

    <!-- Empty state -->
    <div
      v-else-if="meetings.length === 0"
      class="bg-white border border-slate-200 rounded-lg p-8 sm:p-16 text-center"
    >
      <i class="pi pi-calendar text-4xl sm:text-5xl text-slate-200 mb-4 block" />
      <p class="text-lg sm:text-xl font-semibold text-slate-900 mb-2">No meetings found</p>
      <p class="text-sm text-slate-500 mb-6">
        Try adjusting your filters or schedule a new meeting
      </p>
      <Button label="Schedule Meeting" icon="pi pi-plus" @click="navigateTo('/meetings/new')" />
    </div>

    <!-- Meeting cards -->
    <div v-else class="flex flex-col gap-4">
      <MeetingCard
        v-for="meeting in meetings"
        :key="meeting.id"
        :meeting="meeting"
        variant="full"
      />
    </div>

    <!-- Pagination -->
    <div
      v-if="pagination && pagination.totalPages > 1"
      class="flex items-center justify-center gap-2 sm:gap-4 mt-8"
    >
      <Button
        icon="pi pi-arrow-left"
        severity="secondary"
        outlined
        :disabled="!pagination.hasPrevPage"
        class="sm:hidden"
        aria-label="Previous"
        @click="changePage(pagination.currentPage - 1)"
      />
      <Button
        label="Previous"
        icon="pi pi-arrow-left"
        severity="secondary"
        outlined
        :disabled="!pagination.hasPrevPage"
        class="hidden sm:inline-flex"
        @click="changePage(pagination.currentPage - 1)"
      />
      <span class="text-sm text-slate-500 font-medium"
        >Page {{ pagination.currentPage }} of {{ pagination.totalPages }}</span
      >
      <Button
        icon="pi pi-arrow-right"
        severity="secondary"
        outlined
        :disabled="!pagination.hasNextPage"
        class="sm:hidden"
        aria-label="Next"
        @click="changePage(pagination.currentPage + 1)"
      />
      <Button
        label="Next"
        icon="pi pi-arrow-right"
        icon-pos="right"
        severity="secondary"
        outlined
        :disabled="!pagination.hasNextPage"
        class="hidden sm:inline-flex"
        @click="changePage(pagination.currentPage + 1)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMeetingStore } from '~/stores/meeting';

definePageMeta({ middleware: 'auth' });

const { fetchMeetings } = useMeetings();
const { formatDateShort, toISODate, toISODateEnd } = useDate();
const meetingStore = useMeetingStore();

const searchQuery = ref('');
const statusFilter = ref('');
const sortFilter = ref('date_desc');
const dateRange = ref<Date[] | null>(null);
const showMobileFilters = ref(false);

const meetings = computed(() => meetingStore.meetings);
const pagination = computed(() => meetingStore.pagination);
const loading = computed(() => meetingStore.loading);
const error = computed(() => meetingStore.error);

const hasActiveFilters = computed(
  () => searchQuery.value || statusFilter.value || (dateRange.value && dateRange.value[0]),
);

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

function formatDateLabel(range: Date[] | null): string {
  if (!range || !range[0]) return '';
  if (!range[1]) return formatDateShort(range[0]);
  return `${formatDateShort(range[0])} – ${formatDateShort(range[1])}`;
}

let searchTimer: ReturnType<typeof setTimeout>;
function debouncedSearch() {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => applyFilters(), 400);
}

async function loadMeetings(page = 1) {
  const startDate = dateRange.value?.[0];
  const endDate = dateRange.value?.[1];
  await fetchMeetings({
    page,
    search: searchQuery.value || undefined,
    status: statusFilter.value || undefined,
    sort: sortFilter.value,
    startDate: startDate ? toISODate(startDate) : undefined,
    endDate: endDate ? toISODateEnd(endDate) : undefined,
  });
}

async function applyFilters() {
  await loadMeetings(1);
}

async function changePage(page: number) {
  await loadMeetings(page);
}

function onDateRangeChange() {
  if (dateRange.value && dateRange.value[0] && dateRange.value[1]) {
    applyFilters();
  }
}

function clearDates() {
  dateRange.value = null;
  applyFilters();
}

function clearSearch() {
  searchQuery.value = '';
  applyFilters();
}

function clearStatus() {
  statusFilter.value = '';
  applyFilters();
}

function clearAllFilters() {
  searchQuery.value = '';
  statusFilter.value = '';
  dateRange.value = null;
  applyFilters();
}

onMounted(() => loadMeetings());
</script>
