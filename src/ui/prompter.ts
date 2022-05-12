import { resolve } from "path";
import * as vscode from "vscode";

export interface Prompter<T> {
  prompter: vscode.QuickInput;
  initialize: (options?: vscode.QuickPickOptions & AdditionalOptions) => void;
  beforeInteract?: () => void | Promise<any>;
  interact: (context?: any) => Promise<T | T[] | undefined>;
  id: string;
}

type AdditionalOptions = {
  id: string;
  title: string;
  loadItemsAsync?: (context?: any) => Promise<any[] | undefined>;
  mapperToPickItem?: (arg?: any[]) => vscode.QuickPickItem[] | undefined;
};

export class PrompterDetermination {
  public readonly data: any;

  constructor(data?: any) {
    this.data = data;
  }
}

export class DefaultPickItem
  extends PrompterDetermination
  implements vscode.QuickPickItem
{
  public readonly label: string;

  constructor(name?: string, data?: object) {
    super(data);
    this.label = name || "[Anonymous]";
  }
}

export class DefaultInputValue extends PrompterDetermination {
  constructor(data?: object | string) {
    super(data);
  }
}

export class PickPrompter<
  T extends vscode.QuickPickItem & {
    data: object | string | number | undefined;
  }
> implements Prompter<T>
{
  _id: string;
  prompter: vscode.QuickPick<T>;
  canSelectMany = false;
  loadItemsAsync?: (context?: any) => Promise<any[] | undefined>;
  mapperToPickItem?: (arg?: any[]) => vscode.QuickPickItem[] | undefined;

  public get id(): string {
    return this._id;
  }

  constructor(options: vscode.QuickPickOptions & AdditionalOptions) {
    this.prompter = vscode.window.createQuickPick<T>();
    this._id = options.id;
    this.initialize(options);
  }

  initialize(options?: vscode.QuickPickOptions & AdditionalOptions) {
    this.prompter.title = options?.title;

    if (options?.canPickMany) {
      this.canSelectMany = options.canPickMany;
    }

    this.prompter.canSelectMany = this.canSelectMany;

    this.loadItemsAsync = options?.loadItemsAsync;
    this.mapperToPickItem = options?.mapperToPickItem;
  }

  async beforeInteract(context?: any) {
    let items;
    if (this.loadItemsAsync) {
      items = await this.loadItemsAsync(context);
    }

    if (this.mapperToPickItem) {
      items = this.mapperToPickItem(items) || [];
    }

    if (items) {
      this.prompter.items = items;
    }
  }

  async interact(context?: any): Promise<T | T[] | undefined> {
    const disposables: vscode.Disposable[] = [];

    try {
      await this.beforeInteract(context);

      const response = await new Promise<T | T[] | undefined>((resolve) => {
        this.prompter.onDidAccept(
          () => {
            if (this.canSelectMany) {
              resolve(Array.from(this.prompter.selectedItems));
            } else {
              resolve(this.prompter.selectedItems[0]);
            }
          },
          this.prompter,
          disposables
        );

        this.prompter.onDidHide(
          () => {
            resolve(undefined);
          },
          this.prompter,
          disposables
        );

        this.prompter.show();
      });

      return response;
    } finally {
      disposables.forEach((d) => d.dispose() as void);
      this.prompter.hide();
    }
  }
}

export class InputPrompter implements Prompter<DefaultInputValue> {
  _id: string;
  prompter: vscode.InputBox;

  public get id(): string {
    return this._id;
  }

  constructor(options: vscode.InputBoxOptions & AdditionalOptions) {
    this._id = options.id;
    this.prompter = vscode.window.createInputBox();

    this.initialize(options);
  }

  initialize(options?: vscode.InputBoxOptions & AdditionalOptions) {
    this.prompter.title = options?.title;
  }

  async interact(context?: any): Promise<DefaultInputValue | undefined> {
    const disposables: vscode.Disposable[] = [];

    try {
      const response = await new Promise<DefaultInputValue | undefined>(
        (resolve) => {
          this.prompter.onDidAccept(
            () => {
              const value = this.prompter.value || "";
              const inputValue = new DefaultInputValue(value);

              resolve(inputValue);
            },
            this.prompter,
            disposables
          );

          this.prompter.onDidHide(
            () => {
              resolve(undefined);
            },
            this.prompter,
            disposables
          );

          this.prompter.show();
        }
      );

      return response;
    } finally {
      disposables.forEach((d) => d.dispose() as void);
      this.prompter.hide();
    }
  }
}
