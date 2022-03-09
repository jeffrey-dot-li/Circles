export type Actionify_t<T extends string> = `ACTION-${T}`;
export const Actionify = <T extends string>(s: T): Actionify_t<T> => `ACTION-${s}`;

export interface ActionType<ActionName extends string> {
  type: ActionName
}
