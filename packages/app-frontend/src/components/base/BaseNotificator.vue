<script setup lang="ts">
import { ref, provide } from 'vue';
import { ToastAction, ToastDescription, ToastProvider, ToastRoot, ToastTitle, ToastViewport } from 'radix-vue';

provide('$notify', sendNotification);

const title = ref('');
const message = ref('');
const open = ref(false);
const timerRef = ref(0);
const type = ref('info');

function sendNotification(notification) {
  open.value = false;
  window.clearTimeout(timerRef.value);

  timerRef.value = window.setTimeout(() => {
    open.value = true;
    title.value = notification.title || '';
    message.value = notification.message || '';
    type.value = notification.type || 'info';
  }, 100);
}
</script>

<template>
  <ToastProvider>
    <slot />
    <ToastRoot
      v-model:open="open"
      :class="{ 'bg-red-500': type === 'error', 'bg-green-500': type === 'success', 'bg-neutral-300': type === 'info' }"
      class="data-[state=open]:animate-slideIn data-[state=closed]:animate-hide data-[swipe=end]:animate-swipeOut grid grid-cols-[auto_max-content] items-center gap-x-[15px] rounded-md p-[15px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] [grid-template-areas:_'title_action'_'description_action'] data-[swipe=cancel]:translate-x-0 data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=cancel]:transition-[transform_200ms_ease-out]"
    >
      <ToastTitle class="text-slate12 mb-[5px] text-[15px] font-medium [grid-area:_title]">
        {{ title }}
      </ToastTitle>
      <ToastDescription as-child>
        {{ message }}
      </ToastDescription>
    </ToastRoot>
    <ToastViewport
      class="fixed bottom-0 right-0 z-[2147483647] m-0 flex w-[390px] max-w-[100vw] list-none flex-col gap-[10px] p-[var(--viewport-padding)] outline-none [--viewport-padding:_25px]"
    />
  </ToastProvider>
</template>
