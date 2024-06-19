import { AnyAction } from 'redux';

import { IStore } from '../app/types';
import {
    getParticipantCount,
    isLocalParticipantModerator
} from '../base/participants/functions';
import { PARTICIPANT_UPDATED } from '../base/participants/actionTypes';
import MiddlewareRegistry from '../base/redux/MiddlewareRegistry';
import StateListenerRegistry  from '../base/redux/StateListenerRegistry';

import { AUTHENTICATE_ACCOUNT } from './actionTypes';
import { toggleSecurityDialog, toggleCookieDialog, toggleCertificationDialog } from './actions';
import { setRandomPassword, authenticateAccount } from './functions';

/**
 * Handles cleanup of lock prompt state when a conference is joined.
 *
 * @param {Store} store - The redux store in which the specified action is being
 * dispatched.
 * @param {Dispatch} next - The redux {@code dispatch} function to dispatch the
 * specified action to the specified store.
 * @param {Action} action - The redux action {@code CONFERENCE_JOINED} which
 * specifies the details associated with joining the conference.
 * @private
 * @returns {*}
 */


MiddlewareRegistry.register((store: IStore) => (next: Function) => async (action: AnyAction) => {
    switch (action.type) {

    case AUTHENTICATE_ACCOUNT: {
        const result = next(action);
        const { dispatch, getState } = store;
        const state = getState();
        const { conference, locked } = state['features/base/conference'];

        console.log(isLocalParticipantModerator(state));
        console.log(getParticipantCount(state));

        if (!isLocalParticipantModerator(state) && getParticipantCount(state) === 1 && !locked) {
            setRandomPassword(conference, dispatch, state);

            const response = await authenticateAccount();
            const status = response.status;

            if (status === 200) { // 최초 접속 또는 30일 이내 접속
                const json = await response.json();

                APP.conference.stfNo = json.data.stfNo;
                APP.conference._writeLog('Valid Cookie');
                dispatch(toggleSecurityDialog());
            } else if (status === 401) { // 30일 초과 미접속으로 계정 잠금 상태
                const json = await response.json();

                APP.conference.stfNo = json.data.stfNo;
                APP.conference._writeLog('Locked');
                dispatch(toggleCertificationDialog());
            } else {
                // 통신불가 => 로컬 개발시 수정
                APP.conference._writeLog('Invalid Cookie');
                dispatch(toggleCookieDialog());

                // 200
                // APP.conference.stfNo = '8094310';
                // APP.conference._writeLog('Valid Cookie');
                // dispatch(toggleSecurityDialog());

                // 401
                // APP.conference.stfNo = '8094310';
                // APP.conference._writeLog('Locked');
                // dispatch(toggleCertificationDialog());
            }
        }

        return result;
    }
        // case PARTICIPANT_UPDATED: {
        //     const result = next(action);
        //     //const { participant: p } = action;
        //     const { dispatch, getState } = store;

        //     const { conference, locked } = getState()['features/base/conference'];

        //     if(isLocalParticipantModerator(getState) && getParticipantCount(getState) === 1 && !locked) {
        //     //if(getParticipantCount(getState) === 1) {

        //         setRandomPassword(conference, dispatch, getState);

        //         const response = await authenticateAccount2();
        //         const status = response.status;
        //         const json = response.json();

        //         if(status === 200) {    // 최초 접속 또는 30일 이내 접속
        //             APP.conference._writeLog('Valid Cookie');
        //             dispatch(toggleSecurityDialog());
        //         }
        //         else if(response.status === 401) {   // 30일 초과 미접속으로 계정 잠금 상태
        //             APP.conference._writeLog('Locked');
        //             dispatch(toggleCertificationDialog());
        //         }
        //         else {
        //             APP.conference._writeLog('Invalid Cookie');
        //             dispatch(toggleCookieDialog());
        //         }
        //     }
        //     return result;
        // }
    }

    return next(action);
});


/**
 * StateListenerRegistry provides a reliable way to detect the leaving of a
 * conference, where we need to clean up the notifications.
 */
// StateListenerRegistry.register(
//     /* selector */ state => {
//         const isModerator = isLocalParticipantModerator(state);
//         //const status = state['features/security'].status;
        
//         return {
//             isModerator
//             //, status
//         };
//     },
//     /* listener */ async ({ isModerator }, { dispatch, getState }) => {
//         //console.log("@@@@isModerator : " + isModerator);
//         //console.log("@@@@status : " + status);
//         const { conference, locked } = getState()['features/base/conference'];
//         //const status = getState()['features/base/security'];
//         if (isModerator && !locked) {

//             setRandomPassword(conference, dispatch, getState);

//             console.log("@@@@authenticateAccount2 call");
//             const response = await authenticateAccount2();
//             const status = response.status;
//             const json = response.json();

//             if(status === 200) {    // 최초 접속 또는 30일 이내 접속
//                 APP.conference._writeLog('Valid Cookie');
//                 dispatch(toggleSecurityDialog());
//             }
//             else if(response.status === 401) {   // 30일 초과 미접속으로 계정 잠금 상태
//                 APP.conference._writeLog('Locked');
//                 dispatch(toggleCertificationDialog());
//             }
//             else {
//                 APP.conference._writeLog('Invalid Cookie');
//                 dispatch(toggleCookieDialog());
//             }


//             // setRandomPassword(conference, dispatch, getState);
//             // //const result = authenticateAccount();

//             // if(status === "SUCCESS") {
//             //     APP.conference._writeLog('Valid Cookie');
//             //     dispatch(toggleSecurityDialog());
//             // }
//             // else if(status === "LOCKED") {
//             //     APP.conference._writeLog('Locked');
//             //     dispatch(toggleCertificationDialog());
//             // }
//             // else if(status === "FAIL") { // FAIL
//             //     APP.conference._writeLog('Invalid Cookie');
//             //     dispatch(toggleCookieDialog());
//             // }
//         }
//     }
// );