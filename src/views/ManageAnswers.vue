<template>
  <section>
    <b-row>
      <b-col cols="4">
        <h1>Categories</h1>
        <b-list-group>
          <b-list-group-item
            v-for="category in categories"
            :key="category._id"
            :to="{ name: 'category', params: { id: category._id }}">
            {{category.name}}
          </b-list-group-item>
        </b-list-group>
        <hr>
        <b-form @submit.prevent="addCategory()">
          <b-form-group
            label="Category Name:"
            label-for="category">
            <b-form-input
              id="category"
              type="text"
              v-model="category"
              required
              placeholder="Enter a category name.">
            </b-form-input>
          </b-form-group>
          <b-button type="submit" variant="primary">Add Category</b-button>
        </b-form>
      </b-col>
      <b-col cols="8">
        <h1>Answers / Questions</h1>
        <router-view></router-view>
      </b-col>
    </b-row>
  </section>
</template>

<script>
import db from '@/db';

export default {
  data: () => ({
    category: '',
    categories: [],
  }),
  async mounted() {
    // await db.categories.remove({}, { multi: true });
    this.categories = await db.categories.find();
  },
  methods: {
    async addCategory() {
      const created = await db.categories.insert({
        name: this.category,
        answers: Array.from({ length: 5 }, (_, i) => ({
          value: (i + 1) * 200,
          question: '',
          answer: '',
        })).reduce((all, a) => (all[a.value] = a, all), {}),
      });
      console.log(created);
      this.category = '';
      this.categories = await db.categories.find();
    },
  },
};
</script>
