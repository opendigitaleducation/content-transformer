import { TableCell } from '@edifice-tiptap-extensions/extension-table-cell';

export default TableCell.extend({
    // transformer-only : parse old-format "cell column" as cells
    parseHTML() {
        return this.parent?.()?.concat([
            { tag: '.cell.column' },
        ])
    },
});
