<template>
  <section class="game">
    <section class="board">
      <section
        class="category"
        v-for="category in categories"
        :key="category._id">
        <section class="category-title">
          {{category.name}}
        </section>
        <section
          class="answer"
          v-for="answer in category.answers"
          @click="setCurrentAnswer(answer)"
          :key="answer.value">
          <span class="value">{{answer.value}}</span>
        </section>
      </section>
    </section>
    <section class="players">
      <section
        class="player"
        v-for="(player, i) in game.players"
        :class="{
          current_player: current_player === i
        }"
        :key="i">
        <b-input v-model="player.name" />
        <h3>{{player.score}}</h3>
      </section>
    </section>
    <section class="current-status" v-if="current_answer">
      <section class="current-answer">
        <b-button
          @click="startAnswer()"
          variant="danger">
          Enable Buzzers
        </b-button>
        {{current_answer.answer}}
      </section>
      <section class="current-question">
        {{current_answer.question}}
      </section>
    </section>
    <section class="controls">
      <h1>Time left: {{current_answer_info.seconds_left}}</h1>
    </section>
  </section>
</template>

<script>
import db from '@/db';
import { performance } from 'perf_hooks';

export default {
  data: () => ({
    game: {},
    categories: [],
    current_player: 0,
    current_answer: null,
    current_answer_info: {
      seconds_left: 0,
      end: 0,
      buzzed_in: [],
    },
  }),
  async mounted() {
    window.addEventListener('gamepadconnected', (e) => {
      console.log(e.gamepad);
    });

    this.game = await db.playedGames.findOne({
      _id: this.$route.params.id,
    });

    const categoryIds = this.game.categories.map(c => c._id);
    this.categories = await db.categories.find({
      _id: {
        $in: categoryIds,
      },
    });
  },
  methods: {
    setCurrentAnswer(answer) {
      if (!this.current_answer) {
        this.current_answer = answer;
      }
    },
    startAnswer() {
      this.current_answer_info.seconds_left = 11;
      this.current_answer_info.end = performance.now() + 11000;
      this.current_answer_info.buzzed_in = [];
      requestAnimationFrame(this.countDown);
      requestAnimationFrame(this.pollButtons);
    },
    countDown() {
      this.current_answer_info.seconds_left = Math.floor(
        (this.current_answer_info.end - performance.now()) / 1000
      );

      if (this.current_answer_info.seconds_left === 0) {
        console.log('times up!');
      } else {
        requestAnimationFrame(this.countDown);
      }
    },
    pollButtons() {
      const gamepad = navigator.getGamepads()[0];
      const buttons = gamepad
        .buttons
        .map((b, index) => ({
          pressed: b.pressed,
          index,
        }))
        .filter(b => b.pressed);

      if (buttons.length === 1) {
        this.current_player = buttons[0].index;
        this.current_answer_info.buzzed_in.push(this.current_player);
        console.log('buzzed in!', this.current_player);
        this.current_answer_info.seconds_left = 11;
        this.current_answer_info.end = performance.now() + 11000;
      } else if (this.current_answer_info.seconds_left !== 0) {
        requestAnimationFrame(this.pollButtons);
      }
    },
  },
};
</script>

<style>
.game {
  width: 100%;
  height: 100%;
  text-align: center;
  background: blue;
}

.board {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  height: 60%;
}

.category {
  outline: 4px solid black;
  display: grid;
  grid-template-rows: repeat(6, 1fr);
}

.category-title {
  color: white;
  font-size: 2em;
}

.category-title, .answer {
  display: flex;
  justify-content: center;
  align-items: center;
}

.answer {
  outline: 4px solid black;
}

.answer .value {
  color: yellow;
}

.answer .value, .player h3, .controls  {
  font-family: Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;
  font-weight: bold;
  font-size: 3em;
}

.players {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  height: 10%;
}

.player {
  outline: 4px solid black;
}

.current_player {
  outline: 4px solid red;
}

.player input {
  text-align: center;
}

.player h3 {
  color: white;
}

.current-status {
  height: 25%;
  color: white;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  font-size: 2em;
}

.current-answer, .current-question {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  outline: 4px solid yellow;
}

.controls {
  color: white;
}
</style>
