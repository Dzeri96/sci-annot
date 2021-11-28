<template>
    <div
        id="left-edge"
        ref="left"
        class="edge"
        @mouseover="outerEnter($event.target.id)"
        @mouseleave="outerLeave($event.target.id)"
    />
    <div
        id="left-bottom-corner"
        ref="leftBottom"
        class="edge corner"
        @mouseover="outerEnter('left-edge'); outerEnter('bottom-edge');"
        @mouseleave="outerLeave('left-edge'); outerLeave('bottom-edge')"
    />
    <div
        id="left-top-corner"
        ref="leftTop"
        class="edge corner"
        @mouseover="outerEnter('left-edge'); outerEnter('top-edge');"
        @mouseleave="outerLeave('left-edge'); outerLeave('top-edge')"
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
        @mouseover="outerEnter('right-edge'); outerEnter('bottom-edge');"
        @mouseleave="outerLeave('right-edge'); outerLeave('bottom-edge')"
    />
    <div
        id="right-top-corner"
        ref="rightTop"
        class="edge corner"
        @mouseover="outerEnter('right-edge'); outerEnter('top-edge');"
        @mouseleave="outerLeave('right-edge'); outerLeave('top-edge')"
    />
    <div 
        id="bottom-edge" 
        ref="bottom"
         class="edge" 
        @mouseenter="outerEnter($event.target.id)" 
        @mouseleave="outerLeave($event.target.id)"
    />
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({
    props: {
        scrollTimeoutMs: Number
    },
    emits: ['scroll']
})
export default class ScrollEdges extends Vue {
    private activeSides = [];
    private scrollTimeoutMs: number;
    private scrollingActive = false;

    mounted() {
    }

    private outerEnter( id: string) {
        this.addSide(id);
    }

    private outerLeave( id: string) {
        this.removeSide(id);
    }

    private addSide(side: string) {
        this.activeSides.push(side);
        if (!this.scrollingActive) this.emitScroll();
    }

    private removeSide(side: string) {
        let index = this.activeSides.indexOf(side);
        if (index != -1) {
            this.activeSides.splice(index, 1);
        }
    }

    private async emitScroll() {
        this.scrollingActive = true;
        while (this.activeSides.length) {
            await new Promise ((resolve) => {
                setTimeout(() => {
                    if (this.activeSides.length) this.$emit('scroll', this.activeSides);
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
    background-color: rgba(173, 42, 42, 0.5);
    
}

#top-edge {
    top: 0;
    left: var(--outer-edge-thickness);
    width: calc(100% - 2 * var(--outer-edge-thickness));
    height: var(--outer-edge-thickness);
    background-color: rgba(42, 147, 173, 0.5);
}

#right-edge {
    top: var(--outer-edge-thickness);
    right: 0;
    height: calc(100% - 2 * var(--outer-edge-thickness));
    width: var(--outer-edge-thickness);
    background-color: rgba(151, 42, 173, 0.5);
}

#bottom-edge {
    bottom: 0;
    left: var(--outer-edge-thickness);
    width: calc(100% - 2 * var(--outer-edge-thickness));
    height: var(--outer-edge-thickness);
    background-color: rgba(42, 173, 53, 0.5);
}

.corner {
    height: var(--outer-edge-thickness);
    width: var(--outer-edge-thickness);
    background-color: rgba(160, 173, 42, 0.5);
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