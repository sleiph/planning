<script setup lang="ts">
    const props = defineProps(['nome', 'checada']);

    //
</script>

<template>
    <li>
        <input type="radio" :id="props['nome']" name="hosting" :value="props['nome']" class="hidden peer" :checked="props['checada']"  />
        <label :for="props['nome']" class="inline-flex justify-center w-full p-5 border border-cinza-claro rounded-lg cursor-pointer peer-checked:border-rosa peer-checked:text-rosa peer-checked:bg-cinza-escuro hover:bg-cinza bg-cinza-claro hover:bg-cinza-escuro">                           
            <div>{{props['nome']}}</div>
        </label>
    </li>
</template>