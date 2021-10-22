<template>
  <div class="tut-body">
	  <div> Radi li? </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

export default class ModalTutorial extends Vue {
}
</script>

<style scoped>
	.tut-body {
		height: 100%;
		flex-grow: 1;
		transition: all 0.5s;
		min-width: 0;
		overflow: hidden;
		flex-shrink: 0;
	}

	.collapse {
    	flex-grow: 0.001;
	}
</style>