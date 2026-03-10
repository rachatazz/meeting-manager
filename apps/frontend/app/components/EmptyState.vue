<template>
  <div class="bg-white border border-slate-200 rounded-lg p-8 sm:p-16 text-center">
    <i :class="icon" class="text-4xl sm:text-5xl text-slate-200 mb-4 block" />
    <p class="text-lg sm:text-xl font-semibold text-slate-900 mb-2">{{ title }}</p>
    <p v-if="description" class="text-sm text-slate-500 mb-6">{{ description }}</p>
    <slot />
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    icon?: string;
    title: string;
    description?: string;
  }>(),
  {
    icon: 'pi pi-calendar',
  },
);
</script>
