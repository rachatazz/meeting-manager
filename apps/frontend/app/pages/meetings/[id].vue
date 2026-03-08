<template>
  <div class="max-w-5xl mx-auto px-4 sm:px-8 py-6 sm:py-8">
    <NuxtLink
      to="/dashboard"
      class="inline-flex items-center gap-2 text-sm text-blue-500 hover:underline mb-6"
    >
      <i class="pi pi-arrow-left text-xs" />
      Back to Dashboard
    </NuxtLink>

    <!-- Loading -->
    <div v-if="loading" class="flex flex-col gap-4">
      <div class="bg-white border border-slate-200 rounded-lg p-6 h-28 shimmer" />
      <div class="bg-white border border-slate-200 rounded-lg p-6 h-40 shimmer" />
    </div>

    <!-- Error -->
    <div v-else-if="error" class="bg-white border border-slate-200 rounded-lg p-12 text-center">
      <i class="pi pi-exclamation-triangle text-4xl text-red-400 mb-3 block" />
      <p class="text-slate-900 font-semibold mb-4">{{ error }}</p>
      <Button label="Back to Dashboard" @click="navigateTo('/dashboard')" />
    </div>

    <template v-else-if="meeting">
      <!-- ==================== EDIT MODE ==================== -->
      <template v-if="isEditing">
        <h1 class="text-2xl sm:text-3xl font-bold text-slate-900 mb-6 sm:mb-8">Edit Meeting</h1>
        <MeetingForm
          mode="edit"
          :meeting="meeting"
          :loading="saving"
          @cancel="isEditing = false"
          @submit="handleUpdate"
        />

        <!-- Danger Zone -->
        <div class="border border-red-300 rounded-lg mt-8">
          <div class="bg-red-50 px-4 sm:px-6 py-4 rounded-t-lg border-b border-red-300">
            <h2 class="text-lg font-semibold text-red-700">Danger Zone</h2>
          </div>
          <div class="px-4 sm:px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p class="text-sm font-medium text-slate-900">Delete this meeting</p>
              <p class="text-sm text-slate-500 mt-0.5">
                Once deleted, this meeting and all its feedback cannot be recovered.
              </p>
            </div>
            <Button
              label="Delete Meeting"
              icon="pi pi-trash"
              severity="danger"
              variant="outlined"
              size="small"
              class="flex-shrink-0 w-full sm:w-auto"
              @click="showDeleteDialog = true"
            />
          </div>
        </div>
      </template>

      <!-- ==================== VIEW MODE ==================== -->
      <template v-else>
        <!-- Header -->
        <div class="bg-white border border-slate-200 rounded-lg shadow-sm mb-6">
          <div class="p-4 sm:p-6">
            <!-- Top row: Title + Actions -->
            <div class="flex items-start justify-between gap-4 mb-4">
              <div class="min-w-0">
                <h1 class="text-xl sm:text-2xl font-bold text-slate-900">{{ meeting.title }}</h1>
                <p v-if="meeting.description" class="text-sm text-slate-500 mt-1 leading-relaxed">
                  {{ meeting.description }}
                </p>
              </div>
              <div class="flex items-center gap-2 flex-shrink-0">
                <Button
                  v-if="meeting.status === 'pending'"
                  label="Confirm"
                  icon="pi pi-check"
                  size="small"
                  severity="success"
                  :loading="confirmingStatus"
                  @click="handleConfirmStatus"
                />
                <Button
                  icon="pi pi-pen-to-square"
                  severity="secondary"
                  variant="outlined"
                  size="small"
                  aria-label="Edit Meeting"
                  @click="isEditing = true"
                />
              </div>
            </div>

            <!-- Status + Meta -->
            <div class="flex flex-wrap items-center gap-3 mb-5">
              <StatusBadge :status="meeting.status" />
              <span class="text-xs text-slate-400">
                Created {{ formatDate(meeting.createdAt) }}
                <span v-if="meeting.createdBy?.fullName"> by {{ meeting.createdBy.fullName }}</span>
              </span>
            </div>

            <!-- Candidate + Schedule grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <!-- Candidate -->
              <div class="flex items-center gap-3">
                <div
                  class="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                >
                  {{ getInitials(meeting.candidateName) }}
                </div>
                <div class="min-w-0">
                  <p class="text-sm font-semibold text-slate-900">{{ meeting.candidateName }}</p>
                  <p class="text-xs text-slate-500">{{ meeting.position }}</p>
                </div>
              </div>

              <!-- Schedule -->
              <div class="flex flex-col gap-1.5 text-sm">
                <div class="flex items-center gap-2">
                  <i class="pi pi-calendar text-slate-400 text-sm w-4" />
                  <span class="text-slate-700">{{
                    formatDateRange(meeting.startTime, meeting.endTime)
                  }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <i
                    :class="meeting.meetingType === 'online' ? 'pi pi-video' : 'pi pi-map-marker'"
                    class="text-slate-400 text-sm w-4"
                  />
                  <span class="text-slate-700">
                    {{
                      meeting.meetingType === 'online'
                        ? `Online (${meeting.platform || 'N/A'})`
                        : 'Onsite'
                    }}
                  </span>
                </div>
                <div v-if="meeting.meetingLink" class="flex items-center gap-2">
                  <i class="pi pi-link text-slate-400 text-sm w-4" />
                  <a
                    :href="meeting.meetingLink"
                    target="_blank"
                    class="text-blue-500 hover:underline truncate text-sm"
                  >
                    {{ meeting.meetingLink }}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Notes -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <!-- General Notes (readonly) -->
          <div class="bg-white border border-slate-200 rounded-lg p-4 sm:p-6 shadow-sm">
            <h2 class="text-lg font-semibold text-slate-900 border-b-2 border-slate-200 pb-2 mb-4">
              Notes
            </h2>
            <p
              v-if="meeting.notes"
              class="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap"
            >
              {{ meeting.notes }}
            </p>
            <p v-else class="text-sm text-slate-400 italic">No notes.</p>
          </div>

          <!-- Interview Notes -->
          <div class="bg-white border border-slate-200 rounded-lg shadow-sm">
            <div class="flex items-center justify-between px-4 sm:px-6 py-4 border-b-2 border-slate-200">
              <h2 class="text-lg font-semibold text-slate-900">Interview Notes</h2>
              <Button
                :label="savingInterviewNotes ? 'Saving...' : 'Save'"
                :icon="savingInterviewNotes ? 'pi pi-spin pi-spinner' : 'pi pi-save'"
                severity="secondary"
                variant="outlined"
                size="small"
                :disabled="savingInterviewNotes"
                @click="saveInterviewNotes"
              />
            </div>
            <div class="p-4 sm:p-6">
              <Textarea
                v-model="interviewNotes"
                placeholder="Interview-specific notes..."
                :rows="4"
                class="w-full"
                style="resize: vertical"
              />
            </div>
          </div>
        </div>

        <!-- Feedback -->
        <div class="bg-white border border-slate-200 rounded-lg p-4 sm:p-6 shadow-sm">
          <div class="flex items-center justify-between border-b-2 border-slate-200 pb-2 mb-4">
            <h2 class="text-lg font-semibold text-slate-900">Feedback & Evaluations</h2>
            <Button
              label="Add"
              icon="pi pi-plus"
              size="small"
              severity="secondary"
              variant="outlined"
              @click="showFeedbackDialog = true"
            />
          </div>
          <FeedbackList :feedbacks="meeting.feedback" />
        </div>
      </template>
    </template>

    <!-- Delete Confirmation Dialog -->
    <Dialog
      v-model:visible="showDeleteDialog"
      header="Delete Meeting"
      :style="{ width: '450px', maxWidth: '90vw' }"
      modal
    >
      <div class="flex items-start gap-3">
        <i class="pi pi-exclamation-triangle text-2xl text-red-500 mt-0.5" />
        <div>
          <p class="text-sm text-slate-700">
            Are you sure you want to delete <span class="font-semibold">{{ meeting?.title }}</span>?
          </p>
          <p class="text-sm text-slate-500 mt-1">This action cannot be undone.</p>
        </div>
      </div>
      <template #footer>
        <div class="flex justify-end gap-2">
          <Button
            label="Cancel"
            severity="secondary"
            variant="outlined"
            size="small"
            @click="showDeleteDialog = false"
          />
          <Button
            label="Delete"
            icon="pi pi-trash"
            severity="danger"
            size="small"
            :loading="deleting"
            @click="handleDelete"
          />
        </div>
      </template>
    </Dialog>

    <!-- Feedback Dialog -->
    <Dialog
      v-model:visible="showFeedbackDialog"
      header="Add Feedback"
      :style="{ width: '500px', maxWidth: '90vw' }"
      modal
    >
      <FeedbackForm @cancel="showFeedbackDialog = false" @submitted="handleFeedbackSubmit" />
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { useMeetingStore } from '~/stores/meeting';

definePageMeta({ middleware: 'auth' });

const route = useRoute();
const { fetchMeeting, updateMeeting, deleteMeeting, addFeedback } = useMeetings();
const toast = useToast();

const meetingStore = useMeetingStore();
const meeting = computed(() => meetingStore.currentMeeting);
const loading = computed(() => meetingStore.loading);
const error = computed(() => meetingStore.error);

const isEditing = ref(route.query.edit === '1');
const interviewNotes = ref('');
const savingInterviewNotes = ref(false);
const saving = ref(false);
const showFeedbackDialog = ref(false);
const showDeleteDialog = ref(false);
const deleting = ref(false);
const confirmingStatus = ref(false);

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatDateRange(start: string, end: string): string {
  const s = new Date(start);
  const e = new Date(end);
  const date = s.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const startTime = s.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  const endTime = e.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  return `${date} · ${startTime} – ${endTime}`;
}

async function handleConfirmStatus() {
  if (!meeting.value) return;
  confirmingStatus.value = true;
  try {
    await updateMeeting(meeting.value.id, { status: 'confirmed' });
    toast.add({ severity: 'success', summary: 'Meeting confirmed', life: 3000 });
    await fetchMeeting(route.params.id as string);
  } catch (err: unknown) {
    const { data } = err as ApiErrorResponse;
    toast.add({
      severity: 'error',
      summary: data?.error?.message || 'Failed to confirm meeting',
      life: 3000,
    });
  } finally {
    confirmingStatus.value = false;
  }
}

async function saveInterviewNotes() {
  if (!meeting.value) return;
  savingInterviewNotes.value = true;
  try {
    await updateMeeting(meeting.value.id, { interviewNotes: interviewNotes.value });
    toast.add({ severity: 'success', summary: 'Interview notes saved', life: 3000 });
  } catch {
    toast.add({ severity: 'error', summary: 'Failed to save interview notes', life: 3000 });
  } finally {
    savingInterviewNotes.value = false;
  }
}

async function handleUpdate(payload: Parameters<typeof updateMeeting>[1]) {
  saving.value = true;
  try {
    await updateMeeting(route.params.id as string, payload);
    toast.add({ severity: 'success', summary: 'Meeting updated successfully!', life: 3000 });
    isEditing.value = false;
    await fetchMeeting(route.params.id as string);
  } catch (err: unknown) {
    const { data } = err as ApiErrorResponse;
    toast.add({
      severity: 'error',
      summary: data?.error?.message || 'Failed to update meeting',
      life: 4000,
    });
  } finally {
    saving.value = false;
  }
}

async function handleDelete() {
  if (!meeting.value) return;
  deleting.value = true;
  try {
    await deleteMeeting(meeting.value.id);
    toast.add({ severity: 'success', summary: 'Meeting deleted', life: 3000 });
    navigateTo('/dashboard');
  } catch (err: unknown) {
    const { data } = err as ApiErrorResponse;
    toast.add({
      severity: 'error',
      summary: data?.error?.message || 'Failed to delete meeting',
      life: 3000,
    });
  } finally {
    deleting.value = false;
    showDeleteDialog.value = false;
  }
}

async function handleFeedbackSubmit(payload: { rating: number; topic?: string; comment?: string }) {
  if (!meeting.value) return;
  try {
    await addFeedback(meeting.value.id, payload);
    showFeedbackDialog.value = false;
    toast.add({ severity: 'success', summary: 'Feedback submitted', life: 3000 });
    await fetchMeeting(route.params.id as string);
  } catch (err: unknown) {
    const { data } = err as ApiErrorResponse;
    toast.add({
      severity: 'error',
      summary: data?.error?.message || 'Failed to submit feedback',
      life: 3000,
    });
  }
}

onMounted(async () => {
  const id = route.params.id as string;
  await fetchMeeting(id);
  if (meetingStore.currentMeeting) {
    interviewNotes.value = meetingStore.currentMeeting.interviewNotes || '';
  }
});
</script>
