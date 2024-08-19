<script setup>
    // usar typescript

    const store = useWebsiteStore();
    await useAsyncData('salas', () => store.fetch());

    function gerarHash() {
        let nomeSala = (+new Date).toString(36);
        store.addSala({nome:nomeSala});
    }
</script>

<template>
    <div class="w-full col-span-10 col-start-2 py-4 px-8 text-center bg-cinza-claro dark:bg-cinza dark:border-cinza-escuro border-cinza-claro rounded-lg shadow">
        <p>{{ store.salas.length }}/4 salas sendo usadas</p>
        <br>
        <button :disabled="store.salas.length >= 4" @click="gerarHash" class="text-cinza bg-cinza-claro hover:bg-rosa focus:outline-none focus:ring-4 focus:ring-cinza-claro font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-branco dark:hover:bg-rosa dark:focus:ring-cinza-claro dark:border-cinza">Gerar Sala</button>
        <ul>
            <LinkSala :sala="sala" :store="store" v-for="sala in store.salas" />
        </ul>
    </div>
</template>
