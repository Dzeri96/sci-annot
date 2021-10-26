<template>
  <div id="imview" :class="{pointer: pointerActive}">
    <div class="loader-box" v-if="!imLoaded">
      <div class="loader"></div>
      <div class="loader-text"><b>Loading...</b></div>
    </div>
  </div>
</template>

<script src='./ImageView.ts'/>

<style scoped>
@import "../widgets/figure-caption.css";

#imview {
  height: 100%;
  flex-grow: 3;
  background-color: rgba(212, 212, 212, 0.345);
  background-image: linear-gradient(
      rgba(255, 255, 255, 0.5) 2px,
      transparent 2px
    ),
    linear-gradient(90deg, rgba(255, 255, 255, 0.5) 2px, transparent 2px),
    linear-gradient(rgba(255, 255, 255, 0.28) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.28) 1px, transparent 1px);
  background-size: 100px 100px, 100px 100px, 20px 20px, 20px 20px;
  background-position: -2px -20px, -2px -2px, -1px -1px, -1px -1px;
  justify-content: center;
  cursor: move;
}

#imview.pointer {
    cursor: crosshair !important;
}

.loader-box {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.loader-text {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  color: #3498db;
}

.loader {
  border: 10px solid white; /* Light grey */
  border-top: 10px solid #3498db; /* Blue */
  border-radius: 50%;
  width: 7em;
  height: 7em;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>