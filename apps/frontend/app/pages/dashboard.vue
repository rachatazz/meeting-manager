<template>
  <div class="max-w-5xl mx-auto px-4 sm:px-8 py-6 sm:py-8">
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-2xl sm:text-3xl font-bold text-slate-900">Dashboard</h1>
      <p class="text-sm text-slate-500 mt-1">{{ todayLabel }}</p>
    </div>

    <!-- Summary cards -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
      <div class="bg-white border border-slate-200 rounded-lg p-3 sm:p-4 shadow-sm">
        <p class="text-xs font-medium text-slate-500 uppercase tracking-wide">Today's Total</p>
        <p class="text-xl sm:text-2xl font-bold text-slate-900 mt-1">{{ summary?.total ?? 0 }}</p>
      </div>
      <div class="bg-white border border-slate-200 rounded-lg p-3 sm:p-4 shadow-sm">
        <p class="text-xs font-medium text-amber-600 uppercase tracking-wide">Pending</p>
        <p class="text-xl sm:text-2xl font-bold text-amber-600 mt-1">{{ summary?.byStatus.pending ?? 0 }}</p>
      </div>
      <div class="bg-white border border-slate-200 rounded-lg p-3 sm:p-4 shadow-sm">
        <p class="text-xs font-medium text-emerald-600 uppercase tracking-wide">Confirmed</p>
        <p class="text-xl sm:text-2xl font-bold text-emerald-600 mt-1">
          {{ summary?.byStatus.confirmed ?? 0 }}
        </p>
      </div>
      <div class="bg-white border border-slate-200 rounded-lg p-3 sm:p-4 shadow-sm">
        <p class="text-xs font-medium text-red-600 uppercase tracking-wide">Cancelled</p>
        <p class="text-xl sm:text-2xl font-bold text-red-600 mt-1">{{ summary?.byStatus.cancelled ?? 0 }}</p>
      </div>
    </div>

    <!-- Today's meetings heading -->
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-xl font-semibold text-slate-900">Today's Meetings</h2>
      <NuxtLink
        to="/meetings"
        class="text-sm text-[var(--p-primary-color)] hover:underline font-medium"
      >
        View all meetings
      </NuxtLink>
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
      <p class="text-slate-900 font-semibold mb-2">Failed to load data</p>
      <p class="text-sm text-slate-500 mb-4">{{ error }}</p>
      <Button label="Try Again" @click="loadDashboard" />
    </div>

    <!-- Empty state -->
    <div
      v-else-if="todayMeetings.length === 0"
      class="bg-white border border-slate-200 rounded-lg p-8 sm:p-16 text-center"
    >
      <i class="pi pi-calendar text-5xl text-slate-200 mb-4 block" />
      <p class="text-xl font-semibold text-slate-900 mb-2">No meetings today</p>
      <p class="text-sm text-slate-500 mb-6">Your schedule is clear for today</p>
      <Button label="Schedule Meeting" icon="pi pi-plus" @click="navigateTo('/meetings/new')" />
    </div>

    <!-- Meeting cards -->
    <div v-else class="flex flex-col gap-4">
      <MeetingCard
        v-for="meeting in todayMeetings"
        :key="meeting.id"
        :meeting="meeting"
        variant="compact"
      />
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="flex items-center justify-center gap-2 sm:gap-4 mt-8">
      <Button
        icon="pi pi-arrow-left"
        severity="secondary"
        outlined
        :disabled="currentPage <= 1"
        class="sm:hidden"
        aria-label="Previous"
        @click="currentPage--"
      />
      <Button
        label="Previous"
        icon="pi pi-arrow-left"
        severity="secondary"
        outlined
        :disabled="currentPage <= 1"
        class="hidden sm:inline-flex"
        @click="currentPage--"
      />
      <span class="text-sm text-slate-500 font-medium">
        Page {{ currentPage }} of {{ totalPages }}
      </span>
      <Button
        icon="pi pi-arrow-right"
        severity="secondary"
        outlined
        :disabled="currentPage >= totalPages"
        class="sm:hidden"
        aria-label="Next"
        @click="currentPage++"
      />
      <Button
        label="Next"
        icon="pi pi-arrow-right"
        icon-pos="right"
        severity="secondary"
        outlined
        :disabled="currentPage >= totalPages"
        class="hidden sm:inline-flex"
        @click="currentPage++"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IMeetingSummary } from '@meeting-manager/shared';
import { useMeetingStore } from '~/stores/meeting';

definePageMeta({ middleware: 'auth' });

const { fetchSummary, fetchTodayMeetings } = useMeetings();
const meetingStore = useMeetingStore();

const loading = ref(true);
const error = ref<string | null>(null);
const summary = ref<IMeetingSummary | null>(null);
const currentPage = ref(1);

const todayMeetings = computed(() => meetingStore.meetings);
const pagination = computed(() => meetingStore.pagination);
const totalPages = computed(() => pagination.value?.totalPages ?? 1);

const { formatDateFull } = useDate();

const todayLabel = computed(() => formatDateFull(new Date()));

async function loadDashboard() {
  loading.value = true;
  error.value = null;
  try {
    const [summaryData] = await Promise.all([
      fetchSummary(),
      fetchTodayMeetings({ page: currentPage.value }),
    ]);
    summary.value = summaryData;
  } catch (err: unknown) {
    const e = err as { data?: { error?: { message?: string } } };
    error.value = e?.data?.error?.message || 'Failed to load dashboard data';
  } finally {
    loading.value = false;
  }
}

watch(currentPage, () => {
  fetchTodayMeetings({ page: currentPage.value });
});

onMounted(() => loadDashboard());
</script>
