<template>
  <div class="bg-white border border-slate-200 rounded-lg shadow-lg p-6 sm:p-8">
    <!-- Logo -->
    <div class="flex flex-col items-center mb-8">
      <div class="w-16 h-16 rounded-full bg-[var(--p-primary-color)] flex items-center justify-center mb-4">
        <i class="pi pi-user-plus text-white text-2xl" />
      </div>
      <h1 class="text-2xl font-bold text-slate-900">Create Account</h1>
      <p class="text-sm text-slate-500 mt-1">Join our team</p>
    </div>

    <form @submit.prevent="handleRegister" class="flex flex-col gap-4">
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

      <div>
        <label class="block text-sm font-medium text-slate-900 mb-2"
          >Email <span class="text-red-500">*</span></label
        >
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
        <label class="block text-sm font-medium text-slate-900 mb-2"
          >Password <span class="text-red-500">*</span></label
        >
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
        <!-- Password strength bar -->
        <div class="mt-2 h-1 rounded bg-slate-200 overflow-hidden">
          <div
            class="h-full rounded transition-all duration-300"
            :style="{ width: `${passwordStrength.pct}%`, backgroundColor: passwordStrength.color }"
          />
        </div>
        <small v-if="errors.password" class="text-red-500 text-xs mt-1 block">{{
          errors.password
        }}</small>
      </div>

      <div>
        <label class="block text-sm font-medium text-slate-900 mb-2"
          >Confirm Password <span class="text-red-500">*</span></label
        >
        <Password
          v-model="form.confirmPassword"
          placeholder="••••••••"
          :feedback="false"
          toggle-mask
          class="w-full"
          input-class="w-full"
          :class="{ 'border-red-500': errors.confirmPassword }"
          :disabled="loading"
        />
        <small v-if="errors.confirmPassword" class="text-red-500 text-xs mt-1 block">{{
          errors.confirmPassword
        }}</small>
      </div>

      <div>
        <label class="block text-sm font-medium text-slate-900 mb-2"
          >Role <span class="text-red-500">*</span></label
        >
        <Select
          v-model="form.role"
          :options="roles"
          option-label="label"
          option-value="value"
          placeholder="Select Role"
          class="w-full"
          :class="{ 'border-red-500': errors.role }"
          disabled
        />
        <small v-if="errors.role" class="text-red-500 text-xs mt-1 block">{{ errors.role }}</small>
      </div>

      <Message v-if="apiError" severity="error" :closable="false">{{ apiError }}</Message>

      <Button
        type="submit"
        :label="loading ? 'Creating account...' : 'Create Account'"
        :icon="loading ? 'pi pi-spin pi-spinner' : undefined"
        :disabled="loading"
        class="w-full mt-2"
      />
    </form>

    <p class="mt-6 text-center text-sm text-slate-500">
      Already have an account?
      <NuxtLink to="/auth/login" class="text-blue-500 hover:underline font-medium">Login</NuxtLink>
    </p>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'auth' });

const { register } = useAuth();

const roles = [
  { label: 'Recruiter', value: 'recruiter' },
  { label: 'Interviewer', value: 'interviewer' },
];

const form = reactive({ fullName: '', email: '', password: '', confirmPassword: '', role: 'recruiter' });
const errors = reactive<Record<string, string>>({});
const loading = ref(false);
const apiError = ref('');

const passwordStrength = computed(() => {
  const p = form.password;
  if (!p) return { pct: 0, color: '#E2E8F0' };
  let score = 0;
  if (p.length >= 8) score++;
  if (/[A-Z]/.test(p)) score++;
  if (/[0-9]/.test(p)) score++;
  if (/[^A-Za-z0-9]/.test(p)) score++;
  const colors = ['#EF4444', '#F59E0B', '#F59E0B', '#10B981', '#10B981'];
  return { pct: (score / 4) * 100, color: colors[score] };
});

function validate(): boolean {
  Object.keys(errors).forEach((k) => delete errors[k]);
  if (!form.fullName.trim() || form.fullName.length < 2)
    errors.fullName = 'Full name must be at least 2 characters';
  if (!form.email) errors.email = 'Email is required';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Invalid email format';
  if (!form.password || form.password.length < 8)
    errors.password = 'Password must be at least 8 characters';
  if (form.password !== form.confirmPassword) errors.confirmPassword = 'Passwords do not match';
  if (!form.role) errors.role = 'Role is required';
  return Object.keys(errors).length === 0;
}

async function handleRegister() {
  if (!validate()) return;
  loading.value = true;
  apiError.value = '';
  try {
    await register(form.fullName, form.email, form.password, form.role);
  } catch (err: unknown) {
    const { data } = err as ApiErrorResponse;
    if (data?.error?.details) {
      data.error.details.forEach((d) => {
        errors[d.field] = d.message;
      });
    } else {
      apiError.value = data?.error?.message || 'Registration failed. Please try again.';
    }
  } finally {
    loading.value = false;
  }
}
</script>
