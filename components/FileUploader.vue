<script setup lang="ts">
import { useQueryClient } from "@tanstack/vue-query";
import { type FileRejectReason, useDropzone } from "vue3-dropzone";
import { useToast } from "~/components/ui/toast";
import { h } from "vue";
import { getFileType } from "~/utils/utilities";

const { ownerId, accountId, className } = defineProps<{
  ownerId: string;
  accountId: string;
  className?: string;
}>();

const files = ref<File[]>([]);
const { toast } = useToast();
const queryClient = useQueryClient();

const onDrop = async (
  acceptFiles: File[],
  rejectReasons: FileRejectReason[],
) => {
  files.value = acceptFiles;

  const uploadPromises = acceptFiles.map(async (file) => {
    if (file.size > MAX_FILE_SIZE) {
      files.value = files.value.filter((f) => f.name !== file.name);

      return toast({
        description: h("p", { class: "body-2 text-white" }, [
          h("span", { class: "font-semibold" }, [file.name]),
          " is too large. Max size is ",
          h("span", { class: "font-semibold" }, ["50MB."]),
        ]),
        class: "error-toast",
      });
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("ownerId", ownerId);
    formData.append("accountId", accountId);

    return $fetch("/api/upload-file", {
      method: "POST",
      body: formData,
      onResponse({ response }) {
        if (response.ok) {
          files.value = files.value.filter((f) => f.name !== file.name);
        }
      },
    });
  });

  await Promise.all(uploadPromises);
  await queryClient.invalidateQueries({ queryKey: ["files"] });
};

const { getRootProps, getInputProps } = useDropzone({
  onDrop,
});

const handleRemoveFile = (e: MouseEvent, fileName: string) => {
  e.stopPropagation();
  files.value = files.value.filter((file: File) => file.name !== fileName);
};
</script>

<template>
  <div v-bind="getRootProps()" class="cursor-pointer">
    <input v-bind="getInputProps()" />
    <UiButton type="button" :class="className" class="uploader-button">
      <NuxtImg
        src="/assets/icons/upload.svg"
        alt="upload"
        width="24"
        height="24"
      />
      <p>Upload</p>
    </UiButton>
    <div v-if="files.length > 0">
      <ul class="uploader-preview-list">
        <h4 class="h4 text-light-100">Uploading</h4>
        <li
          v-for="(file, index) in files"
          :key="`${file.name}-${index}`"
          class="uploader-preview-item"
        >
          <div class="flex items-center gap-3">
            <Thumbnail
              :type="getFileType(file.name).type"
              :extension="getFileType(file.name).extension"
              :url="convertFileToUrl(file)"
            />
            <div class="preview-item-name">
              {{ file.name }}
              <NuxtImg src="/assets/icons/file-loader.gif" alt="Loader" />
            </div>
          </div>

          <NuxtImg
            src="/assets/icons/remove.svg"
            alt="Remove"
            width="24"
            height="24"
            @click="(e: MouseEvent) => handleRemoveFile(e, file.name)"
          />
        </li>
      </ul>
    </div>
  </div>
</template>
