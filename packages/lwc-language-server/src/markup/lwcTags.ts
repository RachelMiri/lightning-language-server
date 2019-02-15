import { IHTMLTagProvider } from 'lightning-lsp-common';
import { TagInfo, AttributeInfo } from 'lightning-lsp-common';
import { getLwcTags, getLwcByTag } from '../metadata-utils/custom-components-util';
// import { ClassMember } from '@lwc/babel-plugin-component';

const LWC_DIRECTIVE = 'LWC directive';

const LWC_DIRECTIVES: AttributeInfo[] = [
    new AttributeInfo(
        'for:each',
        'Renders the element or template block multiple times based on the expression value.',
        'expression binding',
        undefined,
        LWC_DIRECTIVE,
    ),
    new AttributeInfo('for:item', 'Bind the current iteration item to an identifier.', 'expression binding', undefined, LWC_DIRECTIVE),
    new AttributeInfo('for:index', 'Bind the current iteration index to an identifier.', 'expression binding', undefined, LWC_DIRECTIVE),
    new AttributeInfo('if:true', 'Renders the element or template if the expression value is thruthy.', 'expression binding', undefined, LWC_DIRECTIVE),
    new AttributeInfo('if:false', 'Renders the element or template if the expression value is falsy.', 'expression binding', undefined, LWC_DIRECTIVE),
];

export function getDirectiveInfo(label: string): AttributeInfo | null {
    for (const info of LWC_DIRECTIVES) {
        if (label === info.name) {
            return info;
        }
    }
    return null;
}

export function getLwcTagProvider(): IHTMLTagProvider {
    function addTags(collector: (tag: string, label: string, info: TagInfo) => void) {
        for (const [tag, tagInfo] of getLwcTags()) {
            collector(tag, tagInfo.name, tagInfo);
        }
    }

    function addAttributes(tag: string, collector: (attribute: string, info: AttributeInfo, type: string) => void) {
        const cTag = getLwcByTag(tag);
        if (cTag) {
            cTag.attributes.map((info: AttributeInfo) => {
                collector(info.name, info, '');
            });
        }
    }

    // function addExpressions(templateTag: string, collector: (attribute: string, info: AttributeInfo, type: string) => void) {
    //     const cTag = getLwcByTag(templateTag);
    //     if (cTag) {
    //         cTag.properties.forEach((metadata: ClassMember) => {
    //             collector(metadata.name, null, null);
    //         });
    //         cTag.methods.forEach((metadata: ClassMember) => {
    //             collector(metadata.name, null, null);
    //         });
    //     }
    // }

    function addDirectives(collector: (attribute: string, info: AttributeInfo, type: string) => void) {
        LWC_DIRECTIVES.map(info => {
            collector(info.name, info, null);
        });
    }

    return {
        getId: () => 'lwc',
        isApplicable: languageId => languageId === 'html',
        collectTags: (collector: (tag: string, label: string, info: TagInfo) => void) => {
            addTags(collector);
        },
        collectAttributes: (tag: string, collector: (attribute: string, info: AttributeInfo, type: string) => void) => {
            addDirectives(collector);
            if (tag) {
                addAttributes(tag, collector);
            }
        },
        collectValues: (/*tag: string, attribute: string, collector: (value: string) => void*/) => {
            // TODO provide suggestions by consulting shapeService
        },
        // TODO
        // collectExpressionValues: (templateTag: string, collector: (value: string) => void): void => {
        //     addExpressions(templateTag, collector);
        // },
        // TODO don't remember what this did
        // getTagInfo: (tag: string) => getLwcByTag(tag),
    };
}
