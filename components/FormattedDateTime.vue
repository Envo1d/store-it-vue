<script setup lang="ts">
const { date } = defineProps<{
  date: string;
  className?: string;
}>();
</script>

<template>
  <p class="body-1 text-light-200" :class="className">
    {{ formatDateTime(date) }}
  </p>
</template>
