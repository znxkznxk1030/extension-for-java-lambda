import { Prompter } from "../ui/prompter";

export abstract class Wizard<TContext, TResult> {
  protected context: Partial<TContext> = {};
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

      Object.assign(this.context, {
        [prompter.id]: selectedItem.data,
      });
    }

    console.log("RUN : ", this.context);

    return this.getResult();
  }

  protected abstract getResult(): TResult | undefined;
}
