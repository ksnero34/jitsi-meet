import { IStore } from '../app/types';
import { toggleDialog, hideDialog } from '../base/dialog/actions';

//import { SecurityDialog, CookieDialog, CertificationDialog } from './components/security-dialog/web';
import SecurityDialog from './components/security-dialog/web/SecurityDialog';
import CookieDialog from './components/security-dialog/web/CookieDialog';
import CertificationDialog from './components/security-dialog/web/CertificationDialog';
import { AUTHENTICATE_ACCOUNT, SET_ACCOUNT_INFO } from './actionTypes';

/**
 * Action that triggers toggle of the security options dialog.
 *
 * @returns {Function}
 */

export function authenticateAccount() {
    return {
        type: AUTHENTICATE_ACCOUNT
    };
}

export function setAccountInfo(accountInfo: any) {
    return {
        type: SET_ACCOUNT_INFO,
        stfNo: accountInfo?.stfNo,
        status: accountInfo?.status
    };
}

export function toggleSecurityDialog() {
    return function(dispatch: IStore['dispatch']) {
        dispatch(toggleDialog(SecurityDialog));
    };
}


export function CloseCertificationAndOpenSecurityDialog() {
    return function(dispatch: (arg0: Object) => Object) {
        dispatch(hideDialog(CertificationDialog));
        setTimeout(() => {
            dispatch(toggleDialog(SecurityDialog));
        }, 300);
    };
}

export function toggleCookieDialog() {
    return function(dispatch: (arg0: Object) => Object) {
        dispatch(toggleDialog(CookieDialog));
    };
}

export function toggleCertificationDialog() {
    return function(dispatch: (arg0: Object) => Object) {
        dispatch(toggleDialog(CertificationDialog));
    };
}