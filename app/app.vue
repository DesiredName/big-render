<template>
    <div class="w-screen min-h-screen bg-slate-600">
        <div class="w-96 m-auto">
            <div class="text-blue-300">
                <label
                    for="count_nodes"
                    class="select-none"
                >
                    Number of nodes: <input
                        id="count_nodes"
                        v-model="number_of_nodes"
                        :disabled="is_loading"
                        class="bg-slate-800"
                        type="number"
                    >
                </label><br>
                <label
                    for="use_delayed_batch"
                    class="select-none"
                >
                    Use batch render: <input
                        id="use_delayed_batch"
                        :checked="use_batching"
                        :disabled="is_loading"
                        type="checkbox"
                        @click="use_batching = !use_batching"
                    >
                </label><br>
                <button
                    class="m-2 px-2 rounded-lg text-blue-600 bg-slate-100 hover:bg-slate-400"
                    :class="{ 'bg-slate-500 text-blue-800': is_loading }"
                    :disabled="is_loading"
                    @click="generate_entries"
                >
                    Go
                </button>
                <button
                    class="m-2 px-2 rounded-lg text-blue-600 bg-slate-100 hover:bg-slate-400"
                    @click="stop_rendering"
                >
                    Stop
                </button>
            </div>

            <div v-if="is_loading">
                <div class="animate-bounce">
                    ...loading {{ entries.length }} => {{ displayed_entries.length }}
                </div>
            </div>
            <div class="flex flex-col flex-nowrap gap-4">
                <TransitionGroup name="pop">
                    <Entry
                        v-for="entry of displayed_entries"
                        :key="entry.id"
                        :entry="entry"
                        class="bg-gray-600 rounded-lg border p-2 border-sky-900"
                    />
                </TransitionGroup>
            </div>

            <div class="fixed rounded-lg overflow-hidden top-20 right-[40rem] w-20 h-20 bg-slate-300 flex flex-col justify-between items-center">
                <div>Fancy</div>
                <div
                    class="animate-spin text-4xl"
                    style="animation-duration: 3s;"
                >
                    🥳
                </div>
                <progress
                    class="w-full block"
                    :value="displayed_entries.length"
                    :max="entries.length + displayed_entries.length"
                />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
</script>

<script setup lang="ts">
import type { WorkerInputMessages, WorkerOutputMessages } from './assets/worker';

export type Entry = {
    id: string;
    name: string;
    subitems: string[];
};

const { $worker } = useNuxtApp();
const number_of_nodes = ref<number>(10);
const use_batching = ref<boolean>(false);
const idle_callback_id = ref<number | null>(null);
const entries = ref<Array<Entry>>([]);
const displayed_entries = ref<Array<Entry>>([]);
const worker = $worker.create('/../_nuxt/assets/worker.js');
const is_loading = ref<boolean>(false);

worker.onmessage = (e: MessageEvent<WorkerOutputMessages>) => {
    switch (e.data.name) {
        case 'generated':
            entries.value = e.data.entries;
            displayed_entries.value = [];

            if (use_batching.value === true) {
                add_displayed_in_batches(100);
            }
            else {
                displayed_entries.value = entries.value.splice(0);
                is_loading.value = false;
            }
            return;
    }
};

const generate_entries = () => {
    is_loading.value = true;
    worker.postMessage({ name: 'generate', count: number_of_nodes.value } as WorkerInputMessages);
};

const stop_rendering = () => {
    if (idle_callback_id.value) {
        cancelIdleCallback(idle_callback_id.value);
    }
    is_loading.value = false;
};

const add_displayed_in_batches = (batch: number) => {
    displayed_entries.value.push(...entries.value.splice(0, batch));

    if (entries.value.length > 0) {
        idle_callback_id.value = requestIdleCallback(() => add_displayed_in_batches(batch));
    }
    else {
        is_loading.value = false;
    }
};
</script>

<style>
.pop-enter-from {
  opacity: 0;
  transform: translateY(30px);
}

.pop-enter-active {
  transition-property: opacity, trasnform;
  transition: 600ms ease;
}
</style>
