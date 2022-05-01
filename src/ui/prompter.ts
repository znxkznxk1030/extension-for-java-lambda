import { resolve } from "path";
import * as vscode from "vscode";

export interface Prompter<T> {
  picker: vscode.QuickInput;
  initialize: (options?: vscode.QuickPickOptions & AdditionalOptions) => void;
  beforeInteract?: () => void | Promise<any>;
  interact: () => Promise<T | T[] | undefined>;
  id: string;
}

type AdditionalOptions = {
  id: string;
  title: string;
  loadItemsAsync?: () => Promise<any[] | undefined>;
  mapperToPickItem?: (arg?: any[]) => vscode.QuickPickItem[] | undefined;
};

export class DefaultPickItem implements vscode.QuickPickItem {
  public readonly label: string;
  public readonly data: object | string | number | undefined;

  constructor(name?: string, data?: object) {
    this.label = name || "[Anonymous]";
    this.data = data;
  }
}

type TPrompterResult = {};

export class PickPrompter<
  T extends vscode.QuickPickItem & {
    data: object | string | number | undefined;
  }
> implements Prompter<T>
{
  _id: string;
  picker: vscode.QuickPick<T>;
  canSelectMany = false;
  loadItemsAsync?: () => Promise<any[] | undefined>;
  mapperToPickItem?: (arg?: any[]) => vscode.QuickPickItem[] | undefined;

  public get id(): string {
    return this._id;
  }

  constructor(options: vscode.QuickPickOptions & AdditionalOptions) {
    this.picker = vscode.window.createQuickPick<T>();
    this._id = options.id;
    this.initialize(options);
  }

  initialize(options?: vscode.QuickPickOptions & AdditionalOptions) {
    this.picker.title = options?.title;

    if (options?.canPickMany) {
      this.canSelectMany = options.canPickMany;
    }

    this.picker.canSelectMany = this.canSelectMany;

    this.loadItemsAsync = options?.loadItemsAsync;
    this.mapperToPickItem = options?.mapperToPickItem;
  }

  async beforeInteract() {
    let items;
    if (this.loadItemsAsync) {
      items = await this.loadItemsAsync();
    }

    if (this.mapperToPickItem) {
      items = this.mapperToPickItem(items) || [];
    }

    if (items) {
      this.picker.items = items;
    }
  }

  async interact(): Promise<T | T[] | undefined> {
    const disposables: vscode.Disposable[] = [];

    try {
      await this.beforeInteract();

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
  _id: string;
  picker: vscode.QuickInput;

  public get id(): string {
    return this._id;
  }

  constructor(picker: vscode.InputBox) {
    this._id = "";
    this.picker = picker;
    this.initialize();
  }

  initialize() {}

  interact(): Promise<T | T[] | undefined> {
    return new Promise((resolve) => {
      return resolve([]);
    });
  }
}
