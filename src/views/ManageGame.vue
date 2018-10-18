<template>
  <section class="mb-5">
    <h1>{{game.name}}</h1>
    <p>{{game.description}}</p>
    <b-button class="mb-2" @click="launchGame()" variant="primary">Launch Game</b-button>
    <b-row>
      <b-col cols="12" v-for="(category, i) in game.categories" :key="i">
        <b-card>
          <h2>Category {{i + 1}}</h2>
          <b-form-select v-model="category._id">
            <option :value="null">Please select an option</option>
            <option
              :key="option._id"
              :value="option._id"
              v-for="option in categories">{{option.name}}</option>
          </b-form-select>
        </b-card>
      </b-col>
    </b-row>
    <b-button @click="saveGame()" class="mt-3" variant="primary">Save</b-button>
  </section>
</template>

<script>
import { ipcRenderer } from 'electron';

import db from '@/db';

export default {
  data: () => ({
    game: {},
    categories: [],
  }),
  async mounted() {
    this.categories = await db.categories.find();
    this.game = await db.games.findOne({
      _id: this.$route.params.id,
    });
  },
  methods: {
    async saveGame() {
      await db.games.update({
        _id: this.$route.params.id,
      }, this.game);
    },
    async launchGame() {
      const newGame = {
        start_date: Date.now(),
        inProgress: true,
        players: [{
          name: '',
          score: 0,
        }, {
          name: '',
          score: 0,
        }, {
          name: '',
          score: 0,
        }],
        categories: this.game.categories,
      };
      const created = await db.playedGames.insert(newGame);
      this.$router.push({
        name: 'play-game',
        params: {
          id: created._id,
        },
      });
      ipcRenderer.send('launch-game');
    },
  },
};
</script>

<style>

</style>
