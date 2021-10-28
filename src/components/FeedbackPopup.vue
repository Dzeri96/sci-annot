<template>
  <span class="modal-mask">
    <div class="modal-wrapper">
      <div class="modal-container">
        <div class="modal-header">
          <h2>Submit with feedback</h2>
        </div>

        <div class="modal-body">
          <textarea
            id="feedback-text-area"
            form="mturk_form"
            name="feedback"
            placeholder="Enter feedback here and submit the HIT with it."
          />
        </div>

        <div class="modal-footer">
          <button class="r6o-btn outline" @click="$emit('close')">Cancel</button>
          <button class="r6o-btn" @click="$emit('submit')">Submit</button>
        </div>
      </div>
    </div>
  </span>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

export default class FeedbackPopup extends Vue {
  private feedback: string = "";
}
</script>

<style>

.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-wrapper {
  position: absolute;
  top: 50%;
  transform: translateY(-50%) translateX(-50%);
  left: 50%;
  width: 30em;
  height: 15em;
  min-width: 30em;
  min-height: 15em;
  resize: both;
  overflow: hidden;
}

.modal-container {
  background-color: #fff;
  border-radius: 2px;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.modal-header {
  padding: 8px;
  display: flex;
}

.modal-header h2 {
  margin:0;
  display: inline;
}

.modal-header button {
  display: inline;
  justify-self: end;
}

.modal-body {
  padding: 0;
  flex-grow: 1;
  padding: 8px;
  background-color: rgba(0, 0, 0, 0.05);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  padding: 8px 0;
}

.modal-footer button {
  margin-right: 8px;
}

#feedback-text-area {
  width: 100%;
  height: 100%;
  margin: 0 auto;
  box-sizing: border-box;
  resize: none;
}
/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.5s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>