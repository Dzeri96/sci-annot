<template>
  <span class="modal-mask">
    <div class="modal-wrapper">
      <div class="modal-container">
        <div class="modal-header">
          <h2>Are you sure?</h2>
        </div>

        <div class="modal-body">
          You have indicated that there are captions <i style="color: #D88C9A">without a reference</i>, or figures/tables <i style="color: #D88C9A">without a caption</i> on this page.
          <p/>
          Are you sure this is correct? This question will not be asked again.
        </div>

        <div class="modal-footer">
          <button class="r6o-btn outline" @click="$emit('close')">No</button>
          <button class="r6o-btn" @click="$emit('submit')">Yes</button>
        </div>
      </div>
    </div>
  </span>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

export default class YesNoModal extends Vue {

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
  min-width: 30em;
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
  border-bottom: 1px solid lightgray;
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
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  padding: 8px 0;
  border-top: 1px solid lightgray;
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