// @flow

import type { Action } from "./actions";

export type Reducer<S, A: Action> = (S, A) => S;

function createReducer<S, A: *>(
  initialState: S,
  handlers: { [key: string]: Reducer<S, A> }
): Reducer<S, A> {
  return function reducer(state: S = initialState, action: A): S {
    return handlers.hasOwnProperty(action.type)
      ? handlers[action.type](state, action)
      : state;
  };
}

export default createReducer;
