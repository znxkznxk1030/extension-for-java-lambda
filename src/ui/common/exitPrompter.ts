import { Prompter, PromptResult } from "../prompter";

class ExitPrompter extends Prompter<boolean> {
  private _isStart = true;

  public get recentItem(): any {
    return undefined;
  }
  public set recentItem(response: any) {}

  protected promptUser(): Promise<PromptResult<boolean>> {
    if (this._isStart) {
      return true;
    }

    const prompter = createQuickPick(
      [
        { label: "No", data: false },
        { label: "Yes", data: true },
      ],
      {
        title: "Exit wizard?",
      }
    );

    return await prompter.prompt();
  }
  public setSteps(current: number, total: number): void {
    // 종료는 첫 번째 단계에서 시작되었으므로 프롬프트는 2단계입니다.
    this._isStart = current === 2;
  }
}
