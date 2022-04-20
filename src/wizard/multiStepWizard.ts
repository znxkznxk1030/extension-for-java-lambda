export interface WizardStep {
  (stepNumber: number): Thenable<Transition>;
}

export interface Transition {
  nextState: WizardNextState;
  nextStep?: WizardStep;
}

export enum WizardNextState {
  CONTINUE,
  RETRY,
  GO_BACK,
  TERMINATE,
}

export const WIZARD_RETRY: Transition = {
  nextState: WizardNextState.RETRY,
};

export const WIZARD_TERMINATE: Transition = {
  nextState: WizardNextState.TERMINATE,
};

export const WIZARD_GOBACK: Transition = {
  nextState: WizardNextState.GO_BACK,
};

export function wizardContinue(step: WizardStep): Transition {
  return {
    nextState: WizardNextState.CONTINUE,
    nextStep: step,
  };
}