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
          <div
            class="px-4 sm:px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          >
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
        <MeetingDetailHeader
          :meeting="meeting"
          :confirming-status="confirmingStatus"
          @confirm="handleConfirmStatus"
          @edit="isEditing = true"
        />

        <MeetingInterviewNotes
          v-model="interviewNotes"
          :notes="meeting.notes"
          :saving="savingInterviewNotes"
          @save="saveInterviewNotes"
        />

        <MeetingFeedbackSection
          :feedbacks="meeting.feedback"
          @add="showFeedbackDialog = true"
        />
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
            Are you sure you want to delete <span class="font-semibold">{{ meeting?.title }}</span
            >?
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
