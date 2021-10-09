<template>
  <header><app-header :annotationStore="store"/></header>
    <main>
      <image-view :annotation-store="store"/>
    </main>
    <footer></footer>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import HelloWorld from './components/HelloWorld.vue';
import ImageView from './components/ImageView.vue';
import AppHeader from './components/Header.vue'
import AnnotationStore, { Annotation } from './services/annotationStore';
import { reactive } from 'vue';

@Options({
  components: {
    HelloWorld,
    ImageView,
    AppHeader
  },
})
export default class App extends Vue {
  reactiveAnnos: Annotation[] = reactive([]);
  reactiveParents: string[] = reactive([]);
  store = new AnnotationStore(['Figure', 'Table'], ['Caption'], this.reactiveAnnos, this.reactiveParents);

  mounted() {
    // Inject reactivity
    //this.store.freeParents = this.reactiveParents;
  }
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
}

main {
  outline-width: 1px;
  height: 100%;
  width: 100%;
  display: flex;
}

body {
  height: 100vh;
  max-height: 100vh;
  margin: 0px;
}
</style>
