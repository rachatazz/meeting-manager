<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-4">
    <!-- Title (full width) -->
    <div class="sm:col-span-2">
      <label class="block text-sm font-medium text-slate-700 mb-1"
        >Title <span class="text-red-500">*</span></label
      >
      <InputText
        :model-value="form.title"
        placeholder="e.g., Technical Interview - Round 1"
        class="w-full"
        :class="{ 'border-red-500': errors.title }"
        @update:model-value="$emit('update', 'title', $event)"
      />
      <small v-if="errors.title" class="text-red-500 text-xs mt-0.5 block">{{
        errors.title
      }}</small>
    </div>
    <!-- Description (full width) -->
    <div class="sm:col-span-2">
      <label class="block text-sm font-medium text-slate-700 mb-1">Description</label>
      <Textarea
        :model-value="form.description"
        placeholder="Brief description of the meeting..."
        :rows="2"
        class="w-full"
        style="resize: vertical"
        @update:model-value="$emit('update', 'description', $event)"
      />
    </div>
    <!-- Candidate Name -->
    <div>
      <label class="block text-sm font-medium text-slate-700 mb-1"
        >Candidate Name <span class="text-red-500">*</span></label
      >
      <div class="relative">
        <InputText
          :model-value="form.candidateName"
          placeholder="Start typing to search..."
          class="w-full pr-10"
          :class="{ 'border-red-500': errors.candidateName }"
          @update:model-value="$emit('update', 'candidateName', $event)"
        />
        <i
          class="pi pi-search absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none"
        />
      </div>
      <small v-if="errors.candidateName" class="text-red-500 text-xs mt-0.5 block">{{
        errors.candidateName
      }}</small>
    </div>
    <!-- Position -->
    <div>
      <label class="block text-sm font-medium text-slate-700 mb-1"
        >Position <span class="text-red-500">*</span></label
      >
      <Select
        :model-value="form.position"
        :options="positions"
        editable
        placeholder="Select Position"
        class="w-full"
        :class="{ 'border-red-500': errors.position }"
        @update:model-value="$emit('update', 'position', $event)"
      />
      <small v-if="errors.position" class="text-red-500 text-xs mt-0.5 block">{{
        errors.position
      }}</small>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  form: {
    title: string;
    description: string;
    candidateName: string;
    position: string;
  };
  errors: Record<string, string>;
}>();

defineEmits<{
  update: [field: string, value: unknown];
}>();

const positions = [
  'Software Engineer',
  'Backend Developer',
  'Frontend Developer',
  'Full Stack Developer',
  'DevOps Engineer',
  'QA Engineer',
  'Product Manager',
  'UI/UX Designer',
];
</script>
