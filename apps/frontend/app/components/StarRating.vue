<template>
  <div class="flex items-center gap-0.5">
    <button
      v-for="star in max"
      :key="star"
      type="button"
      class="leading-none transition-colors duration-150 focus:outline-none"
      :class="[interactive ? 'cursor-pointer p-1' : 'cursor-default', sizeClass]"
      :style="{ color: star <= displayValue ? activeColor : inactiveColor }"
      :disabled="!interactive"
      @mouseenter="interactive && (hoverValue = star)"
      @mouseleave="interactive && (hoverValue = 0)"
      @click="interactive && $emit('update:modelValue', star)"
    >
      ★
    </button>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    modelValue: number;
    max?: number;
    interactive?: boolean;
    size?: 'sm' | 'md' | 'lg';
    activeColor?: string;
    inactiveColor?: string;
  }>(),
  {
    max: 5,
    interactive: false,
    size: 'md',
    activeColor: '#F59E0B',
    inactiveColor: '#E2E8F0',
  },
);

defineEmits<{
  'update:modelValue': [value: number];
}>();

const hoverValue = ref(0);

const displayValue = computed(() =>
  props.interactive && hoverValue.value ? hoverValue.value : Math.round(props.modelValue),
);

const sizeClass = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'text-lg';
    case 'lg':
      return 'text-3xl';
    default:
      return 'text-xl';
  }
});
</script>
