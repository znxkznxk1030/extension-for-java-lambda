import * as vscode from "vscode";
import { Prompter, PrompterDetermination } from "../ui/prompter";

export abstract class Wizard<TContext, TResult> {
  protected context: Partial<TContext> = {};
  private readonly prompterList: Prompter<any>[] = [];

  protected constructor() {}

  public addPrompter(prompter: Prompter<any>) {
    this.prompterList.push(prompter);
  }

  public async run(): Promise<TResult | undefined> {
    try {
      for (const prompter of this.prompterList) {
        const determination: PrompterDetermination = await prompter.interact(
          this.context
        );

        if (!determination) {
          continue;
        }

        Object.assign(this.context, {
          [prompter.id]: determination.data,
        });
      }

      console.log("RUN : ", this.context);

      return this.getResult();
    } catch (exception: any) {
      if (exception.message) {
        vscode.window.showErrorMessage(exception.message);
      } else {
        vscode.window.showErrorMessage(exception);
      }
      // console.log( exception);
    }
  }

  protected abstract getResult(): TResult | undefined;
}
