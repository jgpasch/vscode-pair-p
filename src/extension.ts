'use strict';

import * as vscode from 'vscode';
import axios from 'axios'
import { serverSettings } from './config/server';
import * as fileService from './http/httpRequests';
import socketSetup from './sockets/socketSetup';
const DiffMatchPatch = require('diff-match-patch');

export function activate(context: vscode.ExtensionContext) {

    let oldText = '';
    // let socketio;
    const dmp = new DiffMatchPatch();

    function setupDiffWatch() {
        vscode.workspace.onDidChangeTextDocument((event) => {
            const newText = event.document.getText();
            const diff = diffFromText(dmp, oldText, newText);
            // TODO
            // socket emit diff
            oldText = newText;
        })
    }

    console.log('activting');

    /* Command to upload a file to the remote server.
     * Does not connect - only upload */
    let uploadFile = vscode.commands.registerCommand('extension.uploadConnectFile', () => {

        const file_contents = vscode.window.activeTextEditor.document.getText();
        console.log(file_contents);
        oldText = file_contents;

        // http request to upload file, then get file uuid
        fileService.uploadFile(file_contents)
        .then((res) => {
            const file_uuid = res.data.file_uuid;
            const message = `Your file has been uploaded! Your file ID is: ${file_uuid}`;
            vscode.window.showInformationMessage(message);
            var socket = require('socket.io-client')(serverSettings.url);
            socketSetup(socket, vscode, file_uuid);
        });
    });

    let setJS = vscode.commands.registerCommand('extension.setJS', () => {

    });



    let downloadFile = vscode.commands.registerCommand('extension.downloadFile', () => {
        // ask user for the file ID
        vscode.window.showInputBox({prompt: "Enter the ID of the file you want to download"}).then((userInput) => {
            fileService.downloadFile(userInput)
            .then((res) => {
                const message = `you downloaded file with ID: ${res.data.data}`;
                vscode.window.showInformationMessage(message);
            });
        });
    });

    // register the socketConnect command
    let socketConnect = vscode.commands.registerCommand('extension.socketConnect', () => {
        var socket = require('socket.io-client')('http://localhost:8000');
        // socketSetup(socket, vscode);
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

function diffToText(dmp, diff) {
    const patch = dmp.patch_make(diff);
    const newText = dmp.patch_toText(patch);
    return newText;
}

function diffFromText(dmp, oldText, newText) {
    console.log('running diff from text');
    const diffs = dmp.diff_main(oldText, newText);
    console.log(diffs);
    return diffs;
}

// this method is called when your extension is deactivated
export function deactivate() {
}
