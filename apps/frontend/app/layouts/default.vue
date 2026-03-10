<template>
  <div class="min-h-screen bg-slate-50">
    <!-- Navbar -->
    <nav class="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/60">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Left: Logo + Nav links -->
          <div class="flex items-center gap-8">
            <!-- Logo -->
            <NuxtLink to="/dashboard" class="flex items-center gap-2.5 no-underline group">
              <div
                class="w-9 h-9 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-sm shadow-orange-200 group-hover:shadow-md group-hover:shadow-orange-200 transition-shadow"
              >
                <i class="pi pi-calendar text-white text-sm" />
              </div>
              <span class="text-lg font-bold text-slate-900 hidden sm:block">
                Meeting<span class="text-orange-500">Manager</span>
              </span>
            </NuxtLink>

            <!-- Desktop nav links -->
            <ClientOnly>
              <div v-if="authStore.isAuthenticated" class="hidden md:flex items-center gap-1">
                <NuxtLink
                  v-for="item in navItems"
                  :key="item.to"
                  :to="item.to"
                  class="relative px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 no-underline group"
                  :class="
                    isActive(item.to)
                      ? 'text-orange-600 bg-orange-50'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                  "
                >
                  <i :class="item.icon" class="mr-1.5 text-xs" />
                  {{ item.label }}
                  <span
                    v-if="isActive(item.to)"
                    class="absolute bottom-0 left-3 right-3 h-0.5 bg-orange-500 rounded-full"
                  />
                </NuxtLink>
              </div>
            </ClientOnly>
          </div>

          <!-- Right: Actions -->
          <ClientOnly>
            <div v-if="authStore.isAuthenticated" class="flex items-center gap-2">
              <!-- New Meeting button (desktop only) -->
              <Button
                label="New Meeting"
                icon="pi pi-plus"
                size="small"
                class="hidden md:inline-flex"
                @click="navigateTo('/meetings/new')"
              />

              <!-- User avatar + dropdown (desktop only) -->
              <button
                class="hidden md:flex items-center gap-2 ml-2 px-2 py-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer border-0 bg-transparent"
                aria-label="User menu"
                @click="toggleUserMenu"
              >
                <div
                  class="w-9 h-9 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0 shadow-sm"
                  :class="avatarColor"
                >
                  {{ getInitials(authStore.user?.fullName || '') }}
                </div>
                <i class="pi pi-chevron-down text-[10px] text-slate-400" />
              </button>
              <Popover ref="userMenuRef">
                <div class="w-64">
                  <!-- User info -->
                  <div class="px-4 py-3 border-b border-slate-100">
                    <p class="text-sm font-semibold text-slate-900 leading-tight">
                      {{ authStore.user?.fullName }}
                    </p>
                    <p class="text-xs text-slate-400 mt-0.5">{{ authStore.user?.email }}</p>
                    <span
                      class="inline-block text-[11px] px-2 py-0.5 rounded-full mt-2 font-medium capitalize"
                      :class="roleBadgeClass"
                    >
                      {{ authStore.isGuest ? 'Guest' : authStore.user?.role }}
                    </span>
                  </div>
                  <!-- Menu items -->
                  <div class="py-1">
                    <button
                      class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer border-0 bg-transparent text-left"
                      @click="handleLogout"
                    >
                      <i class="pi pi-sign-out text-xs" />
                      Sign out
                    </button>
                  </div>
                </div>
              </Popover>

              <!-- Mobile hamburger -->
              <button
                class="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer border-0 bg-transparent"
                aria-label="Toggle menu"
                @click="mobileMenuOpen = true"
              >
                <i class="pi pi-bars text-slate-600 text-lg" />
              </button>
            </div>
          </ClientOnly>
        </div>
      </div>
    </nav>

    <!-- Mobile drawer -->
    <ClientOnly>
      <Drawer v-model:visible="mobileMenuOpen" position="right" class="w-72" :show-close-icon="false">
        <template #header>
          <div class="flex items-center justify-between w-full">
            <div class="flex items-center gap-3 min-w-0">
              <div
                class="w-9 h-9 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0 shadow-sm"
                :class="avatarColor"
              >
                {{ getInitials(authStore.user?.fullName || '') }}
              </div>
              <div class="min-w-0">
                <p class="text-sm font-semibold text-slate-900 leading-tight truncate">
                  {{ authStore.user?.fullName }}
                </p>
                <p class="text-xs text-slate-400 truncate">{{ authStore.user?.email }}</p>
              </div>
            </div>
            <button
              class="flex items-center justify-center w-9 h-9 rounded-lg text-red-500 hover:bg-red-50 transition-colors cursor-pointer border-0 bg-transparent flex-shrink-0"
              aria-label="Sign out"
              @click="mobileMenuOpen = false; handleLogout()"
            >
              <i class="pi pi-sign-out text-base" />
            </button>
          </div>
        </template>

        <!-- Navigation -->
        <div class="flex flex-col gap-1">
          <NuxtLink
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            class="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium no-underline transition-colors"
            :class="
              isActive(item.to)
                ? 'text-orange-600 bg-orange-50'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            "
            @click="mobileMenuOpen = false"
          >
            <i :class="item.icon" class="text-base" />
            {{ item.label }}
          </NuxtLink>
        </div>

        <!-- Bottom actions -->
        <div class="mt-auto flex flex-col gap-2 pt-4 border-t border-slate-100">
          <Button
            label="New Meeting"
            icon="pi pi-plus"
            class="w-full"
            @click="mobileMenuOpen = false; navigateTo('/meetings/new')"
          />
          <Button
            label="Close"
            icon="pi pi-times"
            severity="secondary"
            variant="outlined"
            class="w-full"
            @click="mobileMenuOpen = false"
          />
        </div>
      </Drawer>
    </ClientOnly>

    <main>
      <slot />
    </main>

    <Toast position="top-center" />
    <ConfirmDialog />
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth';

const authStore = useAuthStore();
const { logout } = useAuth();
const route = useRoute();

const userMenuRef = ref();
const mobileMenuOpen = ref(false);

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: 'pi pi-home' },
  { to: '/meetings', label: 'Meetings', icon: 'pi pi-list' },
];

function isActive(path: string): boolean {
  return route.path === path || (path === '/meetings' && route.path.startsWith('/meetings'));
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

const avatarColor = computed(() => {
  const name = authStore.user?.fullName || '';
  const colors = [
    'bg-blue-500',
    'bg-emerald-500',
    'bg-violet-500',
    'bg-rose-500',
    'bg-amber-500',
    'bg-cyan-500',
    'bg-indigo-500',
    'bg-teal-500',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
});

const roleBadgeClass = computed(() => {
  const role = authStore.isGuest ? 'guest' : authStore.user?.role;
  const map: Record<string, string> = {
    admin: 'bg-purple-100 text-purple-700',
    recruiter: 'bg-blue-100 text-blue-700',
    interviewer: 'bg-emerald-100 text-emerald-700',
    guest: 'bg-slate-100 text-slate-600',
  };
  return map[role || ''] || 'bg-slate-100 text-slate-600';
});

function toggleUserMenu(event: Event) {
  userMenuRef.value?.toggle(event);
}

async function handleLogout() {
  userMenuRef.value?.hide();
  await logout();
}
</script>
