<template>
  <div>
    <div v-if="feedbacks.length === 0" class="py-8 text-center text-slate-500 text-sm">
      No feedback yet.
    </div>
    <div v-for="(fb, idx) in feedbacks" :key="fb.id">
      <div class="py-4">
        <p v-if="fb.topic" class="text-sm font-medium text-slate-700 mb-1">{{ fb.topic }}</p>
        <div class="flex items-center gap-2 mb-1">
          <StarRating :model-value="fb.rating" size="md" />
          <span class="font-semibold text-slate-900 text-base ml-1">{{ fb.rating }}/5</span>
        </div>
        <p v-if="fb.comment" class="text-sm text-slate-900 leading-relaxed mb-1">
          {{ fb.comment }}
        </p>
        <p class="text-sm text-slate-400">{{ formatDate(fb.createdAt) }}</p>
      </div>
      <hr v-if="idx < feedbacks.length - 1" class="border-slate-200" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IFeedback } from '@meeting-manager/shared';

defineProps<{ feedbacks: IFeedback[] }>();

const { formatDate } = useDate();
</script>
