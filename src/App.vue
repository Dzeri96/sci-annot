<template>
  <header>
    <app-header
      v-if="assignmentLoaded"
      @toggle-tutorial="toggleTutorial" 
      :annotationStore="store" 
      :isTutorialVisible="isTutorialVisible" 
      :isImageLoaded="isImageLoaded"
      :assignment="assignment"
      :assignmentUrl="assignmentUrl"
      :assignmentId="assignmentId"
    />
  </header>
  <main>
    <tutorial v-if="!answer" :class="{collapse: !isTutorialVisible}" id="tutorial"/>
    <image-view v-if="assignmentLoaded" :answer="answer" :annotation-store="store" :assignmentId="assignmentId" @image-loaded="imageLoaded"/>
  </main>
  <footer></footer>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import ImageView from './components/ImageView.vue';
import Tutorial from './components/Tutorial.vue';
import AppHeader from './components/Header.vue'
import AnnotationStore, { Annotation } from './services/annotationStore';
import { reactive } from 'vue';
import Answer from './models/Answer';

@Options({
  components: {
    ImageView,
    AppHeader,
    Tutorial
  },
})
export default class App extends Vue {
  isTutorialVisible: boolean = false;
  isImageLoaded: boolean = false;
  reactiveAnnos: Annotation[] = reactive([]);
  reactiveParents: string[] = reactive([]);
  store = new AnnotationStore(['Figure', 'Table'], ['Caption'], undefined, this.reactiveParents);
  private urlParams = new URLSearchParams(window.location.search);
  assignmentLoaded: boolean = false;
  answer = null;
  assignment = null;
  assignmentUrl = null;
  // Placeholder value for the MTurk assignment id
  assignmentId = 'ASSIGNMENT_ID_NOT_AVAILABLE';

  async beforeMount() {
    this.assignmentUrl = this.urlParams.get('assignmentUrl');
    // Get assignment id from URL params
    let idParam = this.urlParams.get('assignmentId');
    if (this.assignmentUrl) {
      this.assignmentId = 'ADMIN_ASSIGNMENT';
    } else if (idParam) {
      this.assignmentId = idParam;
    }
    if (this.assignmentUrl) {
      fetch(this.assignmentUrl)
        .then(async response => {
          let parsed = await response.json();
          let fetchedAnswer = Object.assign(new Answer(), parsed.answer);
          this.answer = fetchedAnswer;
          this.assignment = parsed;
        })
        .catch(err => {
          console.log(`Error fetching annotations: ${err}`)
        })
        .finally(() => {
          this.assignmentLoaded = true;
        })
    } else {
      this.assignmentLoaded = true;
    }
  }

  toggleTutorial() {
    this.isTutorialVisible = !this.isTutorialVisible;
  }

  imageLoaded() {
    this.isImageLoaded = true;
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
  -webkit-box-shadow: 0px 0px 3px 0px rgba(0,0,0,0.2); 
  box-shadow: 0px 0px 3px 0px rgba(0,0,0,0.2); 
}

button:enabled,
input[type=submit]:enabled {
  cursor: pointer !important;
}

button:disabled img{
  opacity: 50%;
}

button:hover:enabled:not(.r6o-btn):not(.selected),
input:hover[type=submit]:enabled:not(.r6o-btn):not(.selected) {
  background-color: #e6f2ff;
}

button:active:enabled:not(.r6o-btn),
button.selected:enabled,
input:active[type=submit]:enabled:not(.r6o-btn) {
  background-color: #4483c4;
  color: white;
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

.r6o-btn:active:not(.outline) {
  background-color: #32608e;
}

.r6o-btn:disabled {
  cursor: default !important;
}
</style>
