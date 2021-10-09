<template>
    <div class="headerContainer">
        <span v-if="annotationStore">Len: {{annotationStore.freeParents.length}}</span>
        <button id="submitButton" @click="submit">Submit</button>
    </div>
</template>

<script lang="ts">
import AnnotationStore from '@/services/annotationStore';
import { Vue } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

export default class AppHeader extends Vue {
    @Prop()
    private annotationStore: AnnotationStore;
    private counter = 0;

    private submit() {
        console.log('Annotations: ' + JSON.stringify(this.annotationStore));
    }

    mounted() {
        setInterval(() => {
        this.counter++
        }, 1000)
    }
}

</script>

<style scoped>
.headerContainer {
    display: flex;
    justify-content: flex-end;
    padding: 0px 5px 5px 5px;
    margin: 0;
}   
</style>