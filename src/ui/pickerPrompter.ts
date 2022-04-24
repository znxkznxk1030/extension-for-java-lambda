import * as vscode from "vscode";
import { Prompter, PromptResult } from "./prompter";

/**
 * 항목 목록을 표시하는 UI 요소를 만듭니다. 사용자가 항목을 선택할 때 반환되어야 하는 정보는 각 항목의 'data' 속성에 있어야 합니다. '라벨'만 원하는 경우
 * {@link createLabelQuickPick} 를 대신 사용하세요.
 *
 * @param items 항목에 대한 배열 또는 Promise
 * @param options QuickPick 과 QuickPickPrompter에 대한 사용자 정의
 * @returns A {@link QuickPickPrompter}. 이것은 `prompt` 메소드와 함께 직접 사용하거나 Wizard에 제공할 수 있습니다.
 */
export function createQuickPick<T>(
  items: ItemLoadTypes<T>,
  options?: ExtendedQuickPickOptions<T>
): QuickPickPrompter<T> {
  const picker = vscode.window.createQuickPick<
    DataQuickPickItem<T>
  >() as DataQuickPick<T>;
  const mergedOptions = { ...DEFAULT_QUICKPICK_OPTIONS, ...options };
  applyPrimitives(picker, mergedOptions);
  picker.buttons = mergedOptions.buttons ?? [];

  const prompter = new QuickPickPrompter<T>(picker, mergedOptions);

  prompter.loadItems(items);

  return prompter;
}

/**
 * 추가 정보를 QuickPickItem에 'data'로 첨부합니다.
 * 또는 'data'는 사용자가 항목을 선택한 후 평가된 Promise를 반환하는 함수일 수 있습니다.
 */
export type DataQuickPickItem<T> = vscode.QuickPickItem & {
  data: QuickPickData<T>;
  invalidSelection?: boolean;
  onClick?: () => any | Promise<any>;
};

type QuickPickData<T> = PromptResult<T> | (() => Promise<PromptResult<T>>);

/**
 * QuickPick 프롬프트가 현재 지원하는 loading:
 * * 항목의 순수 배열
 * * 항목 배열에 대한 Promise
 * * 매 반복마다 항목 배열을 생성하는 AsyncIterable
 */
type ItemLoadTypes<T> =
  | Promise<DataQuickPickItem<T>[]>
  | DataQuickPickItem<T>[]
  | AsyncIterable<DataQuickPickItem<T>[]>;

/**
 * 사용자가 선택할 수 있는 항목 목록을 표시하는 일반 UI element.
 * {@link vscode.QuickPick QuickPick} 를 감쌈.
 */
export class QuickPickPrompter<T> extends Prompter<T> {
  protected _lastPicked?: DataQuickPickItem<T>;
  private onDidShowEmitter = new vscode.EventEmitter<void>();
  private onDidChangeBusyEmitter = new vscode.EventEmitter<boolean>();
  private onDidChangeEnablementEmitter = new vscode.EventEmitter<boolean>();
  private isShowingPlaceholder?: boolean;
  public onDidShow = this.onDidShowEmitter.event;
  public onDidChangeBusy = this.onDidChangeBusyEmitter.event;
  public onDidChangeEnablement = this.onDidChangeEnablementEmitter.event;

  public get recentItem(): any {
    throw new Error("Method not implemented.");
  }
  public set recentItem(response: any) {
    throw new Error("Method not implemented.");
  }
  protected promptUser(): Promise<PromptResult<T>> {
    throw new Error("Method not implemented.");
  }
  public setSteps(current: number, total: number): void {
    throw new Error("Method not implemented.");
  }
}
