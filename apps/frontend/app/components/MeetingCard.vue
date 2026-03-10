<template>
  <div
    class="bg-white border border-slate-200 rounded-lg p-4 sm:p-6 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
    @click="navigateTo(`/meetings/${meeting.id}`)"
  >
    <div class="flex justify-between items-start gap-4">
      <div class="flex-1 min-w-0">
        <h3 class="text-lg font-semibold text-slate-900 truncate">
          {{ meeting.title }}
        </h3>
        <p class="text-sm text-slate-500 mt-0.5">
          {{ meeting.candidateName }} <span class="font-normal">·</span> {{ meeting.position }}
        </p>
        <div class="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-1.5">
          <div class="flex items-center gap-1.5 text-sm text-slate-500">
            <i :class="variant === 'compact' ? 'pi pi-clock' : 'pi pi-calendar'" class="text-xs" />
            <span>{{
              variant === 'compact'
                ? formatTimeRange(meeting.startTime, meeting.endTime)
                : formatDateRange(meeting.startTime, meeting.endTime)
            }}</span>
          </div>
          <div class="flex items-center gap-1.5 text-sm text-slate-500">
            <i
              :class="meeting.meetingType === 'online' ? 'pi pi-video' : 'pi pi-map-marker'"
              class="text-xs"
            />
            <span>{{
              meeting.meetingType === 'online'
                ? `Online${meeting.platform ? ` (${meeting.platform})` : ''}`
                : `Onsite${meeting.location ? ` - ${meeting.location}` : ''}`
            }}</span>
          </div>
          <a
            v-if="meeting.meetingType === 'online' && meeting.meetingLink"
            :href="meeting.meetingLink"
            target="_blank"
            class="flex items-center gap-1.5 text-sm text-blue-500 hover:underline"
            @click.stop
          >
            <i class="pi pi-link text-xs" />
            <span class="truncate max-w-48">{{ meeting.meetingLink }}</span>
          </a>
        </div>
      </div>

      <div class="flex flex-col items-end justify-between self-stretch gap-3 flex-shrink-0">
        <StatusBadge :status="meeting.status" />
        <div v-if="variant === 'full'" class="flex items-center gap-2">
          <Button
            icon="pi pi-eye"
            severity="secondary"
            outlined
            size="small"
            @click.stop="navigateTo(`/meetings/${meeting.id}`)"
          />
          <Button
            icon="pi pi-pen-to-square"
            severity="secondary"
            outlined
            size="small"
            @click.stop="navigateTo({ path: `/meetings/${meeting.id}`, query: { edit: '1' } })"
          />
        </div>
        <i v-else class="pi pi-chevron-right text-slate-300 text-sm" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IMeetingListItem } from '@meeting-manager/shared';

withDefaults(
  defineProps<{
    meeting: IMeetingListItem;
    variant?: 'full' | 'compact';
  }>(),
  {
    variant: 'full',
  },
);

const { formatDateRange, formatTimeRange } = useDate();
</script>
