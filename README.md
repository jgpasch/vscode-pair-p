This is a work in progress!!!!

This extension is part of a larger family of repos that lets users do remote pair programming using their IDE of choce.

This repo is for the VSCode extension.

In order to use this extension, you must point to the running collab server.
You can change the server url in the file src/config/server.ts by changing the value of 'url'.

When the server is running (work in progress), you can simply open this folder in VSCode, and press F5 to run the extension in debug mode.

At this point, press SHIFT + CMD + P to open the command palette, and type the command 'upload/connect file'.

This will send whatever file contents you have in the active editor window to the server, and return you a unique file UUID.

You can give this unique ID to your remote collaborator, and they can use the ID to connect to the file as well.

From then, you will see live edits that anyone else connected to the file makes! (this functionality to come.)