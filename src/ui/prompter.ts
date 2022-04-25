/**
 * Copied from "aws-toolkit=vscode"
 *         - Copyright 2021 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *         - SPDX-License-Identifier: Apache-2.0
 * Origin: https://github.com/aws/aws-toolkit-vscode/blob/479b9d45b5f5ad30fc10567e649b59801053aeba/src/shared/ui/Prompter.ts
 *
 * Modified
 *  - Remove EstimateSteps Logics
 *  - Transalte comments to Korean
 */
export type PromptResult<T> = T | undefined; //| WizardControl

export type Transform<T, R = T> = (result: T) => R;

/**
 * 'prompt' UI 의 일반 추상화
 */
export abstract class Prompter<T> {
  private disposed = false;
  protected transforms: Transform<T, any>[] = [];

  constructor() {}

  /** 프롬프트의 총 step수를 반환 */
  public get totalSteps(): number {
    return 1;
  }

  /** */
  public abstract get recentItem(): any;
  public abstract set recentItem(response: any);

  /** Type-helper, 프롬프터가 다른 형태로 맵핑될 수 있도록 허가한다. */
  public transform<R>(callback: Transform<T, R>): Prompter<R> {
    this.transforms.push(callback);
    return this as unknown as Prompter<R>;
  }

  /** 추가된 순서대로 사용자 응답에 변환을 적용합니다. */
  protected applyTransforms(result: PromptResult<T>): PromptResult<T> {
    for (const cb of this.transforms) {
      if (result === undefined) {
        return result;
      }

      const _result: T | undefined = cb(result);
      if (_result !== undefined) {
        result = _result;
      }
    }

    return result;
  }

  /**
   * 사용자가 응답할 대화 상자를 엽니다.
   * @returns The user-response, undefined, or a special control-signal used in Wizards.
   */
  public async prompt(): Promise<PromptResult<T>> {
    if (this.disposed) {
      throw new Error('Cannot call "prompt" multiple times');
    }
    this.disposed = true;
    return this.applyTransforms(await this.promptUser());
  }

  // public abstract setStepEstimator(estimator: StepEstimator<T>): void;
  protected abstract promptUser(): Promise<PromptResult<T>>;
  public abstract setSteps(current: number, total: number): void;
}
