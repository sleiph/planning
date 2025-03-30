<script setup lang="ts">
    import type { Usuario } from '../types';
    import type { PropType } from 'vue';

    const props = defineProps({
        usuario: {
            type: Object as PropType<Usuario>,
            required: true
        },
        revelado: {
            type: Boolean,
            required: true
        }
    })
</script>

<template>
    <div class="flex my-2" style="line-height: 2.5rem;">
        <div class="w-1/6"></div>
        <div class="w-3/6 px-12 bg-gray-500 text-left">{{ $props.usuario.nome }}</div>
        <div class="w-1/6 bg-gray-400">{{ ($props.usuario.nota && $props.revelado) ? $props.usuario.nota : '?' }}</div>
        <div class="w-1/6"></div>
    </div>
</template>