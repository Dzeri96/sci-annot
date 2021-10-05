<template>
    <div class="headerContainer">
        <button id="submitButton" @click="submit">Submit</button>
    </div>
</template>

<script lang="ts">
import AnnotationStore from '@/services/annotationStore';
import { Options, Vue } from 'vue-class-component'

@Options({
    props: {
        annotationStore: AnnotationStore
    }
})
export default class AppHeader extends Vue {
    annotationStore!: AnnotationStore;

    private submit() {
        console.log('Annotations: ' + JSON.stringify(this.annotationStore.annotations));
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