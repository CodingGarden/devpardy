<template>
  <b-row>
    <b-col>
      <b-card
        title="Manage Answers"
        sub-title="Categories, Questions, Answers">
        <p class="card-text">
        </p>
        <b-link :to="{ name: 'manage-answers'}"
          class="card-link">Go</b-link>
      </b-card>
    </b-col>
    <b-col>
      <b-card
        title="Manage Games"
        sub-title="Users, Games, Scores">
        <p class="card-text">
        </p>
        <b-link :to="{ name: 'manage-games'}"
          class="card-link">Go</b-link>
      </b-card>
    </b-col>
  </b-row>
</template>

<script>
// import db from '@/db';

export default {
};
</script>
