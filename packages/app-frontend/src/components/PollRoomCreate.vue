<script setup>
import { TabsContent, TabsIndicator, TabsList, TabsRoot, TabsTrigger } from 'radix-vue';
import { ref, inject, onMounted } from 'vue';
import BaseButton from '@/components/base/BaseButton.vue';
import MediaItemSearch from '@/components/MediaItemSearch.vue';
import MediaItemCard from '@/components/MediaItemCard.vue';
import { CREATE_ROOM, ROOM_CREATED } from '@/socket-constants';

const emit = defineEmits(['done']);
const $socket = inject('$socket');
const $notify = inject('$notify');
const startCreating = ref(false);
const mediaItemsSelected = ref([]);
const roomCreationRequestSent = ref(false);
const mediaItemsMin = 2;
const mediaItemsMax = 100;

const handleRemoveItem = (item) => {
  mediaItemsSelected.value = mediaItemsSelected.value.filter((mediaItem) => mediaItem.tmdbId !== item.tmdbId);
};

const handleAddItem = (item) => {
  if (roomCreationRequestSent.value) {
    return;
  }
  // Check if there is already an item with the same tmdbId in mediaItemsSelected
  else if (mediaItemsSelected.value.find((mediaItem) => mediaItem.tmdbId === item.tmdbId)) {
    // Notify user of duplicated item
    $notify({
      title: item.title,
      message: 'Already in poll',
      type: 'error',
    });
    return;
  } else if (mediaItemsSelected.value.length < mediaItemsMax) {
    // Add the item to the poll
    console.log('Adding item to poll', item);
    mediaItemsSelected.value.push(item);
    $notify({
      title: item.title,
      message: 'Added',
      type: 'success',
    });
  } else {
    $notify({
      title: 'Maximum items reached',
      message: `You can only select ${mediaItemsMax} items`,
      type: 'error',
    });
  }
};

onMounted(() => {
  console.log('PollCreate page mounted');

  $socket.on(ROOM_CREATED, (_roomId) => {
    emit('done', {
      roomId: _roomId,
      members: [$socket.id],
      choices: mediaItemsSelected.value,
    });
  });
});
</script>

<template>
  <div>
    <div v-if="!startCreating">
      <h1 class="mb-4 text-4xl md:text-5xl lg:text-6xl">Cin3club</h1>
      <BaseButton @click="() => (startCreating = true)">Create Poll</BaseButton>
    </div>
    <div v-else>
      <h1 class="mb-4 text-4xl md:text-5xl lg:text-6xl">
        {{
          mediaItemsSelected.length >= mediaItemsMin
            ? "Start the poll when you're ready"
            : `Select at least ${mediaItemsMin - mediaItemsSelected.length} more films`
        }}
      </h1>
      <BaseButton class="mb-3" v-if="mediaItemsSelected.length >= mediaItemsMin" @click="() => $socket.emit(CREATE_ROOM)"> 
        Start Poll
      </BaseButton>
      <TabsRoot class="shadow-blackA4 flex w-full flex-col shadow-[0_2px_10px]" default-value="tab1">
        <TabsList class="relative flex shrink-0" aria-label="Manage your account">
          <TabsIndicator
            class="absolute bottom-0 left-0 h-[2px] w-[--radix-tabs-indicator-size] translate-x-[--radix-tabs-indicator-position] rounded-full px-8 transition-[width,transform] duration-300"
          >
            <div class="h-full w-full" />
          </TabsIndicator>
          <TabsTrigger
            class="text-mauve11 hover:text-grass11 data-[state=active]:text-grass11 flex h-[45px] flex-1 cursor-default select-none items-center justify-center rounded-tl-md px-5 text-[15px] leading-none outline-none focus-visible:relative focus-visible:shadow-[0_0_0_2px] focus-visible:shadow-black"
            value="tab1"
          >
            Search
          </TabsTrigger>
          <TabsTrigger
            class="text-mauve11 hover:text-grass11 data-[state=active]:text-grass11 flex h-[45px] flex-1 cursor-default select-none items-center justify-center rounded-tr-md px-5 text-[15px] leading-none outline-none focus-visible:relative focus-visible:shadow-[0_0_0_2px] focus-visible:shadow-black"
            value="tab2"
          >
            <p>
              Selected
              <span class="rounded-2xl bg-neutral-800 px-2 text-neutral-200">{{ mediaItemsSelected.length }}</span>
            </p>
          </TabsTrigger>
        </TabsList>
        <TabsContent
          class="grow rounded-b-md p-5 outline-none focus:shadow-[0_0_0_2px] focus:shadow-black"
          value="tab1"
        >
          <MediaItemSearch :excludeMediaItems="mediaItemsSelected" @item-selected="handleAddItem" />
        </TabsContent>
        <TabsContent
          class="grow rounded-b-md p-5 outline-none focus:shadow-[0_0_0_2px] focus:shadow-black"
          value="tab2"
        >
          <MediaItemCard
            class="my-2"
            v-for="item in mediaItemsSelected"
            :item="item"
            @click="handleRemoveItem(item)"
          />
        </TabsContent>
      </TabsRoot>
    </div>
  </div>
</template>
