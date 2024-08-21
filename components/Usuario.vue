<script setup lang="ts">
    const props = defineProps(['usuario']);
</script>

<template>
    <div>
        {{ $props.usuario.nome }}
    </div>
</template>