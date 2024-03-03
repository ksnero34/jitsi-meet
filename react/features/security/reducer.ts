// @flow

import ReducerRegistry from '../base/redux/ReducerRegistry';

import {
    SET_ACCOUNT_INFO
} from './actionTypes';

/**
 * The initial state of the feature notifications.
 *
 * @type {array}
 */
const DEFAULT_STATE = {
    stfNo: '',
    status: ''
};

/**
 * Reduces redux actions which affect the display of notifications.
 *
 * @param {Object} state - The current redux state.
 * @param {Object} action - The redux action to reduce.
 * @returns {Object} The next redux state which is the result of reducing the
 * specified {@code action}.
 */
ReducerRegistry.register('features/security',
    (state = DEFAULT_STATE, action) => {
        switch (action.type) {
            case SET_ACCOUNT_INFO:
                return {
                    ...state,
                    stfNo: action.stfNo,
                    status: action.status
                };
            }

        return state;
    });
