<template>
  <section class="game">
    <game-board
      :data="data"
      :setCurrentAnswer="setCurrentAnswer"
      class="game-area"
    />
    <section class="current-status" v-if="data.current_answer">
      <section class="current-answer">
        {{data.current_answer.answer}}
      </section>
      <section class="current-question">
        <section class="buttons" v-if="data.current_answer_info.answering">
          <b-button
            @click="correctAnswer()"
            variant="success">
            Correct
          </b-button>
          <b-button
            @click="wrongAnswer()"
            variant="danger">
            Wrong
          </b-button>
        </section>
        {{data.current_answer.question}}
      </section>
    </section>
    <section class="controls" v-if="data.current_answer">
      <b-button
        @click="startAnswer()"
        v-if="!data.current_answer_info.started"
        variant="danger">
        Enable Buzzers
      </b-button>
      <section
        class="buttons"
        v-if="data.current_answer_info.started && (data.current_answer_info.seconds_left === 0 || data.current_answer_info.wrong.length === 3)">
        <b-button
          @click="resetNextQuestion()">
          Next Question
        </b-button>
      </section>
    </section>
    <section class="controls-status">
      <h1>Time left: {{data.current_answer_info.seconds_left}}</h1>
      <b-input
        v-model="data.finalJeopardy">
      </b-input>
      <b-button
        v-if="data.stop_timer"
        @click="resumeTimer()">
        Resume Timer
      </b-button>
      <b-button
        v-if="data.current_answer_info.seconds_left > 0"
        @click="data.stop_timer = true">
        Stop Timer
      </b-button>
    </section>
  </section>
</template>

<script>
import { ipcRenderer } from 'electron';
import db from '@/db';
import GameBoard from '@/components/GameBoard';
import { performance } from 'perf_hooks';

const audioPlayer = new Audio();

export default {
  data: () => ({
    data: {
      finalJeopardy: '',
      game: {},
      categories: [],
      current_player: 0,
      current_answer: null,
      stop_timer: false,
      current_answer_info: {
        started: false,
        started_player: 0,
        seconds_left: 0,
        end: 0,
        buzzed_in: [],
        wrong: [],
        answering: false,
      },
    },
  }),
  components: {
    GameBoard,
  },
  watch: {
    data: {
      handler() {
        localStorage.gameData = JSON.stringify(this.data);
      },
      deep: true,
    },
  },
  async mounted() {
    window.addEventListener('gamepadconnected', (e) => {
      console.log(e.gamepad);
    });

    this.data.game = await db.playedGames.findOne({
      _id: this.$route.params.id,
    });

    const categoryIds = this.data.game.categories.map(c => c._id);
    const categories = await db.categories.find({
      _id: {
        $in: categoryIds,
      },
    });

    categories.forEach((category) => {
      Object
        .keys(category.answers)
        .forEach(value => category.answers[value].available = true);
    });

    this.data.categories = categories;
  },
  methods: {
    setCurrentAnswer(answer) {
      if (!this.data.current_answer) {
        answer.available = false;
        this.data.current_answer = answer;
      }
    },
    startAnswer() {
      this.data.current_answer_info.started = true;
      this.data.current_answer_info.started_player = this.data.current_player;
      this.data.current_player = null;
      this.data.current_answer_info.seconds_left = 11;
      this.data.current_answer_info.end = performance.now() + 5000;
      this.data.current_answer_info.buzzed_in = [];
      this.data.stop_timer = false;
      requestAnimationFrame(this.countDown);
      requestAnimationFrame(this.pollButtons);
    },
    resumeTimer() {
      if (this.data.stop_timer && this.data.current_answer_info.seconds_left > 0) {
        this.data.current_answer_info.end = performance.now() + (this.data.current_answer_info.seconds_left * 1000);
        this.data.stop_timer = false;
        requestAnimationFrame(this.countDown);
        requestAnimationFrame(this.pollButtons);
      }
    },
    countDown() {
      if (this.data.stop_timer) return;

      this.data.current_answer_info.seconds_left = Math.floor((this.data.current_answer_info.end - performance.now()) / 1000);

      if (this.data.current_answer_info.seconds_left === 0) {
        if (this.data.current_answer_info.answering) {
          this.data.game.players[this.data.current_player].score -= this.data.current_answer.value;
          this.data.current_answer_info.wrong.push(this.data.current_player);
          this.data.current_player = null;
          this.data.current_answer_info.seconds_left = 11;
          this.data.current_answer_info.end = performance.now() + 5000;
          audioPlayer.src = 'sounds/times-up.mp3';
          audioPlayer.currentTime = 0;
          audioPlayer.play();
          this.data.current_answer_info.answering = false;
          if (this.data.current_answer_info.wrong.length !== 3) {
            requestAnimationFrame(this.countDown);
            requestAnimationFrame(this.pollButtons);
          } else {
            this.data.current_player = this.data.current_answer_info.started_player;
          }
        } else {
          console.log('no one!');
          this.data.current_player = this.data.current_answer_info.started_player;
          audioPlayer.src = 'sounds/times-up.mp3';
          audioPlayer.currentTime = 0;
          audioPlayer.play();
        }
        console.log('times up!');
      } else if (!this.data.stop_timer) {
        requestAnimationFrame(this.countDown);
      }
    },
    pollButtons() {
      if (this.data.stop_timer) return;

      const gamepad = navigator.getGamepads()[0];
      const buttons = gamepad
        .buttons
        .map((b, index) => ({
          pressed: b.pressed,
          index,
        }))
        .filter(b => b.pressed && !this.data.current_answer_info.buzzed_in.includes(b.index));

      if (buttons.length === 1) {
        this.data.current_player = buttons[0].index;
        this.data.current_answer_info.buzzed_in.push(this.data.current_player);
        console.log('buzzed in!', this.data.current_player);
        this.data.current_answer_info.seconds_left = 11;
        this.data.current_answer_info.end = performance.now() + 5000;
        this.data.current_answer_info.answering = true;
      } else if (this.data.current_answer_info.seconds_left !== 0) {
        requestAnimationFrame(this.pollButtons);
      }
    },
    resetNextQuestion() {
      this.data.current_answer = null;
      this.data.current_player = this.data.current_answer_info.started_player;
      this.data.current_answer_info = {
        started_player: 0,
        seconds_left: 0,
        end: 0,
        buzzed_in: [],
        wrong: [],
        answering: false,
        started: false,
      };
    },
    correctAnswer() {
      const winner = this.data.current_player;
      this.data.stop_timer = true;
      this.data.game.players[winner].score = Number(this.data.game.players[winner].score);
      this.data.game.players[winner].score += this.data.current_answer.value;
      this.data.current_player = winner;
      this.data.current_answer_info = {
        started_player: winner,
        seconds_left: 0,
        end: 0,
        buzzed_in: [],
        wrong: [],
        answering: false,
        started: true,
      };
    },
    wrongAnswer() {
      const loser = this.data.current_player;
      this.data.game.players[loser].score -= this.data.current_answer.value;
      this.data.current_answer_info.wrong.push(this.data.current_player);
      this.data.current_player = null;
      this.data.current_answer_info.seconds_left = 11;
      this.data.current_answer_info.end = performance.now() + 5000;
      audioPlayer.src = 'sounds/times-up.mp3';
      audioPlayer.currentTime = 0;
      audioPlayer.play();
      this.data.current_answer_info.answering = false;
      if (this.data.current_answer_info.wrong.length !== 3) {
        requestAnimationFrame(this.countDown);
        requestAnimationFrame(this.pollButtons);
      } else {
        this.data.current_player = this.data.current_answer_info.started_player;
        this.data.stop_timer = true;
      }
    },
  },
};
</script>

<style>
.game {
  width: 100%;
  height: 100%;
  background: blue;
  text-align: center;
}

.game-area {
  height: 77%;
}

.current-status {
  height: 15%;
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
  outline: 4px solid #eebe3f;
}

.controls, .controls-status {
  color: white;
  display: flex;
  justify-content: space-around;
  outline: 4px solid black;
}

.wrong {
  background: gray;
}
</style>
