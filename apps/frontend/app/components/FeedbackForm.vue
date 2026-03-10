<template>
  <div>
    <div class="mb-4">
      <label class="block text-sm font-medium text-slate-900 mb-2"
        >Topic <span class="text-red-500">*</span></label
      >
      <InputText
        v-model="form.topic"
        placeholder="e.g. Technical Skills, Communication..."
        class="w-full"
      />
      <small v-if="errors.topic" class="text-red-500 text-xs mt-1">{{ errors.topic }}</small>
    </div>

    <div class="mb-4">
      <label class="block text-sm font-medium text-slate-900 mb-2"
        >Rating <span class="text-red-500">*</span></label
      >
      <StarRating v-model="form.rating" :interactive="true" size="lg" />
      <small v-if="errors.rating" class="text-red-500 text-xs mt-1">{{ errors.rating }}</small>
    </div>

    <div class="mb-6">
      <label class="block text-sm font-medium text-slate-900 mb-2">Comment</label>
      <Textarea
        v-model="form.comment"
        placeholder="Share your feedback..."
        :rows="4"
        class="w-full"
        style="resize: vertical"
      />
    </div>

    <div class="flex justify-end gap-3">
      <Button
        type="button"
        label="Cancel"
        severity="secondary"
        outlined
        @click="$emit('cancel')"
      />
      <Button
        type="button"
        :label="loading ? 'Submitting...' : 'Submit'"
        :icon="loading ? 'pi pi-spin pi-spinner' : undefined"
        :disabled="loading"
        @click="handleSubmit"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  cancel: [];
  submitted: [{ rating: number; topic: string; comment?: string }];
}>();

const form = reactive({ rating: 0, topic: '', comment: '' });
const errors = reactive<Record<string, string>>({});
const loading = ref(false);

function validate(): boolean {
  Object.keys(errors).forEach((k) => delete errors[k]);
  if (!form.topic.trim()) errors.topic = 'Topic is required';
  if (!form.rating) errors.rating = 'Rating is required';
  return Object.keys(errors).length === 0;
}

async function handleSubmit() {
  if (!validate()) return;
  loading.value = true;
  try {
    emit('submitted', {
      rating: form.rating,
      topic: form.topic.trim(),
      ...(form.comment.trim() && { comment: form.comment.trim() }),
    });
  } finally {
    loading.value = false;
  }
}
</script>
