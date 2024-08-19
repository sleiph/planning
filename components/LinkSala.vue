<script setup lang="ts">

    const endereco = "localhost:3000";
    const props = defineProps(['sala', 'store']);
    const sala = props['sala'];
    const store = props['store'];

    function removerSala(indice :number) {
        store.removerSala(indice);
    }
</script>

<template>
    <div class="pt-4 font-mono">
        <NuxtLink :to="{ name: 'salas-hash', params: { hash: sala } }">
            {{ endereco + "/" + sala.nome }}
        </NuxtLink>
        <button @click="removerSala(store.salas.indexOf(sala))" class="pl-4 text-lg text-rosa align-top">
            <Icon name="bx:bxs-trash"/>
        </button>
    </div>
</template>