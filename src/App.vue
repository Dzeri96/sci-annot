<template>
  <html style="height:100%">
    <header><app-header :annotation-store="store"/></header>
    <main>
      <image-view :annotation-store="store"/>
    </main>
    <footer></footer>
  </html>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import HelloWorld from './components/HelloWorld.vue';
import ImageView from './components/ImageView.vue';
import AppHeader from './components/Header.vue'
import AnnotationStore from './services/annotationStore';

@Options({
  components: {
    HelloWorld,
    ImageView,
    AppHeader
  },
})
export default class App extends Vue {
  store = new AnnotationStore(['Figure', 'Table'], ['Caption']);
}
</script>

<style>
* {
    font-family: 'Lato', sans-serif;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

main {
  outline-width: 1px;
  height: 100%;
  width: 100%;
  display: flex;
}

body {
  height: 100vh;
}
</style>
