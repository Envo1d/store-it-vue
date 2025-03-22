import {
  dehydrate,
  QueryClient,
  VueQueryPlugin,
  hydrate,
} from "@tanstack/vue-query";
import type {
  DehydratedState,
  VueQueryPluginOptions,
} from "@tanstack/vue-query";

export default defineNuxtPlugin((nuxt) => {
  const vueQueryState = useState<DehydratedState | null>("vue-query");

  const queryClient = new QueryClient({
    defaultOptions: { queries: { staleTime: 5000 } },
  });

  const options: VueQueryPluginOptions = {
    queryClient,
    enableDevtoolsV6Plugin: true,
  };

  nuxt.vueApp.use(VueQueryPlugin, options);

  if (import.meta.server) {
    nuxt.hooks.hook("app:rendered", () => {
      vueQueryState.value = dehydrate(queryClient);
    });
  }

  if (import.meta.client) {
    nuxt.hooks.hook("app:created", () => {
      hydrate(queryClient, vueQueryState.value);
    });
  }
});
