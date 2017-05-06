import editHelpers from '../util/editHelpers';

export default function(socket, vscode, file_uuid) {
    const edits = editHelpers(vscode);
    console.log('inside soket setup');

    /*
    """
    CONNECT socket event
    """
    */
    socket.on('connect', () => {
        console.log('connection');
        socket.emit('join', { file_uuid });
    });


    /*
    """
    DISCONNECT socket event
    """
    */
    socket.on('disconnect', () => {
        socket.emit('leave', { file_uuid });
        socket.destroy();
        vscode.window.showInformationMessage("Socket connection lost, please reconnect");
    });


    /*
    """
    FILE_RECEIVED socket event
    @SOCKET - DATA: file_contents, file_uuid
    """
    */
    socket.on('file_received', (data) => {
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

        // UNCOMMENT these lines to open in new text document.
        // vscode.workspace.openTextDocument({ content: data.file_contents, language: 'typescript' })
        // .then((document) => {
        //     vscode.window.showTextDocument(document);
        // });

        edits.applyEdit(vscode.window.activeTextEditor, coords, data.file_contents);

    });
}

