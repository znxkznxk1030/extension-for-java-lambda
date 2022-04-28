import { resolve } from "path";
import * as vscode from "vscode";

export interface Prompter<T> {
  picker: vscode.QuickInput;
  interact: () => Promise<T | T[] | undefined>;
}

export class PickPrompter<T extends vscode.QuickPickItem>
  implements Prompter<T>
{
  picker: vscode.QuickPick<T>;
  canSelectMany = false;

  constructor(picker: vscode.QuickPick<T>, options: vscode.QuickPickOptions) {
    this.picker = picker;

    if (options.canPickMany) {
      this.canSelectMany = options.canPickMany;
    }

    this.picker.canSelectMany = this.canSelectMany;
  }

  async interact(): Promise<T | T[] | undefined> {
    const disposables: vscode.Disposable[] = [];

    try {
      const response = await new Promise<T | T[] | undefined>((resolve) => {
        this.picker.onDidAccept(
          () => {
            if (this.canSelectMany) {
              resolve(Array.from(this.picker.selectedItems));
            } else {
              resolve(this.picker.selectedItems[0]);
            }
          },
          this.picker,
          disposables
        );

        this.picker.onDidHide(
          () => {
            resolve(undefined);
          },
          this.picker,
          disposables
        );

        this.picker.show();
      });

      return response;
    } finally {
      disposables.forEach((d) => d.dispose() as void);
      this.picker.hide();
    }
  }
}

export class InputPrompter<T> implements Prompter<T> {
  picker: vscode.QuickInput;

  constructor(picker: vscode.InputBox) {
    this.picker = picker;
  }

  interact(): Promise<T | T[] | undefined> {
    return new Promise((resolve) => {
      return resolve([]);
    });
  }
}
