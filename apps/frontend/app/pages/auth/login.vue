<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-50">
    <div class="w-full max-w-md">
      <div class="bg-white rounded-2xl shadow-md p-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-6 text-center">Login</h2>

        <form @submit.prevent="handleLogin" class="flex flex-col gap-4">
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
              placeholder="Password"
              :feedback="false"
              :invalid="!!errors.password"
              input-class="w-full"
              class="w-full"
            />
            <small v-if="errors.password" class="text-red-500">{{ errors.password }}</small>
          </div>

          <Message v-if="apiError" severity="error" :closable="false">{{ apiError }}</Message>

          <Button
            type="submit"
            label="Login"
            :loading="loading"
            class="w-full"
          />
        </form>

        <p class="mt-4 text-center text-sm text-gray-500">
          Don't have an account?
          <NuxtLink to="/auth/register" class="text-blue-600 hover:underline">Register</NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore();
const router = useRouter();

const form = reactive({ email: '', password: '' });
const errors = reactive<Record<string, string>>({});
const loading = ref(false);
const apiError = ref('');

async function handleLogin() {
  loading.value = true;
  apiError.value = '';
  Object.keys(errors).forEach((k) => delete errors[k]);

  try {
    const config = useRuntimeConfig();
    const data = await $fetch<{ success: boolean; data: { user: { id: string; email: string; fullName: string; role: string }; accessToken: string; refreshToken: string } }>(
      `${config.public.apiUrl}/auth/login`,
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
      apiError.value = error?.data?.error?.message || 'Login failed';
    }
  } finally {
    loading.value = false;
  }
}
</script>
