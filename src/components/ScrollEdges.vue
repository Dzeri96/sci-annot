<template>
    <div
        id="left-edge"
        ref="left"
        class="edge"
        @mouseover="outerEnter($event.target.id)"
        @mouseleave="outerLeave($event.target.id)"
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
        id="bottom-edge" 
        ref="bottom"
         class="edge" 
        @mouseenter="outerEnter($event.target.id)" 
        @mouseleave="outerLeave($event.target.id)"
    />
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

export default class ScrollEdges extends Vue {
    private left: Element;
    private top: Element;

    mounted() {
        this.left = this.$refs.left as Element;
        this.top = this.$refs.top as Element;
    }

    private outerEnter( id: string) {
        console.log(`outerEnter: ${id}`)
    }

    private outerLeave( id: string) {
        console.log(`outerLeave: ${id}`)
    }

}

</script>

<style scoped>
.edge {
    position: absolute;
    z-index: 1;
}

#left-edge {
    left: 0;
    top: 0;
    height: 100%;
    width: 20px;
    background-color: rgba(173, 42, 42, 0.5);
    
}

#top-edge {
    top: 0;
    left: 0;
    width: 100%;
    height: 20px;
    background-color: rgba(42, 147, 173, 0.5);
}

#right-edge {
    top: 0;
    right: 0;
    height: 100%;
    width: 20px;
    background-color: rgba(151, 42, 173, 0.5);
}

#bottom-edge {
    bottom: 0;
    left: 0;
    width: 100%;
    height: 20px;
    background-color: rgba(42, 173, 53, 0.5);
}
</style>