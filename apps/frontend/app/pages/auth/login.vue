<template>
  <div class="bg-white border border-slate-200 rounded-lg shadow-lg p-6 sm:p-8">
    <!-- Logo -->
    <div class="flex flex-col items-center mb-8">
      <div class="w-16 h-16 rounded-full bg-[var(--p-primary-color)] flex items-center justify-center mb-4">
        <i class="pi pi-calendar text-white text-2xl" />
      </div>
      <h1 class="text-2xl font-bold text-slate-900">Meeting Manager</h1>
      <p class="text-sm text-slate-500 mt-1">Candidate Scheduler</p>
    </div>

    <form @submit.prevent="handleLogin" class="flex flex-col gap-4">
      <div>
        <label class="block text-sm font-medium text-slate-900 mb-2">Email</label>
        <InputText
          v-model="form.email"
          type="email"
          placeholder="your.email@company.com"
          class="w-full"
          :class="{ 'border-red-500': errors.email }"
          :disabled="loading"
        />
        <small v-if="errors.email" class="text-red-500 text-xs mt-1 block">{{
          errors.email
        }}</small>
      </div>

      <div>
        <label class="block text-sm font-medium text-slate-900 mb-2">Password</label>
        <Password
          v-model="form.password"
          placeholder="••••••••"
          :feedback="false"
          toggle-mask
          class="w-full"
          input-class="w-full"
          :class="{ 'border-red-500': errors.password }"
          :disabled="loading"
        />
        <small v-if="errors.password" class="text-red-500 text-xs mt-1 block">{{
          errors.password
        }}</small>
      </div>

      <Message v-if="apiError" severity="error" :closable="false" class="mt-1">{{
        apiError
      }}</Message>

      <Button
        type="submit"
        :label="loading ? 'Logging in...' : 'Login'"
        :icon="loading ? 'pi pi-spin pi-spinner' : undefined"
        :disabled="loading"
        class="w-full mt-2"
      />
    </form>

    <div class="flex items-center gap-3 my-6">
      <div class="flex-1 h-px bg-slate-200" />
      <span class="text-sm text-slate-500">or</span>
      <div class="flex-1 h-px bg-slate-200" />
    </div>

    <Button
      label="Continue as Guest"
      icon="pi pi-user"
      severity="secondary"
      outlined
      :disabled="loading || guestLoading"
      :loading="guestLoading"
      class="w-full"
      @click="handleContinueAsGuest"
    />

    <p class="mt-6 text-center text-sm text-slate-500">
      Don't have an account?
      <NuxtLink to="/auth/register" class="text-blue-500 hover:underline font-medium"
        >Register</NuxtLink
      >
    </p>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'auth' });

const { login, loginGuest, getStoredFingerprint } = useAuth();

const form = reactive({ email: '', password: '' });
const errors = reactive<Record<string, string>>({});
const loading = ref(false);
const guestLoading = ref(false);
const apiError = ref('');

function validate(): boolean {
  Object.keys(errors).forEach((k) => delete errors[k]);
  if (!form.email) errors.email = 'Email is required';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Invalid email format';
  if (!form.password) errors.password = 'Password is required';
  else if (form.password.length < 6) errors.password = 'Password must be at least 6 characters';
  return Object.keys(errors).length === 0;
}

async function handleContinueAsGuest() {
  const fingerprint = getStoredFingerprint();
  if (!fingerprint) {
    await navigateTo('/auth/register-guest');
    return;
  }
  guestLoading.value = true;
  apiError.value = '';
  try {
    await loginGuest(fingerprint);
  } catch {
    await navigateTo('/auth/register-guest');
  } finally {
    guestLoading.value = false;
  }
}

async function handleLogin() {
  if (!validate()) return;
  loading.value = true;
  apiError.value = '';
  try {
    await login(form.email, form.password);
  } catch (err: unknown) {
    const { data } = err as ApiErrorResponse;
    if (data?.error?.details) {
      data.error.details.forEach((d) => {
        errors[d.field] = d.message;
      });
    } else {
      apiError.value = data?.error?.message || 'Login failed. Please try again.';
    }
  } finally {
    loading.value = false;
  }
}
</script>
