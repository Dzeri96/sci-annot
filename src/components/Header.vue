<template>
    <div class="headerContainer">
        <span v-if="annotationStore">Len: {{annotationStore.freeParents.length}}</span>
        <button id="submitButton" @click="submit">Submit</button>
    </div>
</template>

<script lang="ts">
import AnnotationStore from '@/services/annotationStore';
import { Vue } from "vue-class-component";
import { Prop } from 'vue-property-decorator';

export default class AppHeader extends Vue {
    @Prop()
    private annotationStore: AnnotationStore;
    private counter = 0;
    // Injected from package.json by webpack
    private version = '[AIV]{version}[/AIV]';

    private submit() {
        let result = {
            version: this.version,
            timeSec: this.counter,
            annotations: this.annotationStore.annotations 
        }
        console.log('Result: ' + JSON.stringify(result));
    }

    mounted() {
        // Start counter
        setInterval(() => {
        this.counter++
        }, 1000)

        // Get version
        console.log(`App version: ${this.version}`);
    }
}

</script>

<style scoped>
.headerContainer {
    display: flex;
    justify-content: flex-end;
    padding: 0px 5px 5px 5px;
    margin: 0;
    padding: 4px;
    background-color: rgba(212, 212, 212, 0.345);
    border: white;
    border-style: solid;
    border-width: 2px 0px 2px 0px;
}
</style>