<script setup lang="ts">

    import type { Sala } from '../types';

    // TODO: trocar pelo endereço de verdade
    const endereco = "localhost:3000";
    const props = defineProps(['sala', 'store']);
    const sala = props['sala'];
    const store = props['store'];

    function removerSala(sala : Sala) {
        store.removerSala(sala);
    }
</script>

<template>
    <div class="pt-4 font-mono">
        <NuxtLink :to="{ name: 'salas-hash', params: { hash: sala.hash } }">
            {{ endereco + "/" + sala.hash }}
        </NuxtLink>
        <button @click="removerSala(sala)" class="pl-4 text-lg text-rosa align-top">
            <Icon name="bx:bxs-trash"/>
        </button>
    </div>
</template>