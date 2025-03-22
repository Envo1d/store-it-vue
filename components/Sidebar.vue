<template>
  <aside class="sidebar">
    <NuxtLink to="/">
      <NuxtImg
        src="/assets/icons/logo-full-brand.svg"
        alt="logo"
        width="160"
        height="50"
        class="hidden h-auto lg:block"
      />
      <NuxtImg
        src="/assets/icons/logo-brand.svg"
        alt="logo"
        width="52"
        height="52"
        class="lg:hidden"
      />
    </NuxtLink>

    <nav class="sidebar-nav">
      <ul class="flex flex-1 flex-col gap-6">
        <NuxtLink
          v-for="{ name, url, icon } in items"
          :key="name"
          :to="url"
          class="lg:w-full"
        >
          <li
            class="sidebar-nav-item"
            :class="pathname === url && 'shad-active'"
          >
            <NuxtImg
              :src="icon"
              :alt="name"
              width="24"
              height="24"
              class="nav-icon"
              :class="pathname === url && 'nav-icon-active'"
            />
            <p class="hidden lg:block">{{ name }}</p>
          </li>
        </NuxtLink>
      </ul>
    </nav>

    <NuxtImg
      src="/assets/images/files-2.png"
      alt="logo"
      width="506"
      height="418"
      class="w-full"
    />

    <div class="sidebar-user-info">
      <NuxtImg
        :src="avatar || avatarPlaceholderUrl"
        alt="Avatar"
        width="44"
        height="44"
        class="sidebar-user-avatar"
      />
      <div class="hidden lg:block">
        <p class="subtitle-2 capitalize">{{ fullName }}</p>
        <p class="caption">{{ email }}</p>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { avatarPlaceholderUrl } from "~/utils/constants";

const route = useRoute();
const items = ref(navItems);

const pathname = ref(route.path);

watch(
  () => route.path,
  () => {
    pathname.value = route.path;
  },
);

const { fullName, email, avatar } = defineProps<{
  fullName: string;
  email: string;
  avatar?: string;
}>();
</script>
