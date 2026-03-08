<template>
  <div class="min-h-screen bg-slate-50 flex items-center justify-center px-4">
    <div class="text-center">
      <div class="text-8xl font-bold text-slate-200 mb-4">{{ error?.statusCode }}</div>
      <h1 class="text-2xl font-bold text-slate-900 mb-3">
        {{ error?.statusCode === 404 ? 'Page Not Found' : 'Something went wrong' }}
      </h1>
      <p class="text-slate-500 mb-8 max-w-md mx-auto">
        {{ error?.statusCode === 404
          ? "The page you're looking for doesn't exist or has been moved."
          : 'An unexpected error occurred. Please try again later.' }}
      </p>
      <button
        class="h-10 px-6 bg-[var(--p-primary-color,#F97316)] hover:opacity-90 text-white font-medium rounded-md transition-opacity duration-200"
        @click="handleError"
      >
        Go to Dashboard
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  error: { statusCode: number; message: string } | null;
}>();

function handleError() {
  clearError({ redirect: '/dashboard' });
}
</script>
