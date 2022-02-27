<template>
    <span class="header-container">
        <span v-if="!assignment" class="left-header">
            <button @click="toggleTutorial" :class="{'selected': isTutorialVisible, 'not-seen': !tutorialSeen}"> Instructions </button>
            <span style="opacity: 60%; margin-left: 1em">Draw rectangles around all scientific Figures, Tables and their corresponding Captions.</span>
        </span>
        <!-- Review mode -->
        <span v-else class="left-header">
            <b>ID:</b> {{assignment.assignment_id}} 
            <b>AppVersion:</b> {{assignment.answer.appVersion}}
            <b>Time:</b> {{assignment.answer.secondCounter}}s
            <span v-if="assignment.answer.comment"><b>Comment:</b> {{assignment.answer.comment}}</span>
        </span>
        <tutorial-tooltip v-if="!tutorialSeen"/>
        <span class="right-header">
            <span v-if="annotationsEmpty()" class="text-checkbox">
                <span>Nothing found</span>
                <input type="checkbox" v-model="acceptEmpty"/>
            </span>
            <span v-if="orphansOrChildless()" class="text-checkbox">
                <span>Elements without reference/caption</span>
                <input type="checkbox" v-model="acceptOrphans"/>
            </span>
            <form method='post' id='mturk_form' v-bind:action="submitLink">
                <base v-if="assignmentUrl" target="_parent"/>
                <input v-if="csrfToken" type="hidden" name="csrfmiddlewaretoken" :value="csrfToken"/>
                <input type="hidden" name="assignmentId" :value="assignmentId">
                <input type="hidden" name="appVersion" :value="appVersion"/>
                <input type="hidden" name="secondCounter" :value="counter"/>
                <input type="hidden" name="canvasHeight" :value="annotationStore.canvasHeight"/>
                <input type="hidden" name="canvasWidth" :value="annotationStore.canvasWidth"/>
                <input type="hidden" name="annotations" :value="JSON.stringify(annotationStore.annotations)"/>
                <input v-if="comment" type="hidden" name="comment" :value="comment"/>
                <input type="submit" id="submitButton" ref="submitButton" value="Submit" :disabled="!submitEnabled()" class="r6o-btn" @click="submit"/>
            </form>
            <!-- Icon made by https://www.flaticon.com/authors/muhammad-ali -->
            <button id="feedbackButton" title="Submit with feedback" :disabled="!submitEnabled()" @click="showFeedbackModal = true" class="r6o-btn">
                <img src="../assets/feedback.png" alt="Feedback"/>
            </button>
            <transition name="modal">
                <feedback-popup v-if="showFeedbackModal" @close="showFeedbackModal=false" @submit="submitForm()">
                </feedback-popup>
            </transition>
            <transition name="modal">
                <yes-no-modal v-if="showYesNoModal" @close="showYesNoModal=false" @submit="submitForm()">
                </yes-no-modal>
            </transition>
        </span>
    </span>
</template>

<script lang="ts">
import AnnotationStore from '@/services/annotationStore';
import FeedbackPopup from './FeedbackPopup.vue';
import { Options, Vue } from "vue-class-component";
import { Prop } from 'vue-property-decorator';
import TutorialTooltip from './TutorialTooltip.vue';
import YesNoModal from './YesNoModal.vue';

@Options({
    components: {
        FeedbackPopup,
        TutorialTooltip,
        YesNoModal
    }
})
export default class AppHeader extends Vue {
    @Prop()
    private annotationStore: AnnotationStore;
    @Prop()
    private isTutorialVisible: boolean;
    @Prop()
    private isImageLoaded: boolean;
    @Prop()
    private assignment: any;
    @Prop()
    private assignmentUrl: string;
    @Prop()
    private assignmentId: string;

    private counter = 0;
    private urlParams = new URLSearchParams(window.location.search);
    // Injected from package.json
    private appVersion = process.env.VUE_APP_VERSION;
    private majorVersion = this.appVersion.match(/\d+/)[0];
    private SEEN_TUTORIAL_KEY = `${this.majorVersion}_seenTutorial`;
    private ACCEPTED_NO_REF_KEY = `${this.majorVersion}_acceptedNoRef`;
    
    // Placeholder value for the MTurk submit link
    private submitLink = 'https://webhook.site/9c353bcf-91aa-4d88-96f3-93c351b9562f';
    // Parsed from query params, if it exists
    private comment = '';
    private csrfToken = null;
    private acceptEmpty: boolean = false;
    private acceptOrphans: boolean = false;
    private showFeedbackModal = false;
    private showYesNoModal = false;

    // Saved in local storage
    private tutorialSeen = false;
    private acceptedNoRef = false;

    private submit(e: Event) {
        if (this.acceptOrphans && !this.acceptedNoRef) {
            this.showYesNoModal = true;
            e.preventDefault();
        }
        
    }

    mounted() {
        // Start counter
        setInterval(() => {
            this.counter++
        }, 1000)

        // Get version
        console.log(`App version: ${this.appVersion}`);

        //if (this.assignmentId == 'ASSIGNMENT_ID_NOT_AVAILABLE') this.$emit('toggle-tutorial');
        this.tutorialSeen = !!localStorage.getItem(this.SEEN_TUTORIAL_KEY);

        // Get submit link from URL params
        if (this.assignmentUrl) {
            this.submitLink = this.assignmentUrl;
            this.assignmentId = 'ADMIN_ASSIGNMENT';
        } 
        let submitParam = this.urlParams.get('turkSubmitTo');
        if (submitParam) {
            this.submitLink = submitParam + '/mturk/externalSubmit';
        }

        let commentParam = this.urlParams.get('comment');
        if (commentParam) this.comment = commentParam;

        let csrfParam = this.urlParams.get('csrf_token');
        if (csrfParam) {
            console.log('Loaded CSRF!');
            this.csrfToken = csrfParam;
        }

        this.acceptedNoRef = !!localStorage.getItem(this.ACCEPTED_NO_REF_KEY);
    }

    annotationsEmpty() {
        return this.annotationStore.annotations.length == 0;
    }

    orphansOrChildless() {
        return this.annotationStore.nrOrphans != 0 || this.annotationStore.freeParents.length != 0;
    }

    submitEnabled() {
        return this.assignmentId != 'ASSIGNMENT_ID_NOT_AVAILABLE' 
        && this.isImageLoaded
        && (!this.annotationsEmpty() || this.acceptEmpty)
        && (!this.orphansOrChildless() || this.acceptOrphans);
    }

    submitForm() {
        if (this.acceptOrphans) {
            this.acceptedNoRef = true;
            localStorage.setItem(this.ACCEPTED_NO_REF_KEY, 'true');
        }
        (this.$refs.submitButton as any).click();
    }

    toggleTutorial() {
        this.$emit('toggle-tutorial');
        localStorage.setItem(this.SEEN_TUTORIAL_KEY, 'true');
        this.tutorialSeen = true;
    }
}

</script>

<style scoped>
    .header-container {
        display: flex;
        margin: 0;
        border: white;
        border-style: solid;
        border-width: 2px 0px 2px 0px;
        height: 2em;
        padding: 0 4px 0 0;
        position: relative;
    }

    .left-header {
        flex-grow: 1;
        flex-shrink: 10;
        overflow: hidden;
    }

    .header-container span * {
        display: inline-block;
        margin-left: 4px;
        vertical-align: middle;
    }

    .right-header {
        display: flex;
        vertical-align: middle;
        height: 100%;
        flex-grow: 1;
        justify-content: flex-end;
        flex-shrink: 0;
    }

    input[type=checkbox]{
        height: auto;
    }

    img {
        margin: 0;
        padding: 0;
        height: 80%;
        filter: brightness(0) invert(1);
    }

    #feedbackButton {
        border-left: hidden;
        padding: 0 2px 2px 0;
        margin-left: 0;
        border-radius: 0 5px 5px 0;
        height: 100%;
        min-width: 0;
        border-left: 1px solid rgb(110, 171, 233)
    }

    #submitButton {
        border-radius: 5px 0 0 5px;
        height: 100%;
        vertical-align: top;   
        -webkit-box-shadow: 0px 0px 3px 0px rgba(0,0,0,0.2); 
        box-shadow: 0px 0px 3px 0px rgba(0,0,0,0.2);
    }

    form {
        height: 100%;
    }

    .not-seen {
        box-shadow: 0 0 0 rgba(163,193,225, 0.4);
        animation: pulse 1s infinite;
    }

    .text-checkbox {
        margin: auto 0;
    }

    @keyframes pulse {
        0% {
            -moz-box-shadow: 0 0 0 0 rgba(163,193,225, 0.9);
            box-shadow: 0 0 0 0 rgba(163,193,225, 0.9);
            background-color: rgba(163,193,225, 0.9);
        }
        40% {
            background-color: rgba(163,193,225, 0.2);
        }
        90% {
            -moz-box-shadow: 0 0 10px 30px rgba(163,193,225, 0);
            box-shadow: 0 0 10px 30px rgba(163,193,225, 0);
            background-color: rgba(163,193,225, 0);
            
        }
        100% {
            -moz-box-shadow: 0 0 0 0 rgba(163,193,225, 0);
            box-shadow: 0 0 0 0 rgba(163,193,225, 0);
            background-color: rgba(163,193,225, 0);
        }
    }

</style>