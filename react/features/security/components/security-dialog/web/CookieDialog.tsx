// @flow

import React, { useState, useEffect } from 'react';

import { setPassword as setPass } from '../../../../base/conference/actions';
import Dialog from '../../../../base/ui/components/web/Dialog';
import { translate } from '../../../../base/i18n/functions';
import { isLocalParticipantModerator } from '../../../../base/participants/functions';
import { connect } from 'react-redux';
import E2EESection  from '../../../../e2ee/components/E2EESection';
import LobbySection from '../../../../lobby/components/web/LobbySection';

import PasswordSection from './PasswordSection';

type Props = {

    /**
     * Whether or not the current user can modify the current password.
     */
    _canEditPassword: boolean,

    /**
     * The JitsiConference for which to display a lock state and change the
     * password.
     */
    _conference: Object,

    /**
     * The value for how the conference is locked (or undefined if not locked)
     * as defined by room-lock constants.
     */
    _locked: string,

    /**
     * The current known password for the JitsiConference.
     */
    _password: string,

    /**
     * The number of digits to be used in the password.
     */
    _passwordNumberOfDigits: number,

    /**
     * Indicates whether e2ee will be displayed or not.
     */
    _showE2ee: boolean,

    /**
     * Action that sets the conference password.
     */
    setPassword: Function,

    /**
     * Invoked to obtain translated strings.
     */
    t: Function
}

/**
 * Component that renders the security options dialog.
 *
 * @returns {React$Element<any>}
 */
function CookieDialog(
    {
    _canEditPassword,
    _conference,
    _locked,
    _password,
    _passwordNumberOfDigits,
    _showE2ee,
    setPassword
}: Props
    ) {
    const [ passwordEditEnabled, setPasswordEditEnabled ] = useState(false);

    useEffect(() => {
        if (passwordEditEnabled && _password) {
            setPasswordEditEnabled(false);
        }
    }, [ _password ]);

    return (
        <Dialog
            //cancelKey = 'dialog.confirmNo'
            //cancelDisabled = { true }
            ok = {{translationKey:'dialog.confirmYes'}}
            onCancel = { _onSubmit }
            onSubmit = { _onSubmit }
            //titleKey = 'liveStreaming.start'
            titleKey = "사용자 인증 실패"
            size = { 'medium' }>
            <div className = 'live-stream-dialog'>
                교육 개설자는 반드시 포털을 통해 접속해야 합니다.<br/>정상적인 로그인 상태가 아니므로<br/>포털 재로그인 후 접속 하시기 바랍니다.
            </div>
        </Dialog>
    );
}

function _onSubmit() {
    document.location.href = window.location.protocol + "//" + window.location.hostname;
}

/**
 * Maps (parts of) the Redux state to the associated props for the
 * {@code SecurityDialog} component.
 *
 * @param {Object} state - The Redux state.
 * @private
 * @returns {Props}
 */
function mapStateToProps(state) {
    const {
        conference,
        e2eeSupported,
        locked,
        password
    } = state['features/base/conference'];
    const { roomPasswordNumberOfDigits } = state['features/base/config'];

    return {
        _canEditPassword: isLocalParticipantModerator(state),
        _conference: conference,
        _dialIn: state['features/invite'],
        _locked: locked,
        _password: password,
        _passwordNumberOfDigits: roomPasswordNumberOfDigits,
        _showE2ee: Boolean(e2eeSupported)
    };
}

const mapDispatchToProps = { setPassword: setPass };

export default translate(connect(mapStateToProps, mapDispatchToProps)(CookieDialog));

