// @flow

import React, { Component, useState, useEffect } from 'react';

import { translate } from '../../../../base/i18n/functions';

type Props = {
    status: string,
    onSubmit: Function,
    certificationCode: string

};

// type State = {
//     enteredCertificationCode: string
// };

function CertificationForm(props:any) {
    const status = props.status;
    const setStatus = props.setStatus;
    const onSubmit = props.onSubmit;
    let enteredCertificationCode = props.certificationCode;

    const [minutes, setMinutes] = useState(5);
    const [seconds, setSeconds] = useState(0);

    useEffect(() => {
        //const countdown;
        
        const countdown = setInterval(() => {
            if(status === "sendCode" || status === "notVerified") {
                if (seconds > 0) {
                    setSeconds(seconds - 1);
                }
                if (seconds === 0) {
                    if (minutes === 0) {
                        setStatus("timeout");
                        clearInterval(countdown);
                    } else {
                        setMinutes(minutes - 1);
                        setSeconds(59);
                    }
                }
            }             
        }, 1000);
        
        return () => clearInterval(countdown);
    }, [minutes, seconds, status]);

    function _renderTimeLimit() {
        if (status === "sendCode" || status === "notVerified"){
            
            //setPasswordEditEnabled(true);
            return (
                <>
                    {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
                </>
            );
        }
        else { // verified
            return null;
        }
    }

    function _onEnteredCertificaionCodeChange(event:any) {
        enteredCertificationCode = event.target.value;
    }

    function _onCertificationCodeSubmit(event:any) {
        event.preventDefault();
        event.stopPropagation();

        onSubmit(enteredCertificationCode);
    }

    function _onKeyDown(event:any) {
        if (event.key === 'Enter') {
            event.stopPropagation();
        }
    }

    function _renderCertificaionCodeField() {
        if (status != "locked") {
            // 활성화 되어있으면
            let digitPattern, placeHolderText;
            placeHolderText = '인증번호 입력';

            // if (this.props.passwordNumberOfDigits) {
            //     placeHolderText = this.props.t('passwordDigitsOnly', {
            //         number: this.props.passwordNumberOfDigits });
            //     digitPattern = '\\d*';
            // }

            return (
                <form
                    className = 'info-password-form'
                    onKeyDown = { _onKeyDown }
                    onSubmit = { _onCertificationCodeSubmit }>
                    <input
                        autoFocus = { true }
                        className = 'info-password-input'
                        //maxLength = { this.props.passwordNumberOfDigits }
                        onChange = { _onEnteredCertificaionCodeChange }
                        //pattern = { digitPattern }
                        placeholder = { placeHolderText }
                        spellCheck = { 'false' }
                        type = 'text'
                        value = { enteredCertificationCode } />
                </form>
            );
        } else {
            // 비활성화 되어있으면 값 없음
            return (
                <div className = 'info-password-local'>
                </div>
            );
        }
    }

    return (
        <div className = 'info-password'>
            <span className = 'info-label'>
                인증번호
            </span>
            <span className = 'spacer'>&nbsp;</span>
            <span className = 'info-password-field info-value'>
                { _renderCertificaionCodeField() }
            </span>
            <span className = 'info-label'>&nbsp;&nbsp;
            { _renderTimeLimit() }
            </span>
        </div>
    );
}

// class CertificationForm extends Component<Props, State> {

//     state = {
//         enteredCertificationCode: this.props.certificationCode
//     };

//     constructor(props: Props) {
//         super(props);

//         // Bind event handlers so they are only bound once per instance.
//         this._onEnteredCertificaionCodeChange = this._onEnteredCertificaionCodeChange.bind(this);
//         this._onCertificationCodeSubmit = this._onCertificationCodeSubmit.bind(this);
//         this._onKeyDown = this._onKeyDown.bind(this);
//         this.state.enteredCertificationCode = this.props.certificationCode;
//     }

    // render() {
    //     const { t } = this.props;

    //     return (
    //         <div className = 'info-password'>
    //             <span className = 'info-label'>
    //                 인증번호
    //             </span>
    //             <span className = 'spacer'>&nbsp;</span>
    //             <span className = 'info-password-field info-value'>
    //                 { this._renderCertificaionCodeField() }
    //             </span>
    //         </div>
    //     );
    // }

    

    

    // _onEnteredCertificaionCodeChange: (Object) => void;

    // _onEnteredCertificaionCodeChange(event) {
    //     this.setState({ enteredCertificationCode: event.target.value });
    // }

    // _onCertificationCodeSubmit: (Object) => void;

    // _onCertificationCodeSubmit(event) {
    //     event.preventDefault();
    //     event.stopPropagation();

    //     this.props.onSubmit(this.state.enteredCertificationCode);
    // }

    // _onKeyDown: (Object) => void;

    // _onKeyDown(event) {
    //     if (event.key === 'Enter') {
    //         event.stopPropagation();
    //     }
    // }
//}

export default translate(CertificationForm);
