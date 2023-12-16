const vscode = require("vscode");

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  var statusBarButton = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left
  );

  Object.assign(statusBarButton, {
    tooltip: "Show My Message",
    command: "code-recall.show-recall",
    text: "$(comment-draft)",
  });

  var message = context.workspaceState.get("recall-message") || "";

  if (message != "") {
    vscode.window.showWarningMessage(message);
    vscode.window.showInformationMessage(
      "Code Recall: You have a recall reminder!"
    );

    statusBarButton.text = "$(comment-unresolved)";
    vscode.commands.executeCommand("code-recall.show-recall");
  }

  context.subscriptions.push(
    vscode.commands.registerCommand("code-recall.show-recall", async () => {
      vscode.window
        .showQuickPick([message], {
          placeHolder: "Press enter to View All & Edit",
        })
        .then((selectedItem) => {
          if (selectedItem === message) {
            // Execute the command if the existing message is selected
            vscode.commands.executeCommand("code-recall.edit-recall");
          }
        });
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("code-recall.edit-recall", async () => {
      vscode.window
        .showInputBox({
          placeHolder: "Enter your message",
          value: message,
        })
        .then((newMessage) => {
          if (newMessage !== undefined) {
            context.workspaceState.update("recall-message", newMessage);

            if (newMessage == "") {
              statusBarButton.text = "$(comment-draft)";

              var statusBarItem = vscode.window.setStatusBarMessage(
                `Message cleared`,
                5000
              );
            } else {
              statusBarButton.text = "$(comment-unresolved)";

              var statusBarItem = vscode.window.setStatusBarMessage(
                `Message saved: ${newMessage}`,
                5000
              );
            }

            context.subscriptions.push(statusBarItem);
          }
        });
    })
  );

  statusBarButton.show();
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
