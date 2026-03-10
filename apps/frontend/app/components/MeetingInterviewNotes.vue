<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
    <!-- General Notes (readonly) -->
    <div class="bg-white border border-slate-200 rounded-lg p-4 sm:p-6 shadow-sm">
      <h2 class="text-lg font-semibold text-slate-900 border-b-2 border-slate-200 pb-2 mb-4">
        Notes
      </h2>
      <p
        v-if="notes"
        class="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap"
      >
        {{ notes }}
      </p>
      <p v-else class="text-sm text-slate-400 italic">No notes.</p>
    </div>

    <!-- Interview Notes -->
    <div class="bg-white border border-slate-200 rounded-lg shadow-sm">
      <div
        class="flex items-center justify-between px-4 sm:px-6 py-4 border-b-2 border-slate-200"
      >
        <h2 class="text-lg font-semibold text-slate-900">Interview Notes</h2>
        <Button
          :label="saving ? 'Saving...' : 'Save'"
          :icon="saving ? 'pi pi-spin pi-spinner' : 'pi pi-save'"
          severity="secondary"
          variant="outlined"
          size="small"
          :disabled="saving"
          @click="$emit('save')"
        />
      </div>
      <div class="p-4 sm:p-6">
        <Textarea
          :model-value="modelValue"
          placeholder="Interview-specific notes..."
          :rows="4"
          class="w-full"
          style="resize: vertical"
          @update:model-value="$emit('update:modelValue', $event)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  notes?: string;
  modelValue: string;
  saving: boolean;
}>();

defineEmits<{
  save: [];
  'update:modelValue': [value: string];
}>();
</script>
