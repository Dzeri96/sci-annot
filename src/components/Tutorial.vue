<template>
  <div class="tut-body">
		<div class="tut-content">
			<p>Radi li?</p>
		</div>
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
		box-sizing: border-box;
		flex-grow: 1;
		transition: all 0.35s;
		min-width: 0;
		width: 0;
		overflow: hidden;
		flex-shrink: 0;
		z-index: 1;
	}

	.collapse {
    	flex-grow: 0.001;
	}

	.tut-content {
		overflow: hidden;
		width: 20vw;
	}
</style>