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
    <MeetingFilters
      :search="searchQuery"
      :date-range="dateRange"
      :status="statusFilter"
      :sort="sortFilter"
      @update:search="onSearchUpdate"
      @update:date-range="dateRange = $event"
      @update:status="statusFilter = $event; applyFilters()"
      @update:sort="sortFilter = $event; applyFilters()"
      @date-change="onDateRangeChange"
      @clear-dates="clearDates"
      @clear-all="clearAllFilters"
    />

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
    <EmptyState
      v-else-if="meetings.length === 0"
      title="No meetings found"
      description="Try adjusting your filters or schedule a new meeting"
    >
      <Button label="Schedule Meeting" icon="pi pi-plus" @click="navigateTo('/meetings/new')" />
    </EmptyState>

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
const { toISODate, toISODateEnd } = useDate();
const meetingStore = useMeetingStore();

const searchQuery = ref('');
const statusFilter = ref('');
const sortFilter = ref('date_desc');
const dateRange = ref<Date[] | null>(null);

const meetings = computed(() => meetingStore.meetings);
const pagination = computed(() => meetingStore.pagination);
const loading = computed(() => meetingStore.loading);
const error = computed(() => meetingStore.error);

let searchTimer: ReturnType<typeof setTimeout>;
function onSearchUpdate(value: string) {
  searchQuery.value = value;
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

function clearAllFilters() {
  searchQuery.value = '';
  statusFilter.value = '';
  dateRange.value = null;
  applyFilters();
}

onMounted(() => loadMeetings());
</script>
