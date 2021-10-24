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
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

main {
  display: flex;
  flex-direction: row;
  height: 100%;
  transition: all 2s;
}

body {
  height: 100vh;
  max-height: 100vh;
  margin: 0px;
  display: flex;
  flex-flow: column;
}

.collapse {
    flex-grow: 0.001;
	}

/* CSS */
button,
input[type="submit"] {
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
  cursor: pointer;
}

button:hover,
input:hover[type=submit]:enabled {
  background-color: rgb(245, 245, 245);
}

button:active,
button.selected,
input:active[type=submit]:enabled {
  background-color: rgb(229, 229, 229);
}

button:focus,
input:focus[type=submit]:enabled {
  outline: 2px solid transparent;
  outline-offset: 2px;
}

button:focus-visible,
input:focus-visible[type=submit] {
  box-shadow: none;
}
</style>
