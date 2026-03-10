<template>
  <div class="bg-white border border-slate-200 rounded-lg shadow-sm mb-6">
    <div class="p-4 sm:p-6">
      <!-- Top row: Title + Actions -->
      <div class="flex items-start justify-between gap-4 mb-4">
        <div class="min-w-0">
          <h1 class="text-xl sm:text-2xl font-bold text-slate-900">{{ meeting.title }}</h1>
          <p v-if="meeting.description" class="text-sm text-slate-500 mt-1 leading-relaxed">
            {{ meeting.description }}
          </p>
        </div>
        <div class="flex items-center gap-2 flex-shrink-0">
          <Button
            v-if="meeting.status === 'pending'"
            label="Confirm"
            icon="pi pi-check"
            size="small"
            severity="success"
            :loading="confirmingStatus"
            @click="$emit('confirm')"
          />
          <Button
            icon="pi pi-pen-to-square"
            severity="secondary"
            variant="outlined"
            size="small"
            aria-label="Edit Meeting"
            @click="$emit('edit')"
          />
        </div>
      </div>

      <!-- Status + Meta -->
      <div class="flex flex-wrap items-center gap-3 mb-5">
        <StatusBadge :status="meeting.status" />
        <span class="text-xs text-slate-400">
          Created {{ formatDate(meeting.createdAt) }}
          <span v-if="meeting.createdBy?.fullName"> by {{ meeting.createdBy.fullName }}</span>
        </span>
      </div>

      <!-- Candidate + Schedule grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <!-- Candidate -->
        <div class="flex items-center gap-3">
          <div
            class="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
          >
            {{ getInitials(meeting.candidateName) }}
          </div>
          <div class="min-w-0">
            <p class="text-sm font-semibold text-slate-900">{{ meeting.candidateName }}</p>
            <p class="text-xs text-slate-500">{{ meeting.position }}</p>
          </div>
        </div>

        <!-- Schedule -->
        <div class="flex flex-col gap-1.5 text-sm">
          <div class="flex items-center gap-2">
            <i class="pi pi-calendar text-slate-400 text-sm w-4" />
            <span class="text-slate-700">{{
              formatDateRange(meeting.startTime, meeting.endTime)
            }}</span>
          </div>
          <div class="flex items-center gap-2">
            <i
              :class="meeting.meetingType === 'online' ? 'pi pi-video' : 'pi pi-map-marker'"
              class="text-slate-400 text-sm w-4"
            />
            <span class="text-slate-700">
              {{
                meeting.meetingType === 'online'
                  ? `Online (${meeting.platform || 'N/A'})`
                  : `Onsite${meeting.location ? ` - ${meeting.location}` : ''}`
              }}
            </span>
          </div>
          <div v-if="meeting.meetingLink" class="flex items-center gap-2">
            <i class="pi pi-link text-slate-400 text-sm w-4" />
            <a
              :href="meeting.meetingLink"
              target="_blank"
              class="text-blue-500 hover:underline truncate text-sm"
            >
              {{ meeting.meetingLink }}
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IMeeting } from '@meeting-manager/shared';

defineProps<{
  meeting: IMeeting;
  confirmingStatus: boolean;
}>();

defineEmits<{
  confirm: [];
  edit: [];
}>();

const { formatDate, formatDateRange } = useDate();

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}
</script>
