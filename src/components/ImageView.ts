let OpenSeadragon = require('openseadragon');
let Annotorious = require('@recogito/annotorious-openseadragon');
import '@recogito/annotorious-openseadragon/dist/annotorious.min.css';
import FigCapWidget from '../widgets/figure-caption';
import { Options, Vue } from "vue-class-component";
import AnnotationStore from '@/services/annotationStore';


@Options({
    props: {
        annotationStore: AnnotationStore
    }
})
export default class ImageView extends Vue {
    private annotationStore!: AnnotationStore;
    private anno;
    private imLoaded = false;

    mounted() {

        let viewer = OpenSeadragon({
            id: 'imview',
            tileSources: {
                type: 'image',
                url: 'https://upload.wikimedia.org/wikipedia/commons/d/da/The_City_London.jpg',
                success: () => {
                    this.imLoaded = true;
                }
            },
            showNavigator: true,
            zoomPerSecond: 0,
            imageSmoothingEnabled: false,
            animationTime: 0,
            navigatorPosition: 'BOTTOM_RIGHT',
            maxZoomLevel: 10,
            showZoomControl: false,
            showFullPageControl: false,
            showHomeControl: false
        });

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
        this.anno.setVisible(true)

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
    }

    /**
     * Refresh the annotations shown on screen
     */
    reRenderAnnotations() {
        this.anno.setAnnotations(this.anno.getAnnotations());
    }
}