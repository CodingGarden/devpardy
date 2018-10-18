<template>
  <section class="main">
    <section class="board">
      <section
        class="category"
        v-for="category in data.categories"
        :key="category._id">
        <section class="category-title">
          {{category.name}}
        </section>
        <section
          class="answer"
          v-for="answer in category.answers"
          @click="setCurrentAnswer(answer)"
          :class="{
            available: answer.available
          }"
          :key="answer.value">
          <span v-if="answer.available" class="value">{{answer.value}}</span>
        </section>
      </section>
    </section>
    <section class="players">
      <section
        class="player"
        v-for="(player, i) in data.game.players"
        :class="{
          current_player: data.current_player === i,
          wrong: data.current_answer_info.wrong.includes(i)
        }"
        :key="i">
        <b-input
          v-if="!viewMode"
          v-model="player.name"
          class="m-0" />
        <h3 v-else class="player-name">
          {{player.name}}
        </h3>
        <h3 class="m-0">{{player.score}}</h3>
      </section>
    </section>
    <section class="timer">
      <div
        :style="{
          width: (data.current_answer_info.seconds_left / 4) * 100 + '%'
        }"
        class="bar"></div>
    </section>
    <section
      class="big-answer"
      v-if="viewMode"
      :class="{
        visible: data.current_answer,
      }">
      <p>{{data.current_answer ? data.current_answer.answer : ''}}</p>
    </section>
  </section>
</template>

<script>
export default {
  props: ['data', 'setCurrentAnswer', 'viewMode'],
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css?family=Caveat');

.main {
  text-align: center;
  background: blue;
}

.board {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  height: 85%;
}

.category {
  outline: 4px solid black;
  display: grid;
  grid-template-rows: repeat(6, 1fr);
}

.category-title {
  color: white;
  font-size: 2em;
  font-family: Cambria,Cochin,Georgia,Times,Times New Roman,serif;
}

.category-title, .answer {
  display: flex;
  justify-content: center;
  align-items: center;
  outline: 4px solid black;
}

.answer {
  outline: 4px solid black;
}

.answer.available {
  cursor: pointer;
}

.answer.available:hover {
  outline: 4px solid #eebe3f;
}

.answer .value {
  color: #eebe3f;
}

.answer .value:hover {
  transform: scale(1.5);
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
  background: red;
}

.player input {
  text-align: center;
}

.player h3 {
  color: white;
}

.player h3.player-name {
  outline: 3px solid black;
  font-family: 'Caveat', cursive;
}

.timer {
  height: 5%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-end;
}

.timer .bar {
  transition-duration: 0.5s;
  background: darkred;
  height: 93%;
  width: 50%;
}

.big-answer {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 85%;
  transform: scale(0);
  background: blue;
  font-family: Cambria,Cochin,Georgia,Times,Times New Roman,serif;
  color: white;
  display: flex;
  text-align: center;
  justify-content: center;
  align-items: center;
  font-size: 7vw;
  transition-duration: 1s;
}

.big-answer.visible {
  transform: scale(1);
}

.big-answer p {
  padding: 0.5em;
}
</style>
