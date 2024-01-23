import Table from '@tiptap/extension-table';

export default Table.extend({
  // transformer-only : parse old-format "templates" as tables
  addAttributes() {
    return {
      template: {
        default: null,
      },
    };
  },
  parseHTML() {
    return this.parent?.()?.concat([
      {
        tag: 'div.row',
        getAttrs: (el) => {
          // Check if columns are present. If not, ignore the template attribute.
          if (!el || typeof el === 'string') return false;
          const columns = el.querySelectorAll('.column.cell');
          if (!columns || columns.length <= 0) return false;
          // Otherwise, determine columns width.
          const template = [];
          for (let i = 0; i < columns.length; i++) {
            const column = columns[i];
            if (column.classList.contains('image-template')) {
              template.push('30%');
              template.push('70%');
              break;
            }
            if (column.classList.contains('three')) {
              template.push('25%');
            } else if (column.classList.contains('four')) {
              template.push('33.33%');
            } else if (column.classList.contains('six')) {
              template.push('50%');
            } else if (column.classList.contains('eight')) {
              template.push('66.66%');
            } else if (column.classList.contains('nine')) {
              template.push('75%');
            } else {
              template.push('');
            }
          }
          return {
            template,
          };
        },
      },
    ]);
  },
  renderHTML(props) {
    //FIXME This code is too tightened to its parent's implementation
    const output = this.parent?.(props) as unknown as Array<
      // eslint-disable-next-line @typescript-eslint/ban-types
      string | Object | 0
    >;
    const columnsWidth: string[] | undefined | null =
      props.HTMLAttributes['template'];
    if (!columnsWidth || columnsWidth.length <= 0) return output;
    const columns = columnsWidth.map((width) => ['col', { width: width }]);
    return [
      output[0],
      output[1],
      ['colgroup', {}].concat(columns),
      ['tbody', 0],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ] as any;
  },
});
