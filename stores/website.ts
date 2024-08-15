interface ISalasState {
  salas: string[]
}

export const useWebsiteStore = defineStore<'websiteStore', ISalasState>('websiteStore', {
  state: () => ({
    salas: []
  }),
  actions: {
    async fetch() : Promise<void> {
      this.salas = [];
    },
    async addSala(sala:string) {
      this.salas.push(sala);
    },
    async removerSala(indice:number) {
      if (indice > -1) {
        this.salas.splice(indice, 1);
      }
    }
  }
})
