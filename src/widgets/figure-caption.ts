import rawAnnotationOverlay from '!!raw-loader!../assets/annotation-overlay.svg';
import AnnotationStore from '@/services/annotationStore';
import { Annotation, classPurpose, parentPurpose } from '../services/annotationStore';

export type AnnoBody = {
    "type": string,
    "value": string,
    "purpose": string
}

export default class FigCapWidget {

    constructor(
        private annotationStore: AnnotationStore
    ) { }

    public figCapWidget = (args: any) => {
        console.log('Args: ' + JSON.stringify(args));

        let bodies: AnnoBody[] = args.annotation.bodies;
        let classBody = bodies.find(bod => bod.purpose == classPurpose)
        let parentBody = bodies.find(bod => bod.purpose == parentPurpose);
        let currentClass = classBody?.value;
        let currentParent = parentBody?.value;
        let friendlyName = this.annotationStore.getFriendlyName(args.annotation.id);

        var setClass = function (evt: any) {
            if (currentClass) {
                classBody.value = evt.target.dataset.tag;
                args.onUpdateBody(currentClass, {
                    type: 'TextualBody',
                    purpose: classPurpose,
                    value: evt.target.dataset.tag
                });
                console.log(classBody)
            } else {
                args.onAppendBody({
                    type: 'TextualBody',
                    purpose: classPurpose,
                    value: evt.target.dataset.tag
                });
            }
        }

        var setParent = function (evt: any) {
            if (currentParent) {
                parentBody.value = evt.target.dataset.tag;
                args.onUpdateBody(currentParent, {
                    type: 'TextualBody',
                    purpose: parentPurpose,
                    value: evt.target.dataset.tag
                });
            } else {
                args.onAppendBody({
                    type: 'TextualBody',
                    purpose: parentPurpose,
                    value: evt.target.dataset.tag
                });
            }
        }

        var createButton = function (label: string, tag: string, type: 'class' | 'parent') {
            var button = document.createElement('button');
            let current = type == 'class' ? currentClass : currentParent;

            if (tag == current)
                button.className = 'selected';

            button.dataset.tag = tag;
            //button.style.backgroundColor = value;
            let callBack = type == 'class' ? setClass : setParent;
            button.addEventListener('click', callBack);
            button.textContent = label;
            return button;
        }

        var root = document.createElement('div');
        var container = document.createElement('div');
        root.appendChild(container);
        container.className = 'fig-cap-widget';

        // Disallow changing of annotation classes
        if(!currentClass || !friendlyName) {
            var button1 = createButton('Figure', 'Figure', 'class');
            var button2 = createButton('Table', 'Table', 'class');
            var button3 = createButton('Caption', 'Caption', 'class');

            container.appendChild(button1);
            container.appendChild(button2);
            container.appendChild(button3);
        } else {
            let classText = document.createElement('span');
            classText.textContent = friendlyName;
            container.appendChild(classText);
        }

        if (currentClass == 'Caption') {
            let container3 = document.createElement('div');
            container3.className = 'fig-cap-widget'
            let container3Text = document.createElement('div');
            container3Text.textContent = 'References:';
            container3Text.style.paddingLeft = '4px'
            container3.appendChild(container3Text);
            let container2 = document.createElement('span');
            container2.id = 'container2'
            container3.appendChild(container2);
            // Make a copy of the array
            let potentialParentIDs = [...this.annotationStore.getFreeParentIds()];
            // Show the current parent button only on the child widget
            if (currentParent && potentialParentIDs.indexOf(currentParent) == -1) {
                potentialParentIDs.unshift(currentParent);
            }
            for (const potentialParentId of potentialParentIDs) {
                let newButton = createButton(
                    this.annotationStore.getFriendlyName(potentialParentId),
                    potentialParentId,
                    'parent'
                );
                container2.append(newButton);

            }

            if(potentialParentIDs.length != 0) root.appendChild(container3);
        }

        return root;
    }

    private htmlToElement(html: string) {
        var template = document.createElement('template');
        html = html.trim(); // Never return a text node of whitespace as the result
        template.innerHTML = html;
        return template.content.firstChild;
    }

    public figCapFormatter = (annotation: Annotation) => {
        let svg = this.htmlToElement(rawAnnotationOverlay);
        if(annotation.body.length != 0) {
            let friendlyName = this.annotationStore.getFriendlyName(annotation.id);

            if(!friendlyName) {
                friendlyName = this.annotationStore.generateFriendlyName(
                    this.annotationStore.getAnnotationClass(annotation)
                );
            }
            svg.childNodes[svg.childNodes.length -4].textContent = friendlyName;
            svg.childNodes[svg.childNodes.length -2].textContent = 'Childless';
        }

        let annoClass = this.annotationStore.getAnnotationClass(annotation) ?? '';

        return {
            className: annoClass,
            element: svg
        }
    }

}


