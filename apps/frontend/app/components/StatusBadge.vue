<template>
  <span class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium">
    <i :class="iconClass" class="text-[14px]" />
    {{ label }}
  </span>
</template>

<script setup lang="ts">
import type { MeetingStatus } from '@meeting-manager/shared';

const props = defineProps<{ status: MeetingStatus }>();

const config: Record<MeetingStatus, { bg: string; text: string; icon: string; label: string }> = {
  confirmed: { bg: '#D1FAE5', text: '#065F46', icon: 'pi pi-check-circle', label: 'Confirmed' },
  pending: { bg: '#FEF3C7', text: '#92400E', icon: 'pi pi-clock', label: 'Pending' },
  cancelled: { bg: '#FEE2E2', text: '#991B1B', icon: 'pi pi-times-circle', label: 'Cancelled' },
};

const currentConfig = computed(() => config[props.status]);
const label = computed(() => currentConfig.value.label);
const iconClass = computed(() => currentConfig.value.icon);
</script>

<style scoped>
span {
  background-color: v-bind('currentConfig.bg');
  color: v-bind('currentConfig.text');
}
</style>
