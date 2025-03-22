<script setup lang="ts">
import { useMutation, useQueryClient } from "@tanstack/vue-query";
import type { Models } from "node-appwrite";
import ShareInput from "~/components/ShareInput.vue";
import { deleteFile, renameFile, shareFile } from "~/utils/api";

const { file } = defineProps<{
  file: Models.Document;
}>();

const items = ref(actionsDropdownItems);
const isModalOpen = ref(false);
const action = ref<ActionType | null>(null);
const name = ref<string>(file.name);
const emails = ref<string[]>([]);
const isLoading = ref(false);

const closeModal = () => {
  isModalOpen.value = false;
  action.value = null;
  name.value = file.name;
  emails.value = [];
};

const {
  isSuccess: isSuccessRename,
  error: renameError,
  mutateAsync: mutateRename,
} = useMutation({
  mutationFn: async () => renameFile(name.value, file.$id, file.extension),
  mutationKey: [`rename file with id: ${file.$id}`],
});

const {
  isSuccess: isSuccessShare,
  error: shareError,
  mutateAsync: mutateShare,
} = useMutation({
  mutationFn: async (users: string[]) => shareFile(file.$id, users),
  mutationKey: [`share file with id: ${file.$id}`],
});

const {
  isSuccess: isSuccessDelete,
  error: deleteError,
  mutateAsync: mutateDelete,
} = useMutation({
  mutationFn: async () => deleteFile(file.$id, file.bucketFileId),
  mutationKey: [`delete file with id: ${file.$id}`],
});

const queryClient = useQueryClient();

const handleAction = async () => {
  if (!action.value) return;
  isLoading.value = true;

  const actions = {
    rename: async () => {
      await mutateRename();

      if (isSuccessRename) {
        await queryClient.invalidateQueries({ queryKey: ["files"] });
        return true;
      } else {
        console.error(renameError);
        return false;
      }
    },
    share: async () => {
      await mutateShare(emails.value);

      if (isSuccessShare) {
        await queryClient.invalidateQueries({ queryKey: ["files"] });
        return true;
      } else {
        console.error(shareError);
        return false;
      }
    },
    delete: async () => {
      await mutateDelete();

      if (isSuccessDelete) {
        await queryClient.invalidateQueries({ queryKey: ["files"] });
        return true;
      } else {
        console.error(deleteError);
        return false;
      }
    },
  };

  if (await actions[action.value.value as keyof typeof actions]()) closeModal();

  isLoading.value = false;
};

const handleRemoveUser = async (email: string) => {
  const filteredEmails = emails.value.filter((e) => e !== email);

  await mutateShare(filteredEmails);

  if (isSuccessShare) {
    await queryClient.invalidateQueries({ queryKey: ["files"] });
  } else {
    console.error(shareError);
  }

  closeModal();
};
</script>

<template>
  <UiDialog
    :open="isModalOpen"
    @update:open="(openState) => (isModalOpen = openState)"
  >
    <UiDropdownMenu>
      <UiDropdownMenuTrigger class="shad-no-focus">
        <NuxtImg
          src="/assets/icons/dots.svg"
          alr="dots"
          width="34"
          height="34"
        />
      </UiDropdownMenuTrigger>
      <UiDropdownMenuContent>
        <UiDropdownMenuLabel class="max-w-[200px] truncate">{{
          file.name
        }}</UiDropdownMenuLabel>
        <UiDropdownMenuSeparator />
        <UiDialogTrigger as-child>
          <UiDropdownMenuItem
            v-for="item in items"
            :key="item.value"
            class="shad-dropdown-item"
            @click="
              () => {
                action = item;

                if (
                  ['rename', 'delete', 'details', 'share'].includes(
                    action.value,
                  )
                )
                  isModalOpen = true;
              }
            "
          >
            <NuxtLink
              v-if="item.value === 'download'"
              :to="constructDownloadUrl(file.bucketFileId)"
              :download="file.name"
              class="flex items-center gap-2"
            >
              <NuxtImg
                :src="item.icon"
                :alt="item.label"
                width="30"
                height="30"
              />
              {{ item.label }}
            </NuxtLink>
            <div v-else class="flex items-center gap-2">
              <NuxtImg
                :src="item.icon"
                :alt="item.label"
                width="30"
                height="30"
              />
              {{ item.label }}
            </div>
          </UiDropdownMenuItem>
        </UiDialogTrigger>
      </UiDropdownMenuContent>
    </UiDropdownMenu>

    <UiDialogContent v-if="action" class="shad-dialog button">
      <UiDialogHeader class="flex flex-col gap-3">
        <UiDialogTitle class="text-center text-light-100">{{
          action.label
        }}</UiDialogTitle>
        <UiInput v-if="action.value === 'rename'" v-model="name" type="text" />
        <FileDetails v-else-if="action.value === 'details'" :file="file" />
        <ShareInput
          v-else-if="action.value === 'share'"
          :file="file"
          :on-change="(value: string[]) => (emails = value)"
          :on-remove="handleRemoveUser"
        />
        <p v-else-if="action.value === 'delete'" class="delete-confirmation">
          Are you sure you want to delete{{ ` ` }}
          <span class="delete-file-name">{{ file.name }}</span>
        </p>
        <UiDialogDescription />
      </UiDialogHeader>
      <UiDialogFooter
        v-if="['rename', 'delete', 'share'].includes(action.value)"
        class="flex flex-col gap-3 md:flex-row"
      >
        <UiButton class="modal-cancel-button" @click="closeModal"
          >Cancel</UiButton
        >
        <UiButton class="modal-submit-button" @click="() => handleAction()">
          <p class="capitalize">{{ action.value }}</p>
          <NuxtImg
            v-if="isLoading"
            src="/assets/icons/loader.svg"
            alt="loader"
            width="24"
            height="24"
            class="animate-spin"
          />
        </UiButton>
      </UiDialogFooter>
    </UiDialogContent>
  </UiDialog>
</template>
