/**
 * Copied from "aws-toolkit=vscode"
 *         - Copyright 2021 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *         - SPDX-License-Identifier: Apache-2.0
 * Origin: https://github.com/aws/aws-toolkit-vscode/blob/479b9d45b5f5ad30fc10567e649b59801053aeba/src/shared/ui/pickerPrompter.ts
 *
 * Modified
 *  - Remove EstimateSteps Logics
 *  - Transalte comments to Korean
 */

import * as vscode from "vscode";
import { WIZARD_BACK, WIZARD_EXIT } from "../wizard/wizard";
import { PrompterButtons, QuickInputButton } from "./button";
import { Prompter, PromptResult } from "./prompter";

/**
 * `vscode.QuickPickOptions`를 넘어 `QuickPick`을 구성하는 옵션입니다.
 *
 * @note onDidSelectItem() 대신에 transform()을 사용하십시오
 *
 */
export type ExtendedQuickPickOptions<T> = Omit<
  vscode.QuickPickOptions,
  "canPickMany" | "placeHolder" | "onDidSelectItem"
> & {
  title?: string;
  value?: string;
  step?: number;
  placeholder?: string;
  totalSteps?: number;
  buttons?: PrompterButtons<T>;
  compare?: (a: DataQuickPickItem<T>, b: DataQuickPickItem<T>) => number;
  /** [NOT IMPLEMENTED] 항목이 로드되는 동안 표시할 항목 */
  loadingItem?: DataQuickPickItem<T>;
  /** 로드된 항목이 없는 경우 표시할 항목 */
  noItemsFoundItem?: DataQuickPickItem<T>;
  /** 항목을 로드하는 중에 오류가 발생했는지 표시할 항목 */
  errorItem?: DataQuickPickItem<T>;
  /**
   * `recentItem`의 설명으로 "Selected previously"을 설정할지 여부를 제어합니다 (default: true).
   * 이것은 호출자가 매 프롬프트마다 항목을 재생성할 것으로 예상되므로 현재 항목을 변경합니다.
   */
  recentItemText?: boolean;
};

export type DataQuickPick<T> = Omit<
  vscode.QuickPick<DataQuickPickItem<T>>,
  "buttons"
> & { buttons: PrompterButtons<T> };
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

const DEFAULT_NO_ITEMS_ITEM = {
  label: "[No items found]",
  detail: "Click here to go back",
  alwaysShow: true,
  data: WIZARD_BACK,
};

const DEFAULT_ERROR_ITEM = {
  label: "[Error loading items]",
  alwaysShow: true,
  data: WIZARD_BACK,
};

export const DEFAULT_QUICKPICK_OPTIONS: ExtendedQuickPickOptions<any> = {
  ignoreFocusOut: true,
  recentItemText: true,
  noItemsFoundItem: DEFAULT_NO_ITEMS_ITEM,
  errorItem: DEFAULT_ERROR_ITEM,
};

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

  constructor(
    public readonly quickPick: DataQuickPick<T>,
    protected readonly options: ExtendedQuickPickOptions<T> = {}
  ) {
    super();
  }

  public get recentItem(): any {
    throw this._lastPicked;
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

  public async loadItems(
    items: ItemLoadTypes<T>,
    disableInput: boolean = true
  ): Promise<void> {}
}

function acceptItems<T>(
  picker: DataQuickPick<T>,
  resolve: (items: DataQuickPickItem<T>[]) => void
): void {
  if (picker.selectedItems.length === 0) {
    return;
  }

  picker.selectedItems.forEach((item) =>
    item.onClick !== undefined ? item.onClick() : undefined
  );

  if (picker.selectedItems.some((item) => item.invalidSelection)) {
    return;
  }

  resolve(Array.from(picker.selectedItems));
}

function castDatumToItems<T>(...datum: T[]): DataQuickPickItem<T>[] {
  return datum.map((data) => ({ label: "", data }));
}

/**
 * QuickPick 이벤트를 설정합니다.
 * 오류는 다음을 통해 처리되어야 하므로 거부는 의도적으로 사용되지 않습니다.
 * 예외가 아닌, signal을 제어합니다.
 */
function promptUser<T>(
  picker: DataQuickPick<T>,
  onDidShowEmitter: vscode.EventEmitter<void>
): Promise<DataQuickPickItem<T>[] | undefined> {
  return new Promise<DataQuickPickItem<T>[] | undefined>((resolve) => {
    picker.onDidAccept(() => acceptItems(picker, resolve));
    picker.onDidHide(() => resolve(castDatumToItems(WIZARD_EXIT)));
    picker.onDidTriggerButton((button) => {
      if (button === vscode.QuickInputButtons.Back) {
        resolve(castDatumToItems(WIZARD_BACK));
      } else if ((button as QuickInputButton<T>).onClick !== undefined) {
        const response = (button as QuickInputButton<T>).onClick!();
        if (response !== undefined) {
          resolve(castDatumToItems(response));
        }
      }
    });
    picker.show();
    onDidShowEmitter.fire();
  }).finally(() => picker.dispose());
}

/**
 * 기본 개체에 '설정'을 적용합니다. 설정과 개체 간의 공유 속성에는 다음이 있어야 합니다.
 * TypeScript 컴파일러에 의해 시행되는 동일한 유형. 프리미티브만 적용합니다. 조용히 개체를 무시합니다.
 */
export function applyPrimitives<T1 extends Record<string, any>, T2 extends T1>(
  obj: T2,
  settings: T1
): void {
  const clone = Object.assign({}, settings);
  Object.keys(clone)
    .filter((key) => typeof clone[key] === "object" || clone[key] === undefined)
    .forEach((key) => delete clone[key]);

  Object.assign(obj, clone);
}
