import Highlight from '@tiptap/extension-highlight';

export default Highlight.extend({
    addOptions() {
      return {
        multicolor: true,   // Activate multicolor
        HTMLAttributes: {},
      }
    },

    // Overriden just to remove the parsing of the color attribute.
    // Because we must manage it differently in parseHTML().
    addAttributes() {
        const parent = this.parent?.() as any;
        parent?.color.parseHTML && delete parent.color.parseHTML;
        return parent;
    },

    parseHTML() {
      return [
        {
          tag: 'mark',
          getAttrs: (element) => {
            if( typeof element === "string" ) return false;
            const color = element.getAttribute('data-color') || element.style.backgroundColor;
            return color.length ? {color} : false;
          }
        },
        {
          tag: 'span[style*=background-color]',
          getAttrs: (element) => {
            if( typeof element === "string" ) return false;
            return element.style.backgroundColor.length ? {color: element.style.backgroundColor} : false;
          }
        },
      ]
    },
  })