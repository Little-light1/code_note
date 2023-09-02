import { combineReducers } from "redux";
import { createSlice, createAction } from "@reduxjs/toolkit";
import { capitalize } from "lodash";
import type { PayloadActionCreator, Slice, Reducer } from "@reduxjs/toolkit";
import type { AnyAction } from "redux";
import type { Reducers } from "./types";

// 这里将驼峰法调整成首字母大写
const formatSimpleAction = (str: string) => `set${str[0].toUpperCase() + str.substr(1)}`;

function createUnImmerReducer({ initialState, simpleAction, simpleMultiAction, simpleResetAction, actions, reducer, name }: any) {
  // eslint-disable-next-line @typescript-eslint/default-param-last
  const unImmerReducer = (state = initialState, action: AnyAction) => {
    switch (action.type) {
      case simpleAction.toString():
        return action.payload;
      case simpleMultiAction.toString():
        if (action.payload && toString.call(action.payload) === "[object Object]" && action.payload.hasOwnProperty(name)) {
          return action.payload[name];
        }
        return state;
      case simpleResetAction.toString():
        return initialState;
      default:
        if (actions.length) {
          const foundCustomAction = actions.find((customAction: any) => action.type === customAction.actionType);
          if (foundCustomAction) {
            return foundCustomAction.action(state, action);
          }
        }
        if (typeof reducer === "function") {
          return reducer(state, action);
        }
        return state;
    }
  };

  return unImmerReducer;
}

interface BuildReducerProps {
  reducers?: Reducers | undefined;
  key: string;
  immer: boolean;
}

export function buildReducer({ reducers, key, immer = true }: BuildReducerProps) {
  const slices: Slice[] = [];
  const unImmerReducers: { [key: string]: Reducer<any, AnyAction> } = {};
  const simpleActions: { [key: string]: PayloadActionCreator<any, string> } = {};
  const simpleMultiAction = createAction<any>(`set${capitalize(key)}MultiState`);
  const simpleResetAction = createAction<void>(`reset${capitalize(key)}MultiState`);

  if (!reducers || Object.keys(reducers).length === 0) {
    return null;
  }

  Object.keys(reducers).forEach((name) => {
    const { initialState, actions = [], reducer } = reducers[name];
    const simpleAction = createAction<any>(`${formatSimpleAction(name)}_${key}`);
    simpleActions[formatSimpleAction(name)] = simpleAction;

    if (immer) {
      const slice = createSlice({
        name,
        initialState,
        reducers: {},
        extraReducers: (builder) => {
          builder.addCase(simpleAction, (state, action) => action.payload);

          builder.addCase(simpleMultiAction, (state, action) => {
            const { payload } = action;
            if (payload && toString.call(payload) === "[object Object]" && payload.hasOwnProperty(name)) {
              return payload[name];
            }
            return state;
          });

          builder.addCase(simpleResetAction, () => initialState);

          actions.forEach(({ actionType, action }) => {
            builder.addCase(actionType, action);
          });
        },
      });

      slices.push(slice);
    } else {
      unImmerReducers[name] = createUnImmerReducer({
        initialState,
        simpleAction,
        simpleMultiAction,
        simpleResetAction,
        actions,
        reducer,
        name,
      });
    }
  });

  const totalReducers = Object.assign(
    slices.reduce((prev, curr) => ({ ...prev, [curr.name]: curr.reducer }), {}),
    unImmerReducers
  );

  return {
    simpleActions,
    simpleMultiAction,
    simpleResetAction,
    reducers: combineReducers(totalReducers),
  };
}
