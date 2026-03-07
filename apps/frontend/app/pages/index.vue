<template>
  <div class="flex items-center justify-center min-h-screen">
    <div class="text-center">
      <h1 class="text-4xl font-bold text-gray-800 mb-4">Meeting Manager</h1>
      <p class="text-gray-500 mb-8">Schedule and manage candidate interviews efficiently</p>
      <div class="flex gap-4 justify-center">
        <Button label="Login" @click="navigateTo('/auth/login')" />
        <Button label="Register" severity="secondary" @click="navigateTo('/auth/register')" />
      </div>
    </div>
  </div>
</template>
