<template>
  <div class="bg-white border border-slate-200 rounded-lg p-4 sm:p-6 shadow-sm">
    <div class="flex items-center justify-between border-b-2 border-slate-200 pb-2 mb-4">
      <h2 class="text-lg font-semibold text-slate-900">Feedback & Evaluations</h2>
      <Button
        label="Add"
        icon="pi pi-plus"
        size="small"
        severity="secondary"
        variant="outlined"
        @click="$emit('add')"
      />
    </div>
    <FeedbackList :feedbacks="feedbacks" />
  </div>
</template>

<script setup lang="ts">
import type { IFeedback } from '@meeting-manager/shared';

defineProps<{
  feedbacks: IFeedback[];
}>();

defineEmits<{
  add: [];
}>();
</script>
