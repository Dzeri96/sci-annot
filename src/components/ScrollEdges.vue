<template>
  <div
      id="left-edge"
      ref="left"
      class="edge"
      @mouseenter="outerEnter($event.target.id)"
      @mouseleave="outerLeave($event.target.id)"
    />
    <div
      id="left-bottom-corner"
      ref="leftBottom"
      class="edge corner"
      @mouseenter="
        outerEnter('left-edge');
        outerEnter('bottom-edge');
      "
      @mouseleave="
        outerLeave('left-edge');
        outerLeave('bottom-edge');
      "
    />
    <div
      id="left-top-corner"
      ref="leftTop"
      class="edge corner"
      @mouseenter="
        outerEnter('left-edge');
        outerEnter('top-edge');
      "
      @mouseleave="
        outerLeave('left-edge');
        outerLeave('top-edge');
      "
    />
    <div
      id="top-edge"
      ref="top"
      class="edge"
      @mouseenter="outerEnter($event.target.id)"
      @mouseleave="outerLeave($event.target.id)"
    />
    <div
      id="right-edge"
      ref="right"
      class="edge"
      @mouseenter="outerEnter($event.target.id)"
      @mouseleave="outerLeave($event.target.id)"
    />
    <div
      id="right-bottom-corner"
      ref="rightBottom"
      class="edge corner"
      @mouseenter="
        outerEnter('right-edge');
        outerEnter('bottom-edge');
      "
      @mouseleave="
        outerLeave('right-edge');
        outerLeave('bottom-edge');
      "
    />
    <div
      id="right-top-corner"
      ref="rightTop"
      class="edge corner"
      @mouseenter="
        outerEnter('right-edge');
        outerEnter('top-edge');
      "
      @mouseleave="
        outerLeave('right-edge');
        outerLeave('top-edge');
      "
    />
    <div
      id="bottom-edge"
      ref="bottom"
      class="edge"
      @mouseenter.stop="outerEnter($event.target.id)"
      @mouseleave.stop="outerLeave($event.target.id)"
    />
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({
  props: {
    scrollTimeoutMs: Number,
  },
  emits: ["scroll"],
})
export default class ScrollEdges extends Vue {
  private activeSides: string[];
  private scrollTimeoutMs: number;
  private scrollingActive: boolean;
  private inFrame = true;

  mounted() {
    if (this.activeSides) {
      this.activeSides.length = 0;
    } else {
      this.activeSides = [];
    }
    this.scrollingActive = false;
  }

  unmounted() {
    this.activeSides.length = 0;
  }

  private outerEnter(id: string) {
    this.addSide(id);
  }

  private outerLeave(id: string) {
    // Slight timeout to allow for leaving frame and still keep scrolling
    setTimeout(() => {
      this.removeSide(id);
    }, this.scrollTimeoutMs);
  }

  private addSide(side: string) {
    if (!this.activeSides.includes(side)) {
      this.activeSides.push(side);
      if (!this.scrollingActive) this.emitScroll();
    }
  }

  private removeSide(side: string) {
    if (this.inFrame) {
      let index = this.activeSides.indexOf(side);
      if (index > -1) {
        this.activeSides.splice(index, 1);
      }
    }
  }

  public frameLeave() {
    this.inFrame = false;
  }

  public frameEnter() {
    this.inFrame = true;
    // JS sometimes skips frames and ignores edgeLeave so this is needed
    this.activeSides.length = 0;
  }

  private async emitScroll() {
    this.scrollingActive = true;
    while (this.activeSides.length) {
      await new Promise((resolve) => {
        setTimeout(() => {
          if (this.activeSides.length) {
            this.$emit("scroll", this.activeSides);
          }
          resolve(true);
        }, this.scrollTimeoutMs);
      });
    }
    this.scrollingActive = false;
  }
}
</script>
 
<style scoped>
* {
  --outer-edge-thickness: 20px;
}

.edge {
  position: absolute;
  z-index: 1;
}

#left-edge {
  left: 0;
  top: var(--outer-edge-thickness);
  height: calc(100% - 2 * var(--outer-edge-thickness));
  width: var(--outer-edge-thickness);
}

#top-edge {
  top: 0;
  left: var(--outer-edge-thickness);
  width: calc(100% - 2 * var(--outer-edge-thickness));
  height: var(--outer-edge-thickness);
}

#right-edge {
  top: var(--outer-edge-thickness);
  right: 0;
  height: calc(100% - 2 * var(--outer-edge-thickness));
  width: var(--outer-edge-thickness);
}

#bottom-edge {
  bottom: 0;
  left: var(--outer-edge-thickness);
  width: calc(100% - 2 * var(--outer-edge-thickness));
  height: var(--outer-edge-thickness);
}

.corner {
  height: var(--outer-edge-thickness);
  width: var(--outer-edge-thickness);
}

#left-bottom-corner {
  bottom: 0;
  left: 0;
}

#left-top-corner {
  top: 0;
  left: 0;
}

#right-bottom-corner {
  bottom: 0;
  right: 0;
}

#right-top-corner {
  top: 0;
  right: 0;
}
</style>