<template>
  <section>
    <h1>{{category.name}}</h1>
    <b-alert v-if="changed" show variant="danger">
      <p>You have Unsaved Changes!</p>
      <b-button
        @click="saveCategory()"
        type="submit"
        variant="danger">Save</b-button>
    </b-alert>
    <b-card
      v-for="answer in category.answers"
      :key="answer.value"
      :title="answer.value.toString()"
      class="mb-2">
      <p class="card-text">
        <h3>Question</h3>
        <b-form-textarea
          v-model="answer.question"
          placeholder="Enter a question"
          :rows="3"
          :max-rows="6">
        </b-form-textarea>
      </p>
      <p class="card-text">
        <h3>Answer</h3>
        <b-form-textarea
          v-model="answer.answer"
          placeholder="Enter an answer"
          :rows="3"
          :max-rows="6">
        </b-form-textarea>
      </p>
    </b-card>
  </section>
</template>

<script>
import db from '@/db';

export default {
  data: () => ({
    firstLoad: true,
    changed: false,
    category: {},
  }),
  watch: {
    async '$route.params.id'() {
      if (this.changed) {
        await this.saveCategory();
      }
      this.getCategory();
    },
    'category.answers': {
      handler() {
        if (this.firstLoad) {
          this.firstLoad = false;
        } else if (!this.changed) {
          this.changed = true;
        }
      },
      deep: true,
    },
  },
  created() {
    this.getCategory();
  },
  methods: {
    async getCategory() {
      this.changed = false;
      this.firstLoad = true;
      this.category = await db.categories.findOne({
        _id: this.$route.params.id,
      });
    },
    async saveCategory() {
      await db.categories.update({
        _id: this.category._id,
      }, this.category);
      this.changed = false;
      this.firstLoad = true;
    },
  },
};
</script>

<style>

</style>
