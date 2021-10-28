<template>
  <header><app-header @toggle-tutorial="toggleTutorial" :annotationStore="store" :isTutorialVisible="isTutorialVisible"/></header>
    <main>
      <tutorial :class="{collapse: !isTutorialVisible}"/>
      <image-view :annotation-store="store"/>
    </main>
    <footer></footer>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import HelloWorld from './components/HelloWorld.vue';
import ImageView from './components/ImageView.vue';
import Tutorial from './components/Tutorial.vue';
import AppHeader from './components/Header.vue'
import AnnotationStore, { Annotation } from './services/annotationStore';
import { reactive } from 'vue';

@Options({
  components: {
    HelloWorld,
    ImageView,
    AppHeader,
    Tutorial
  },
})
export default class App extends Vue {
  isTutorialVisible: boolean = false;
  reactiveAnnos: Annotation[] = reactive([]);
  reactiveParents: string[] = reactive([]);
  store = new AnnotationStore(['Figure', 'Table'], ['Caption'], undefined, this.reactiveParents);

  toggleTutorial() {
    this.isTutorialVisible = !this.isTutorialVisible;
  }
}
</script>

<style>
* {
    font-family: 'Lato', sans-serif;
    box-sizing: border-box;
}

html {
  max-height: 100vh;
  box-sizing: border-box;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

body {
  height: 100vh;
  max-height: 100vh;
  margin: 0px;
  display: flex;
  flex-flow: column;
}

main {
  display: flex;
  transition: all 2s;
  flex-grow: 1;
  box-sizing: border-box;
  min-height: 0;
}

.collapse {
    flex-grow: 0.001;
	}

/* CSS */
button,
input[type="submit"]:not(.r6o-btn) {
  background-color: #FFFFFF;
  border: 1px solid rgb(209,213,219);
  border-radius: 5px;
  padding: 3px;
  text-align: center;
  text-decoration: none #D1D5DB solid;
  text-decoration-thickness: auto;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  font-size: 1em;
}

button:enabled,
input[type=submit]:enabled {
  cursor: pointer !important;
}

button:disabled img{
  opacity: 50%;
}

button:hover:enabled:not(.r6o-btn),
input:hover[type=submit]:enabled:not(.r6o-btn) {
  background-color: rgb(245, 245, 245);
}

button:active:enabled:not(.r6o-btn),
button.selected:enabled,
input:active[type=submit]:enabled:not(.r6o-btn) {
  background-color: rgb(229, 229, 229);
}

button:focus:enabled:not(.r6o-btn),
input:focus[type=submit]:enabled:not(.r6o-btn) {
  outline: 2px solid transparent;
  outline-offset: 2px;
}

button:focus-visible:not(.r6o-btn),
input:focus-visible[type=submit]:not(.r6o-btn) {
  box-shadow: none;
}

.r6o-btn:active {
  background-color: #32608e;
}
</style>
