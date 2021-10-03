<template>
  <html style="height:100%">
    <header></header>
    <main>
      <image-view />
    </main>
    <footer></footer>
  </html>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import HelloWorld from './components/HelloWorld.vue';
import ImageView from './components/ImageView.vue';

@Options({
  components: {
    HelloWorld,
    ImageView
  },
})
export default class App extends Vue {}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

main {
  outline: blue;
  outline-width: 1px;
  height: 100%;
  width: 100%;
  border: blue;
  border-style: solid;
  display: flex;
}

body {
  height: 100vh;
}
</style>
