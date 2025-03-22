<script setup lang="ts">
const {
  type,
  extension,
  url = "",
} = defineProps<{
  type: string;
  extension: string;
  url?: string;
  imageClassName?: string;
  className?: string;
}>();

const isImage = type === "image" && extension !== "svg";
</script>

<template>
  <figure class="thumbnail" :class="className">
    <NuxtImg
      :src="isImage ? url : getFileIcon(extension, type)"
      alt="thumbnail"
      width="100"
      height="100"
      class="size-8 object-contain"
      :class="`${imageClassName} ${isImage && 'thumbnail-image'}`"
    />
  </figure>
</template>
