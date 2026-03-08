<template>
  <div class="bg-white border border-slate-200 rounded-lg shadow-lg p-6 sm:p-8">
    <div class="flex flex-col items-center mb-8">
      <div class="w-16 h-16 rounded-full bg-[var(--p-primary-color)] flex items-center justify-center mb-4">
        <i class="pi pi-user text-white text-2xl" />
      </div>
      <h1 class="text-2xl font-bold text-slate-900">Continue as Guest</h1>
      <p class="text-sm text-slate-500 mt-1">No account required</p>
    </div>

    <form @submit.prevent="handleGuestRegister" class="flex flex-col gap-4">
      <div>
        <label class="block text-sm font-medium text-slate-900 mb-2"
          >Full Name <span class="text-red-500">*</span></label
        >
        <InputText
          v-model="form.fullName"
          placeholder="John Doe"
          class="w-full"
          :class="{ 'border-red-500': errors.fullName }"
          :disabled="loading"
        />
        <small v-if="errors.fullName" class="text-red-500 text-xs mt-1 block">{{
          errors.fullName
        }}</small>
      </div>

      <Message v-if="apiError" severity="error" :closable="false">{{ apiError }}</Message>

      <Button
        type="submit"
        :label="loading ? 'Joining...' : 'Join as Guest'"
        :icon="loading ? 'pi pi-spin pi-spinner' : undefined"
        :disabled="loading"
        class="w-full mt-2"
      />
    </form>

    <p class="mt-6 text-center text-sm text-slate-500">
      Have an account?
      <NuxtLink to="/auth/login" class="text-blue-500 hover:underline font-medium">Login</NuxtLink>
    </p>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'auth' });

const { registerGuest } = useAuth();

const form = reactive({ fullName: '' });
const errors = reactive<Record<string, string>>({});
const loading = ref(false);
const apiError = ref('');

function validate(): boolean {
  Object.keys(errors).forEach((k) => delete errors[k]);
  if (!form.fullName.trim() || form.fullName.length < 2)
    errors.fullName = 'Name must be at least 2 characters';
  return Object.keys(errors).length === 0;
}

async function handleGuestRegister() {
  if (!validate()) return;
  loading.value = true;
  apiError.value = '';
  try {
    await registerGuest(form.fullName);
  } catch (err: unknown) {
    const { data } = err as ApiErrorResponse;
    apiError.value = data?.error?.message || 'Failed to join as guest. Please try again.';
  } finally {
    loading.value = false;
  }
}
</script>
