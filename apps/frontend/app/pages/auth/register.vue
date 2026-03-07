<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-50">
    <div class="w-full max-w-md">
      <div class="bg-white rounded-2xl shadow-md p-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-6 text-center">Register</h2>

        <form @submit.prevent="handleRegister" class="flex flex-col gap-4">
          <div class="flex flex-col gap-1">
            <label class="text-sm font-medium text-gray-700">Full Name</label>
            <InputText
              v-model="form.fullName"
              placeholder="John Doe"
              :invalid="!!errors.fullName"
              class="w-full"
            />
            <small v-if="errors.fullName" class="text-red-500">{{ errors.fullName }}</small>
          </div>

          <div class="flex flex-col gap-1">
            <label class="text-sm font-medium text-gray-700">Email</label>
            <InputText
              v-model="form.email"
              type="email"
              placeholder="you@example.com"
              :invalid="!!errors.email"
              class="w-full"
            />
            <small v-if="errors.email" class="text-red-500">{{ errors.email }}</small>
          </div>

          <div class="flex flex-col gap-1">
            <label class="text-sm font-medium text-gray-700">Password</label>
            <Password
              v-model="form.password"
              placeholder="Min 8 chars, 1 upper, 1 number, 1 special"
              :invalid="!!errors.password"
              input-class="w-full"
              class="w-full"
            />
            <small v-if="errors.password" class="text-red-500">{{ errors.password }}</small>
          </div>

          <div class="flex flex-col gap-1">
            <label class="text-sm font-medium text-gray-700">Role</label>
            <Select
              v-model="form.role"
              :options="roles"
              option-label="label"
              option-value="value"
              class="w-full"
            />
          </div>

          <Message v-if="apiError" severity="error" :closable="false">{{ apiError }}</Message>

          <Button
            type="submit"
            label="Register"
            :loading="loading"
            class="w-full"
          />
        </form>

        <p class="mt-4 text-center text-sm text-gray-500">
          Already have an account?
          <NuxtLink to="/auth/login" class="text-blue-600 hover:underline">Login</NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore();
const router = useRouter();

const roles = [
  { label: 'Recruiter', value: 'recruiter' },
  { label: 'Interviewer', value: 'interviewer' },
];

const form = reactive({ fullName: '', email: '', password: '', role: 'recruiter' });
const errors = reactive<Record<string, string>>({});
const loading = ref(false);
const apiError = ref('');

async function handleRegister() {
  loading.value = true;
  apiError.value = '';
  Object.keys(errors).forEach((k) => delete errors[k]);

  try {
    const config = useRuntimeConfig();
    const data = await $fetch<{ success: boolean; data: { user: { id: string; email: string; fullName: string; role: string }; accessToken: string; refreshToken: string } }>(
      `${config.public.apiUrl}/auth/register`,
      { method: 'POST', body: form }
    );

    if (data.success) {
      authStore.setAuth(data.data.user, data.data.accessToken, data.data.refreshToken);
      router.push('/dashboard');
    }
  } catch (err: unknown) {
    const error = err as { data?: { error?: { message?: string; details?: Array<{ field: string; message: string }> } } };
    if (error?.data?.error?.details) {
      error.data.error.details.forEach((d) => { errors[d.field] = d.message; });
    } else {
      apiError.value = error?.data?.error?.message || 'Registration failed';
    }
  } finally {
    loading.value = false;
  }
}
</script>
