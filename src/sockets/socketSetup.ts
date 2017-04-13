export default function(socket, vscode) {

    /*
    """
    CONNECT socket event
    """
    */
    socket.on('connect', () => {
        vscode.window.showInputBox({ prompt: "please enter file ID" })
        .then((userInput) => {
            vscode.window.showInformationMessage(`Receiving file ${userInput}'s contents`);
            socket.emit('join', { file_uuid: userInput });
        });
    });

    /*
    """
    DISCONNECT socket event
    """
    */
    socket.on('disconnect', () => {
        socket.destroy();
        vscode.window.showInformationMessage("Socket connection lost, please reconnect");
    });

    /*
    """
    FILE_CONTENTS socket event
    """
    */
    socket.on('fileContents', (data) => {
        const coords = {
            start: {
                line: 0,
                char: 0
            },
            end: {
                line: 999,
                char: 0
            }
        };

        // vscode.window.showInformationMessage()
        vscode.workspace.openTextDocument({ content: data.fileContents, language: 'javascript' })
        .then((document) => {
            // const text = document.getText();
            // vscode.window.showInformationMessage(text);
            vscode.window.showTextDocument(document);
        });

        // applyEdit(vscode.window.activeTextEditor, coords, data.fileContents);
    });

    function applyEdit (vsEditor, coords, content){
        var vsDocument = getDocument(vsEditor);
        var edit = setEditFactory(vsDocument._uri, coords, content);
        vscode.workspace.applyEdit(edit);
    }

    function getDocument (vsEditor) {
        return typeof vsEditor._documentData !== 'undefined' ? vsEditor._documentData : vsEditor._document
    }

    function positionFactory(line, char) {
        return new vscode.Position(line, char);
    }

    function rangeFactory(start, end) {
        return new vscode.Range(start, end);
    }

    function textEditFactory(range, content) {
        return new vscode.TextEdit(range, content);
    }

    function editFactory (coords, content){
        var start = positionFactory(coords.start.line, coords.start.char);
        var end = positionFactory(coords.end.line, coords.end.char);
        var range = rangeFactory(start, end);

        return textEditFactory(range, content);
    }

    function setEditFactory(uri, coords, content) {
        var workspaceEdit = workspaceEditFactory();
        var edit = editFactory(coords, content);

        workspaceEdit.set(uri, [edit]);
        return workspaceEdit;
    }

    function workspaceEditFactory() {
        return new vscode.WorkspaceEdit();
    }
}

