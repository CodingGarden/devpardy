<template>
  <game-board
    v-if="data"
    class="view-game"
    :viewMode="true"
    :data="data" />
  <h3 v-else>Loading...</h3>
</template>

<script>
import { ipcRenderer } from 'electron';
import GameBoard from '@/components/GameBoard';

export default {
  data: () => ({
    data: null,
  }),
  components: {
    GameBoard,
  },
  mounted() {
    this.loadData();
  },
  methods: {
    loadData() {
      if (localStorage.gameData) {
        this.data = JSON.parse(localStorage.gameData);
      }

      setTimeout(this.loadData);
    },
  },
};
</script>

<style>
.view-game {
  width: 100%;
  height: 100%;
}
</style>
