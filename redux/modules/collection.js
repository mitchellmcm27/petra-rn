// @flow

import createReducer from "../createReducer";
import type { Action } from "../actions";
import type { Store, ThunkAction } from "../store";
import { createSelector } from "reselect";
import type { Rock } from "../../constants/Types";
import type { State as EntireState } from "../state";

// import the rock data, which is an array of objects
const data = require("../data/rocks.json");
const rocks = data.rocks;

// denormalize it for performance
let rockIds = [];
let rocksById = {};
rocks.map(r => {
  // locations are approximate
  // we add a littel randomness to deal with overlapping locations
  r.lat = r.lat + Math.random() / 50000;
  r.lon = r.lon + Math.random() / 50000;
  rockIds.push(r.id);
  rocksById[r.id] = r;
});

export function visitRockId(id: string): ThunkAction {
  return dispatch => {
    dispatch({ type: "SCANNED_ROCK_ID_ADD", payload: id });
  };
}

type State = {
  +ids: string[],
  +byId: { [id: string]: Rock },
  +list: Rock[],
  +scannedRocks: { [id: string]: boolean }
};

const INITIAL_STATE: State = {
  ids: rockIds,
  byId: rocksById,
  list: rocks,
  scannedRocks: {}
};

const reducer = createReducer(INITIAL_STATE, {
  COLLECTION_SET: (state, action) => {
    return {
      ...state,
      ids: action.payload.ids,
      byId: action.payload.byId
    };
  },
  SCANNED_ROCK_ID_ADD: (state, action) => ({
    ...state,
    scannedRocks: { ...state.scannedRocks, [action.payload]: true }
  })
});

const getIds = (state: EntireState) => state.collection.ids;
const getById = (state: EntireState) => state.collection.byId;
const getRocks = (state: EntireState) => state.collection.list;
const getScannedRocks = (state: EntireState) => state.collection.scannedRocks;
const getScannedRockIds = createSelector([getScannedRocks], o =>
  Object.keys(o).filter(k => o[k])
);

const selectors = {
  ids: getIds,
  byId: getById,
  rocks: getRocks,
  scannedRocks: getScannedRocks,
  scannedRockIds: getScannedRockIds
};

export { reducer, selectors };
