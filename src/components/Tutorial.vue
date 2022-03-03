<template>
  <div class="tut-body">
		<div class="tut-content">
			<h2>Instructions:</h2>
			<div class="tut-unit">
				<ul>
					<li>
						Draw bounding boxes around scientific figures. Treat all sub-figures as one figure.
						If unsure, look at the number of captions under the figure.
					</li>
				</ul>
				<video autoplay loop inline muted>
					<source src="../assets/figure_selection.webm" type="video/webm"/>
				</video>
			</div>
			

			<div class="tut-unit">
				<ul>
					<li>
						Draw bounding boxes around tables.
					</li>
				</ul>
				<video autoplay loop inline muted>
					<source src="../assets/table_selection.webm" type="video/webm"/>
				</video>
			</div>

			<div class="tut-unit">
				<ul>
					<li>
						Draw bounding boxes around captions and select elements that they refer to.
					</li>
				</ul>
				<video autoplay loop inline muted>
						<source src="../assets/caption_selection.webm" type="video/webm"/>
				</video>
			</div>

			<div class="tut-unit">
				<ul>
					<li>
						Some tables have footers in addition to captions.
						Include these in the table's bounding box.
					</li>
				</ul>
				<img src="../assets/table_with_footer.webp"/>
			</div>

			<div class="tut-unit">
				<ul>
					<li>
						Logos and other decorative images are not counted as scientific figures.
					</li>
				</ul>
				<img src="../assets/bad_example_logos.webp"/>
			</div>

			<div class="tut-unit">
				<ul>
					<li>
						Formulas are not counted as scientific figures.
					</li>
				</ul>
				<img src="../assets/bad_example_formulas.webp"/>
			</div>
			

			<div class="tut-unit">
				<ul>
					<li>
						It can happen that a page contains a figure or table without a caption and vice versa.
						In such a case you will see <i style="color: #D88C9A">No Reference</i> or <i style="color: #D88C9A">No Caption</i> in the bounding box.
						If you are really sure you have selected everything correctly, check <b>Elements without reference/caption</b> next to the submit button.
					</li>
				</ul>
			</div>

			<div class="tut-unit">
				<ul>
					<li>
						If you're not sure if an element is a figure or a table, check the caption, as it usually mentions the type of element it refers to. 
					</li>
				</ul>
			</div>

			<div class="tut-unit">
				<ul>
					<li>
						If you wish to submit feedback or report issues together with your HIT results, click the button on the top right.
						We appreciate any improvement suggestions!
					</li>
				</ul>
			</div>

			<h2>Shortcuts:</h2>
			<div class="tut-unit">
				<img src="../assets/shortcuts.webp"/>
				<ul>
					<li>
						Select the desired class with your keyboard's number row: <span class="hotkey">1</span>, <span class="hotkey">2</span>, <span class="hotkey">3</span>.
					</li>
					<li>
						Select the reference with keys <span class="hotkey">Q</span>, <span class="hotkey">W</span>, <span class="hotkey">E</span>.
					</li>
					<li>
						Save selection with the <span class="hotkey">Space</span> key.
					</li>
					<li>
						Move the document with the <span class="hotkey">Shift</span> key or the <span class="hotkey">Middle mouse button</span>.
					</li>
				</ul>
			</div>
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

	.tut-unit {
		width: 100%;
		margin-bottom: 52px;
	}
</style>