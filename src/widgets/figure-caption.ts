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
        //console.log('Args: ' + JSON.stringify(args));

        let bodies: AnnoBody[] = args.annotation.bodies;
        let classBody = bodies.find(bod => bod.purpose == classPurpose)
        let parentBody = bodies.find(bod => bod.purpose == parentPurpose);
        let currentClass = classBody?.value;
        let currentParent = parentBody?.value;
        let friendlyName = this.annotationStore.getFriendlyName(args.annotation.id);

        var setClass = function (evt: any) {
            if (currentClass) {
                args.onUpdateBody(classBody, {
                    type: 'TextualBody',
                    purpose: classPurpose,
                    value: evt.target.dataset.tag
                });
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
                args.onUpdateBody(parentBody, {
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
        container.id = 'fig-cap-widget';
        // TODO: Find a workaround for capturing keyboard events:
        // https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/tabindex
        container.tabIndex = 1;
        let allowedShortcutKeys = ['Digit1', 'Digit2', 'Digit3']

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

        let container2 = document.createElement('div');
        if (currentClass == 'Caption') {
            let parentSelectionContainer = document.createElement('div');
            parentSelectionContainer.className = "parent-selection-container";
            
            let parentSelectionTextBox = document.createElement('span');
            let referencesLabel = document.createElement('span');
            referencesLabel.textContent = 'References: ';
            let currParentLabel = document.createElement('span');
            if(currentParent){
                currParentLabel.textContent = this.annotationStore.getFriendlyName(currentParent);
            } 
            
            parentSelectionTextBox.style.paddingLeft = '4px'
            parentSelectionTextBox.appendChild(referencesLabel);
            parentSelectionTextBox.appendChild(currParentLabel);

            parentSelectionContainer.appendChild(parentSelectionTextBox);
            container2.id = 'container2'
            container2.className = 'fig-cap-widget';
            parentSelectionContainer.appendChild(container2);
            // Make a copy of the array
            let potentialParentIDs = [...this.annotationStore.getFreeParentIds()];
            for (const potentialParentId of potentialParentIDs) {
                let newButton = createButton(
                    this.annotationStore.getFriendlyName(potentialParentId),
                    potentialParentId,
                    'parent'
                );
                container2.append(newButton);

            }

            if(potentialParentIDs.length || currentParent){
                root.appendChild(parentSelectionContainer);
                allowedShortcutKeys = allowedShortcutKeys.concat(['KeyQ', 'KeyW', 'KeyE']);
            } 
        }

        // Handle shortcut keys
        root.addEventListener('keydown', (evt) => {
            let key = evt.code;

            if(allowedShortcutKeys.indexOf(key) != -1) {
                let focusedKey: HTMLButtonElement;
                // Not used currently, see https://github.com/recogito/annotorious/issues/185
                let finalSelection = false;

                switch(key) {
                    case 'Digit1':
                        focusedKey = button1;
                        finalSelection = !!container2.childNodes;
                        break;
                    case 'Digit2':
                        focusedKey = button2;
                        finalSelection = !container2.childNodes;
                        break;
                    case 'Digit3':
                        focusedKey = button3;
                        finalSelection = !container2.childNodes;
                        break;
                    case 'KeyQ':
                        focusedKey = container2.childNodes[0] as HTMLButtonElement;
                        finalSelection = true;
                        break;
                    case 'KeyW':
                        focusedKey = container2.childNodes[1] as HTMLButtonElement;
                        finalSelection = true;
                        break;
                    case 'KeyE':
                        focusedKey = container2.childNodes[2] as HTMLButtonElement;
                        finalSelection = true;
                        break;
                    default:
                        console.log(`Error: Invalid shortcut caught ${key}`);
                        break;
                }

                if (focusedKey) {
                    focusedKey.click();
                }
            }
            
        });

        return root;
    }

    private htmlToElement(html: string) {
        var template = document.createElement('template');
        html = html.trim(); // Never return a text node of whitespace as the result
        template.innerHTML = html;
        return template.content.firstChild;
    }

    public figCapFormatter = (annotation: {underlying: Annotation}) => {
        //console.log('Formatter called with: ' + JSON.stringify(annotation))
        let underlying = annotation.underlying;
        let svg = this.htmlToElement(rawAnnotationOverlay);
        if(underlying.body.length != 0) {
            let friendlyName = this.annotationStore.getFriendlyName(underlying.id);

            if(!friendlyName) {
                friendlyName = this.annotationStore.generateFriendlyName(
                    this.annotationStore.getAnnotationClass(underlying)
                );
            }
            svg.childNodes[svg.childNodes.length -4].textContent = friendlyName;
        }

        let annoClass = this.annotationStore.getAnnotationClass(underlying) ?? '';

        if(annoClass) {
            if (this.annotationStore.childTypes.indexOf(annoClass) != -1) {
                let parent = this.annotationStore.getAnnotationParentId(underlying);
                if(!parent) {
                    svg.childNodes[svg.childNodes.length -2].textContent = 'Parentless';
                }
            } else if (this.annotationStore.parentTypes.indexOf(annoClass) != -1) {
                let isFree = this.annotationStore.getFreeParentIds().indexOf(underlying.id) != -1;
                if (isFree) {
                    svg.childNodes[svg.childNodes.length -2].textContent = 'Childless';
                }
            }
        }
        

        return {
            className: annoClass,
            element: svg
        }
    }

}


