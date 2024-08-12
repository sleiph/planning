<template>
    <div class="w-9/12 bg-cinza text-center border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700">
        <h5 class="mb-2 text-branco text-3xl font-bold text-gray-900 dark:text-white">Truco de Planejamento</h5>
        <p class="text-branco">0/4 salas sendo usadas</p>
        <br>
        <button class="text-cinza bg-cinza-claro hover:bg-rosa focus:outline-none focus:ring-4 focus:ring-cinza-claro font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-branco dark:hover:bg-rosa dark:focus:ring-cinza-claro dark:border-cinza">Gerar Sala</button>
        <p class="text-branco">
            Hash: ############
            <button><Icon name="bx:bxs-copy-alt"/></button>
        </p>
    </div>
</template>
  
<script>
    export default {
        name: 'GerarSala'
    }
</script>
  