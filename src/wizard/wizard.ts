export enum ControlSignal {
  Retry,
  Exit,
  Back,
  Continue,
}

const WIZARD_CONTROL = Symbol();
const makeControlString = (type: string) => `[WIZARD_CONTROL] ${type}`;

export const WIZARD_RETRY = {
  id: WIZARD_CONTROL,
  type: ControlSignal.Retry,
  toString: () => makeControlString("Retry"),
};
export const WIZARD_BACK = {
  id: WIZARD_CONTROL,
  type: ControlSignal.Back,
  toString: () => makeControlString("Back"),
};
export const WIZARD_EXIT = {
  id: WIZARD_CONTROL,
  type: ControlSignal.Exit,
  toString: () => makeControlString("Exit"),
};

/** Control signals allow for alterations of the normal wizard flow */
export type WizardControl =
  | typeof WIZARD_RETRY
  | typeof WIZARD_BACK
  | typeof WIZARD_EXIT;
