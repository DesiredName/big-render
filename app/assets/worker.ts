import type { Entry } from '~/app.vue';

export type WorkerInputMessages = {
    name: 'generate';
    count: number;
} | {
    name: 'add_more';
    delta: number;
};

export type WorkerOutputMessages = {
    name: 'generated';
    entries: Array<Entry>;
};

self.onmessage = (ev: MessageEvent<WorkerInputMessages>) => {
    switch (ev.data.name) {
        case 'generate':
            return generate_and_notify(ev.data.count);
        case 'add_more':
        default:
                // do nothing
    };
};

const generate_and_notify = (count: number) => {
    const entries: Array<Entry> = [];

    for (let i = 0; i < count; i++) {
        entries.push({
            id: crypto.randomUUID(),
            name: crypto.randomUUID(),
            subitems: new Array(Math.ceil(10 * Math.random())).fill(0).map((_, i) => i.toString()),
        });
    }

    self.postMessage({
        name: 'generated',
        entries,
    } as WorkerOutputMessages);
};
