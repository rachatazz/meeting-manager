<template>
  <div
    v-if="hasActiveFilters"
    class="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-slate-100"
  >
    <span class="text-xs text-slate-400">Filters:</span>
    <span
      v-if="search"
      class="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 rounded text-xs text-slate-600"
    >
      "{{ search }}"
      <i
        class="pi pi-times text-[10px] cursor-pointer hover:text-slate-900"
        @click="$emit('clearSearch')"
      />
    </span>
    <span
      v-if="dateRange && dateRange[0]"
      class="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 rounded text-xs text-slate-600"
    >
      {{ formatDateLabel(dateRange) }}
      <i
        class="pi pi-times text-[10px] cursor-pointer hover:text-slate-900"
        @click="$emit('clearDates')"
      />
    </span>
    <span
      v-if="status"
      class="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 rounded text-xs text-slate-600 capitalize"
    >
      {{ status }}
      <i
        class="pi pi-times text-[10px] cursor-pointer hover:text-slate-900"
        @click="$emit('clearStatus')"
      />
    </span>
    <button
      class="text-xs text-[var(--p-primary-color)] hover:underline ml-auto"
      @click="$emit('clearAll')"
    >
      Clear all
    </button>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  search: string;
  dateRange: Date[] | null;
  status: string;
}>();

defineEmits<{
  clearSearch: [];
  clearDates: [];
  clearStatus: [];
  clearAll: [];
}>();

const { formatDateShort } = useDate();

const hasActiveFilters = computed(
  () => props.search || props.status || (props.dateRange && props.dateRange[0]),
);

function formatDateLabel(range: Date[] | null): string {
  if (!range || !range[0]) return '';
  if (!range[1]) return formatDateShort(range[0]);
  return `${formatDateShort(range[0])} – ${formatDateShort(range[1])}`;
}
</script>
