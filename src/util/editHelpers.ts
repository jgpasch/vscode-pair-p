export default function(vscode) {
    this.applyEdit = (vsEditor, coords, content) => {
        var vsDocument = this.getDocument(vsEditor);
        var edit = this.setEditFactory(vsDocument._uri, coords, content);
        vscode.workspace.applyEdit(edit);
    }

    this.getDocument = (vsEditor) => {
        return typeof vsEditor._documentData !== 'undefined' ? vsEditor._documentData : vsEditor._document
    }

    this.positionFactory = (line, char) => {
        return new vscode.Position(line, char);
    }

    this.rangeFactory = (start, end) => {
        return new vscode.Range(start, end);
    }

    this.textEditFactory = (range, content) => {
        return new vscode.TextEdit(range, content);
    }

    this.editFactory = (coords, content) => {
        var start = this.positionFactory(coords.start.line, coords.start.char);
        var end = this.positionFactory(coords.end.line, coords.end.char);
        var range = this.rangeFactory(start, end);

        return this.textEditFactory(range, content);
    }

    this.setEditFactory = (uri, coords, content) => {
        var edit = this.editFactory(coords, content);
        return new vscode.WorkspaceEdit(uri, [edit]);
    }

    return this;
}

