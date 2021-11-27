let OpenSeadragon = require('openseadragon');
let Annotorious = require('@recogito/annotorious-openseadragon');
let placeholderPic = require('../assets/96d834586a304382bd623f81b83e3b62-09.png');
import '@recogito/annotorious-openseadragon/dist/annotorious.min.css';
import FigCapWidget from '../widgets/figure-caption';
import { Options, Vue } from "vue-class-component";
import AnnotationStore from '@/services/annotationStore';
import Answer from '../models/Answer';
import ScrollEdges from './ScrollEdges.vue';


@Options({
    props: {
        annotationStore: AnnotationStore,
        answer: Answer
    },
    components: {
        ScrollEdges
    }
})
export default class ImageView extends Vue {
    private annotationStore!: AnnotationStore;
    private answer: Answer;
    private anno;
    private imLoaded = false;
    private pointerActive = false;
    // Used to update crosshair guide locations
    private hLineY = 50;
    private vLineX = 50;
    private imView: Element;
    private urlParams = new URLSearchParams(window.location.search);
    private widgetFocusObserver = new MutationObserver(this.focusWidget);

    private handleEditorOpen = (mutationsList, observer) => {
        if(mutationsList && mutationsList[0].addedNodes.length) {
            let widget = document.getElementById('fig-cap-widget');
            widget.focus();

            let widgetFrame = document.getElementsByClassName('r6o-editor')[0];
            // Creates a change listener on the widget to keep it in focus
            this.widgetFocusObserver.observe(widgetFrame, {attributes: true, childList: false});
        }
    }

    private focusWidget(mutationsList, observer) {
        let widget = document.getElementById('fig-cap-widget');
            widget.focus();
    }

    private widgetOpenObserver = new MutationObserver(this.handleEditorOpen);

    mounted() {
        this.imView = this.$refs.imview as Element;

        let imageUrl = this.urlParams.get('image') ?? placeholderPic;
        // Reference: https://openseadragon.github.io/docs/OpenSeadragon.html
        let viewer = OpenSeadragon({
            id: 'imview',
            tileSources: {
                type: 'image',
                url: imageUrl,
                success: (obj) => {
                    this.imLoaded = true;
                    this.annotationStore.canvasHeight = obj.tileSource.height;
                    this.annotationStore.canvasWidth = obj.tileSource.width;
                    this.$emit('image-loaded');
                }
            },
            showNavigator: true,
            zoomPerSecond: 0,
            imageSmoothingEnabled: false,
            animationTime: 0,
            navigatorPosition: 'BOTTOM_RIGHT',
            maxZoomLevel: 10,
            minZoomImageRatio: 0.5,
            showZoomControl: false,
            showFullPageControl: false,
            showHomeControl: false,
            navigatorSizeRatio: 0.15,
            gestureSettingsMouse: {
                clickToZoom: false
            }
        });

        viewer.addHandler('open-failed', () => {
            this.imLoaded = true;
        })

        let figCapWidget = new FigCapWidget(this.annotationStore);
        let figCapWidgetFunc = figCapWidget.figCapWidget;

        let annoConfig = {
            widgets: [
                {widget: figCapWidgetFunc, force: 'plainjs'}
            ],
            formatter: figCapWidget.figCapFormatter
        }
        this.anno = Annotorious(viewer, annoConfig);
        this.anno.setDrawingTool('rect');
        this.anno.setVisible(true);

        this.widgetOpenObserver.observe(this.imView.childNodes[4], {attributes: false, childList: true});

        this.anno.on('createAnnotation', (annot) => {
            this.annotationStore.addAnnotation(annot);
            this.reRenderAnnotations();
        });

        this.anno.on('deleteAnnotation', (annot) => {
            this.annotationStore.removeAnnotation(annot);
            this.reRenderAnnotations();
        });

        this.anno.on('updateAnnotation', (annot, oldAnnot) => {
            this.annotationStore.updateAnnotation(annot);
            this.reRenderAnnotations();
        });

        if (this.answer) {
            for (const annotation of this.answer.annotations) {
                this.annotationStore.addAnnotation(annotation);
            }
            this.reRenderAnnotations();
        }

        document.addEventListener('keydown', (event: KeyboardEvent) => {
            if(event.key == 'Shift') {
                this.pointerActive = true;
                document.addEventListener('mousemove', this.updateGuideLocation);
            } else if (event.code == 'Space') {
                let widgetFooterArray = document.getElementsByClassName('r6o-footer');
                if (widgetFooterArray.length) {
                    // The number of buttons changes - always get the last one
                    let lastIndex = widgetFooterArray[0].childNodes.length - 1;
                    let okButton = widgetFooterArray[0].childNodes[lastIndex] as HTMLButtonElement;
                    okButton.click();
                }
                viewer.viewport.panBy(new OpenSeadragon.Point(0.1,0.2)); 
            }
        });

        document.addEventListener('keyup', (event: KeyboardEvent) => {
            if(event.key == 'Shift') {
                this.pointerActive = false;
                document.removeEventListener('mousemove', this.updateGuideLocation);
            }
        });

        //(document.getElementById('contentDiv').querySelector('.openseadragon-canvas') as any).focus();
    }

    /**
     * Refresh the annotations shown on screen
     */
    reRenderAnnotations() {
        this.anno.setAnnotations(this.annotationStore.annotations);
    }

    private updateGuideLocation(e) {
        // @ts-ignore
        var rect = this.imView.getBoundingClientRect();
        this.vLineX = Math.max(e.clientX-2 - rect.left, 0);
        this.hLineY = Math.max(e.clientY-2 - rect.top, 0);
    }
}