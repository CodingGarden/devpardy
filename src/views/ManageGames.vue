<template>
  <section>
    <b-row>
      <b-col cols="12" v-for="game in games" :key="game._id">
        <b-card :title="game.name">
          <p class="card-text">
            {{game.description}}
          </p>
          <b-button :to="{
              name: 'manage-game',
              params: {
                id: game._id
              }
            }" variant="primary">Manage</b-button>
        </b-card>
      </b-col>
    </b-row>
    <b-row>
      <b-form class="textarea" @submit.prevent="addGame()">
        <b-form-group
          label="Game Name:"
          label-for="name">
          <b-form-input
            id="name"
            type="text"
            v-model="game.name"
            required
            placeholder="Enter a game name.">
          </b-form-input>
        </b-form-group>
        <b-form-group
          label="Game Description:"
          label-for="description">
          <b-form-textarea
            id="description"
            type="text"
            v-model="game.description"
            required
            rows="3"
            placeholder="Enter a game description.">
          </b-form-textarea>
        </b-form-group>
        <b-button type="submit" variant="primary">Add Game</b-button>
      </b-form>
    </b-row>
  </section>
</template>

<script>
import db from '@/db';

export default {
  data: () => ({
    games: [],
    game: {
      name: '',
      description: '',
    },
  }),
  mounted() {
    // db.games.remove({}, { multi: true });
    this.getGames();
  },
  methods: {
    async getGames() {
      this.games = await db.games.find();
    },
    async addGame() {
      const game = {
        ...this.game,
        categories: Array.from({ length: 6 }, () => ({
          _id: '',
        })),
      };
      await db.games.insert(game);
      this.game = {
        name: '',
        description: '',
      };
      this.getGames();
    },
  },
};
</script>

<style>
.textarea {
  width: 100%;
}
</style>
