import React, { Component, useRef } from 'react';
import { WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import { IReduxState, IStore } from '../../app/types';
import { setBeforeEnteredPassword, setPassword } from '../../base/conference/actions';
import { IJitsiConference } from '../../base/conference/reducer';
import { translate } from '../../base/i18n/functions';
import Dialog from '../../base/ui/components/web/Dialog';
import Input from '../../base/ui/components/web/Input';
import { _cancelPasswordRequiredPrompt } from '../actions';

/**
 * The type of the React {@code Component} props of
 * {@link PasswordRequiredPrompt}.
 */
interface IProps extends WithTranslation {

    /**
     * The JitsiConference which requires a password.
     */
    conference: IJitsiConference;

    /**
     * The redux store's {@code dispatch} function.
     */
    dispatch: IStore['dispatch'];

    passwordErrorCount: number;

}

/**
 * The type of the React {@code Component} state of
 * {@link PasswordRequiredPrompt}.
 */
interface IState {

    /**
     * The password entered by the local participant.
     */
    password?: string;
    // eslint-disable-next-line typescript-sort-keys/interface
    isPasswordCorrect?: boolean;
}

/**
 * Implements a React Component which prompts the user when a password is
 * required to join a conference.
 */
class PasswordRequiredPrompt extends Component<IProps, IState> {
    state = {
        password: '',
        isPasswordCorrect: false
    };
    inputRef: any;
    // eslint-disable-next-line valid-jsdoc
    /**
     * Initializes a new PasswordRequiredPrompt instance.
     *
     * @param {Object} props - The read-only properties with which the new
     * instance is to be initialized.
     */
    constructor(props: IProps) {
        super(props);
        // eslint-disable-next-line prefer-const
        // const globalstate = getConferenceState(toState(getState));
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        let globalstate = APP.store.getState()['features/base/conference'];
        console.log(`직전 패스워드 : ${globalstate.beforeEnteredPassword}`);
        console.log(`직전 패스워드 옳음여부: ${globalstate.beforePasswordCorrect}`);

        this.inputRef = React.createRef();

        // Bind event handlers so they are only bound once per instance.
        this._onPasswordChanged = this._onPasswordChanged.bind(this);
        this._onCancel = this._onCancel.bind(this);
        this._onSubmit = this._onSubmit.bind(this);


    }

    // eslint-disable-next-line require-jsdoc
    componentDidMount() {
        let globalstate = APP.store.getState()['features/base/conference'];

        if (globalstate.beforePasswordCorrect === true && globalstate.beforeEnteredPassword !== '') {
            // 비밀번호가 맞으면 자동으로 입력하고 제출

            this.setState({ password: globalstate.beforeEnteredPassword,
                isPasswordCorrect: true });

        }
    }

    // eslint-disable-next-line require-jsdoc
    componentDidUpdate(prevProps: any, prevState: { isPasswordCorrect: any; }) {

        let globalstate = APP.store.getState()['features/base/conference'];

        if (globalstate.beforePasswordCorrect === true && globalstate.beforeEnteredPassword !== '' && !prevState.isPasswordCorrect) {

            if (this.inputRef.current) {
                this.inputRef.current.value = globalstate.beforeEnteredPassword;
            }
            setTimeout(() => {
                const submitButton = document.getElementById('modal-dialog-ok-button');

                if (submitButton) {
                    submitButton.click();
                }
            }, 0);

        }
    }

    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        return (
            <Dialog
                disableBackdropClose = { true }
                onCancel = { this._onCancel }
                onSubmit = { this._onSubmit }
                //submitDisabled = { this.props.passwordErrorCount >= 5 ? true:false}
                titleKey = 'dialog.passwordRequired'>
                { this._renderBody() }
            </Dialog>
        );
    }

    /**
     * Display component in dialog body.
     *
     * @returns {ReactElement}
     * @protected
     */
    _renderBody() {
        return (
            <div>
                <Input
                    ref={this.inputRef}
                    autoFocus = { true }
                    className = 'dialog-bottom-margin'
                    id = 'required-password-input'
                    label = { this.props.t('dialog.passwordLabel') }
                    name = 'lockKey'
                    onChange = { this._onPasswordChanged }
                    type = 'password'
                    disabled = { this.props.passwordErrorCount >= 5 }
                    value = { this.state.password } />
                    <p className = 'description'>오류횟수 : {this.props.passwordErrorCount} { this.props.passwordErrorCount > 2 ? ' (5회 이상 틀리면 재접속이 필요합니다.)' : '' }</p>
            </div>
        );
    }

    /**
     * Notifies this dialog that password has changed.
     *
     * @param {string} value - The details of the notification/event.
     * @private
     * @returns {void}
     */
    _onPasswordChanged(value: string) {
        this.setState({
            password: value
        });

    }

    /**
     * Dispatches action to cancel and dismiss this dialog.
     *
     * @private
     * @returns {boolean}
     */
    _onCancel() {

        this.props.dispatch(
            _cancelPasswordRequiredPrompt(this.props.conference));

        return true;
    }

    /**
     * Dispatches action to submit value from this dialog.
     *
     * @private
     * @returns {boolean}
     */
    _onSubmit() {
        const { conference } = this.props;

        // We received that password is required, but user is trying anyway to
        // login without a password. Mark the room as not locked in case she
        // succeeds (maybe someone removed the password meanwhile). If it is
        // still locked, another password required will be received and the room
        // again will be marked as locked.
        this.props.dispatch(
            setPassword(conference, conference.join, this.state.password));

        //setBeforeEnteredPassword(this.state.password);

        let globalstate = APP.store.getState()['features/base/conference'];

        globalstate.beforeEnteredPassword = this.state.password;

        // We have used the password so let's clean it.
        this.setState({
            password: undefined
        });

        return true;
    }
    // eslint-disable-next-line require-jsdoc
    _onAutoSubmit() {
        const { conference } = this.props;

        const globalstate = APP.store.getState()['features/base/conference'];

        this.setState({
            password: globalstate.beforeEnteredPassword
        });

        // We received that password is required, but user is trying anyway to
        // login without a password. Mark the room as not locked in case she
        // succeeds (maybe someone removed the password meanwhile). If it is
        // still locked, another password required will be received and the room
        // again will be marked as locked.
        this.props.dispatch(
            setPassword(conference, conference.join, globalstate.beforeEnteredPassword));

        // We have used the password so let's clean it.
        this.setState({
            password: undefined
        });

        return true;
    }
}

export default translate(connect()(PasswordRequiredPrompt));
