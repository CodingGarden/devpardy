import Vue from 'vue';
import Router from 'vue-router';

import Home from '@/views/Home.vue';
import ManageAnswers from '@/views/ManageAnswers.vue';
import ManageGames from '@/views/ManageGames.vue';
import ManageGame from '@/views/ManageGame.vue';
import Category from '@/views/Category.vue';
import PlayGame from '@/views/PlayGame.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/manage-answers',
      name: 'manage-answers',
      component: ManageAnswers,
      children: [{
        path: '/category/:id',
        name: 'category',
        component: Category,
      }],
    },
    {
      path: '/manage-games',
      name: 'manage-games',
      component: ManageGames,
    },
    {
      path: '/manage-game/:id',
      name: 'manage-game',
      component: ManageGame,
    },
    {
      path: '/play-game/:id',
      name: 'play-game',
      component: PlayGame,
    },
  ],
});
