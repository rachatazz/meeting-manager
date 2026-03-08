<template>
  <div class="min-h-screen bg-slate-50 flex items-center justify-center">
    <ProgressSpinner style="width: 48px; height: 48px" />
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth';

const authStore = useAuthStore();

if (authStore.isAuthenticated) {
  await navigateTo('/dashboard');
} else {
  await navigateTo('/auth/login');
}
</script>
