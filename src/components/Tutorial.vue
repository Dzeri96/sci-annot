<template>
  <div class="tut-body">
		<div class="tut-content">
			<h2>Instructions:</h2>
			<ul>
				<li>
					Draw bounding boxes around scientific figures. Treat all sub-figures as one figure.
					If unsure, look at the number of captions under the figure.
				</li>
			</ul>
			<video autoplay loop inline>
				<source src="../assets/figure_selection.webm" type="video/webm"/>
			</video>
			<ul>
				<li>
					Logos and other decorative images are not counted as scientific figures
				</li>
			</ul>
			<img src="../assets/bad_example_logos.webp"/>

			<ul>
				<li>
					Draw bounding boxes around tables.
				</li>
			</ul>
			<video autoplay loop inline>
					<source src="../assets/table_selection.webm" type="video/webm"/>
			</video>

			<ul>
				<li>
					Draw bounding boxes around captions and select elements that they refer to.
				</li>
			</ul>
			<video autoplay loop inline>
					<source src="../assets/caption_selection.webm" type="video/webm"/>
			</video>

			<ul>
				<li>
					It can happen that a page contains a figure or table without a caption and vice versa.
					In such a case you will see <i style="color: #D88C9A">Parentless</i> or <i style="color: #D88C9A">Childless</i> in the bounding box.
					If you are really sure you have selected everything correctly, check <b>Elements with no parent/child</b> next to the submit button.
				</li>
			</ul>
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
		overflow-x: hidden;
		flex-shrink: 0;
		z-index: 1;
		background-color: rgba(212, 212, 212, 0.245);
	}

	.collapse {
    	flex-grow: 0.001;
		overflow-y: hidden;
	}

	.tut-content {
		overflow: hidden;
		width: 25vw;
		padding: 8px;
		box-sizing: border-box;
	}

	.tut-content ul {
		padding-left: 22px;
	}

	video, img {
		width: 100%;
	}
</style>