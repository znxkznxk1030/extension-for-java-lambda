import { Prompter } from "../ui/prompter";

export class wizard {}

export abstract class Wizard<TResult> {
  protected readonly payload: Partial<TResult> = {};
  private readonly prompterList: Prompter<any>[] = [];

  protected constructor() {}

  public addPrompter(prompter: Prompter<any>) {
    this.prompterList.push(prompter);
  }

  public async run(): Promise<TResult | undefined> {
    for (const prompter of this.prompterList) {
      const selectedItem = await prompter.interact();

      if (!selectedItem) {
        continue;
      }

      Object.assign(this.payload, {
        [prompter.id]: selectedItem.data,
      });
    }

    return this.getResult();
  }

  protected abstract getResult(): TResult | undefined;
}
