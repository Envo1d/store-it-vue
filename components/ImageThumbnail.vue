<script setup lang="ts">
import type { Models } from "node-appwrite";

defineProps<{
  file: Models.Document;
}>();
</script>

<template>
  <div class="file-details-thumbnail">
    <Thumbnail :type="file.type" :extension="file.extension" :url="file.url" />
    <div class="flex flex-col">
      <p class="subtitle-2 mb-1">
        {{ file.name }}
      </p>
      <FormattedDateTime :date="file.$createdAt" class="caption" />
    </div>
  </div>
</template>
