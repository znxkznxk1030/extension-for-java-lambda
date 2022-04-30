import { Prompter } from "../ui/prompter";

export class wizard {}

export abstract class Wizard<TResult> {
  private readonly response: Partial<TResult> = {};
  private readonly prompterList: Prompter<any>[] = [];

  protected constructor() {}

  public async run(): Promise<TResult | undefined> {
    for (const prompter of this.prompterList) {
      const ret = await prompter.interact();
    }

    return this.getResult();
  }

  protected abstract getResult(): TResult | undefined;
}
