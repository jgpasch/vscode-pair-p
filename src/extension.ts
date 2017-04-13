'use strict';

import * as vscode from 'vscode';
import axios from 'axios'
import * as fileService from './http/httpRequests';
import socketSetup from './sockets/socketSetup';
import dmp from 'diff-match-patch';

export function activate(context: vscode.ExtensionContext) {

    /* Command to upload a file to the remote server.
     * Does not connect - only upload */
    let uploadFile = vscode.commands.registerCommand('extension.uploadFile', () => {

        const fileContents = vscode.window.activeTextEditor.document.getText();
        const lang = vscode.window.activeTextEditor.document.languageId;

        // http request to upload file, then get file uuid
        fileService.uploadFile(fileContents, lang)
        .then((res) => {
            const value = res.data.fileUUID;
            const message = `Your file has been uploaded! Your file ID is: ${value}`;
            vscode.window.showInformationMessage(message);
        });
    });


    /* Command to upload a file to the remote server AND connect via sockets
     * AND connect via sockets */
    let uploadAndConnect = vscode.commands.registerCommand('extension.uploadAndConnect', () => {
        vscode.commands.executeCommand('extension.uploadFile')
        .then(() => {
            var socket = require('socket.io-client')('http://localhost:8000');
            socketSetup(socket, vscode);
        });
    });

    let setJS = vscode.commands.registerCommand('extension.setJS', () => {

    });



    let downloadFile = vscode.commands.registerCommand('extension.downloadFile', () => {
        // ask user for the file ID
        vscode.window.showInputBox({prompt: "Enter the ID of the file you want to connect to"}).then((userInput) => {
            fileService.downloadFile(userInput)
            .then((res) => {
                const message = `you downloaded file with ID: ${res.data}`;
                vscode.window.showInformationMessage(message);
            });
        });
    });

    // register the socketConnect command
    let socketConnect = vscode.commands.registerCommand('extension.socketConnect', () => {
        var socket = require('socket.io-client')('http://localhost:8000');
        socketSetup(socket, vscode);
    });

    // get selection command
    let getSelection = vscode.commands.registerCommand('extension.getSelection', () => {
        const editor = vscode.window.activeTextEditor;
        const line = editor.selection.active.line;
        const char = editor.selection.active.character;

        const str = `cursor at line: ${line} and position: ${char}`;
        return {
            line,
            char
        };
    });

    context.subscriptions.push(uploadFile);
    context.subscriptions.push(downloadFile);
    context.subscriptions.push(socketConnect);
    context.subscriptions.push(getSelection);
}

function diffToText(diff) {
    const patch = dmp.patch_make(diff);
    const newText = dmp.patch_toText(patch);
    return newText;
}

// this method is called when your extension is deactivated
export function deactivate() {
}
