<script setup lang="ts">
import type { Models } from "node-appwrite";

const { file } = defineProps<{
  file: Models.Document;
}>();
</script>

<template>
  <NuxtLink :to="file.url" target="_blank" class="file-card">
    <div class="flex justify-between">
      <Thumbnail
        :type="file.type"
        :extension="file.extension"
        :url="file.url"
        class="!size-20"
        image-class-name="!size-11"
      />

      <div class="flex flex-col items-end justify-between">
        <ActionDropdown :file="file" />

        <p class="body-1">{{ convertFileSize(file.size) }}</p>
      </div>
    </div>

    <div class="file-card-details">
      <p class="subtitle-2 line-clamp-1">
        {{ file.name }}
      </p>
      <FormattedDateTime
        :date="file.$createdAt"
        class-name="body-2 text-light-100"
      />

      <p class="caption line-clamp-1 text-light-200">
        By: {{ file.owner.fullName }}
      </p>
    </div>
  </NuxtLink>
</template>
