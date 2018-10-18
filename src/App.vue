<template>
  <div id="app">
    <!-- <b-navbar toggleable="md" type="dark" variant="dark">
      <b-navbar-brand :to="{ name: 'home'}">Devpardy</b-navbar-brand>
    </b-navbar> -->
    <!-- <b-container class="mt-5"> -->
      <router-view/>
    <!-- </b-container> -->
  </div>
</template>

<style lang="scss">
body {
  width: 100vw;
  height: 100vh;
}

#app {
  width: 100%;
  height: 100%;
}
</style>
