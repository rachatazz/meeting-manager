<template>
  <div class="max-w-5xl mx-auto px-4 sm:px-8 py-6 sm:py-8">
    <NuxtLink to="/dashboard" class="inline-flex items-center gap-2 text-sm text-blue-500 hover:underline mb-6">
      <i class="pi pi-arrow-left text-xs" />
      Back to Dashboard
    </NuxtLink>

    <h1 class="text-2xl sm:text-3xl font-bold text-slate-900 mb-6 sm:mb-8">Schedule a New Meeting</h1>

    <MeetingForm
      mode="create"
      :loading="loading"
      @cancel="navigateTo('/dashboard')"
      @submit="handleSubmit"
    />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' });

const { createMeeting } = useMeetings();
const toast = useToast();
const loading = ref(false);

async function handleSubmit(payload: Parameters<typeof createMeeting>[0]) {
  loading.value = true;
  try {
    const meeting = await createMeeting(payload);
    toast.add({ severity: 'success', summary: 'Meeting scheduled successfully!', life: 3000 });
    await navigateTo(`/meetings/${meeting.id}`);
  } catch (err: unknown) {
    const error = err as { data?: { error?: { message?: string } } };
    toast.add({ severity: 'error', summary: error?.data?.error?.message || 'Failed to schedule meeting', life: 4000 });
  } finally {
    loading.value = false;
  }
}
</script>
