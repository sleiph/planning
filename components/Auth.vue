<script setup lang="ts">
import { ref } from 'vue';
import { useWebsiteStore } from '../stores/website';

const store = useWebsiteStore();
const emit = defineEmits(['authenticated']);

const isLogin = ref(true);
const usuario = ref('');
const password = ref('');
const loading = ref(false);
const error = ref('');

const toggleMode = () => {
  isLogin.value = !isLogin.value;
  error.value = '';
}

const handleSubmit = async () => {
  if (!usuario.value.trim()) {
    error.value = 'Por favor, digite um nome de usuário';
    return;
  }

  if (!password.value.trim()) {
    error.value = 'Por favor, digite uma senha';
    return;
  }

  loading.value = true;
  error.value = '';

  try {
    if (isLogin.value) {

      const userData = { nome: usuario.value.trim(), senha: password.value, sala: '' }
      const response = await store.login(userData)
      
      emit('authenticated', {
        usuario: response.nome,
        isAuthenticated: true,
        sala: response.sala
      });
      console.log(response);//R TODO: deletar
    } else {
      // Novo usuario
      const userData = { nome: usuario.value.trim(), senha: password.value, sala: '' }
      const response = await store.criaUsuario(userData)
      
      emit('authenticated', {
        usuario: response.nome,
        isAuthenticated: true,
        sala: response.sala
      });
    }
  } catch (err: any) {
    console.error(err);
    error.value = err.message || 'Erro na autenticação. Tente novamente.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="col-span-10 col-start-2 max-w-md mx-auto bg-gray-800 rounded-lg shadow-lg p-6 space-y-4">
    <h2 class="text-2xl font-bold text-white text-center mb-6">
      {{ isLogin ? 'Login' : 'Cadastro' }}
    </h2>
    
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div>
        <label for="usuario" class="block text-sm font-medium text-gray-300 mb-2">
          Nome de Usuário
        </label>
        <input
          id="usuario"
          v-model="usuario"
          type="text"
          :disabled="loading"
          class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Digite seu nome de usuário"
          required
        />
      </div>
      
      <div>
        <label for="password" class="block text-sm font-medium text-gray-300 mb-2">
          Senha
        </label>
        <input
          id="password"
          v-model="password"
          type="password"
          :disabled="loading"
          class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Digite sua senha"
          required
        />
      </div>
      
      <div v-if="error" class="text-red-400 text-sm text-center">
        {{ error }}
      </div>
      
      <button
        type="submit"
        :disabled="loading"
        class="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-medium rounded-md transition duration-200 ease-in-out transform hover:scale-105 disabled:scale-100"
      >
        <span v-if="loading" class="flex items-center justify-center">
          <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Processando...
        </span>
        <span v-else>
          {{ isLogin ? 'Entrar' : 'Cadastrar' }}
        </span>
      </button>
    </form>
    
    <div class="mt-6 text-center">
      <button
        @click="toggleMode"
        class="text-blue-400 hover:text-blue-300 text-sm font-medium transition duration-200"
      >
        {{ isLogin ? 'Não tem uma conta? Cadastre-se' : 'Já tem uma conta? Faça login' }}
      </button>
    </div>
  </div>
</template>
