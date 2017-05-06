'use strict';

import * as vscode from 'vscode';
import axios from 'axios'
import { serverSettings } from './config/server';
import * as fileService from './http/httpRequests';
import socketSetup from './sockets/socketSetup';
const DiffMatchPatch = require('diff-match-patch');

export function activate(context: vscode.ExtensionContext) {

    console.log('activating');
    let oldText = '';
    let socketio;
    const dmp = new DiffMatchPatch();

    /* Command to upload a file to the remote server.
     * Does not connect - only upload */
    let uploadFile = vscode.commands.registerCommand('extension.uploadConnectFile', () => {
        const file_contents = vscode.window.activeTextEditor.document.getText();
        oldText = file_contents;
        // http request to upload file, then get file uuid
        fileService.uploadFile(file_contents)
        .then((res) => {
            const file_uuid = res.data.file_uuid;
            const message = `Your file has been uploaded! Your file ID is: ${file_uuid}`;
            vscode.window.showInformationMessage(message);
            socketio = require('socket.io-client')(serverSettings.url);
            socketSetup(socketio, vscode, file_uuid);
            setupDiffWatch();
        });
    });


    let connect = vscode.commands.registerCommand('extension.connect', () => {
        // ask user for the file ID
        vscode.window.showInputBox({prompt: "Enter the ID of the file you want to download"}).then((file_uuid) => {
            socketio = require('socket.io-client')(serverSettings.url);
            socketSetup(socketio, vscode, file_uuid);
            setupDiffWatch();
        });
    });

    // register the socketConnect command
    // let connect = vscode.commands.registerCommand('extension.connect', () => {
    //     var socket = require('socket.io-client')('http://localhost:8000');
    // });

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

    function setupDiffWatch() {
        // SETUP to watch for changes in text document.
        vscode.workspace.onDidChangeTextDocument((changeEvent) => {
            const diff = diffFromTexts(dmp, oldText, changeEvent.document.getText());
            socketio.emit('diff', { diff });
        });
    }


    context.subscriptions.push(uploadFile);
    context.subscriptions.push(connect);
    context.subscriptions.push(getSelection);
}

function diffToText(dmp, diff) {
    const patch = dmp.patch_make(diff);
    const newText = dmp.patch_toText(patch);
    return newText;
}

function diffFromTexts(dmp, oldText, newText) {
    console.log('am i even working?');
    const diffs = dmp.diff_main(oldText, newText);
    console.log(diffs);
    return diffs;
}

// this method is called when your extension is deactivated
export function deactivate() {
}
