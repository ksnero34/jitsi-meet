/* eslint-disable react/no-multi-comp */
// @flow

import React, { useRef, useState, useEffect } from 'react';

import { translate } from '../../../../base/i18n/functions';

import CertificationForm from './CertificationForm';

type Props = {
    status: String,
    setStatus: Function,
    //certificationCodeEditEnabled: boolean,
    //setCertificationCodeEditEnabled: Function,
    getCertificationCode: Function,
    verifyCertificationCode: Function
};

/**
 * Component that handles the password manipulation from the invite dialog.
 *
 * @returns {React$Element<any>}
 */
// function CertificationSection({
//     certificationCodeEditEnabled,
//     setCertificationCodeEditEnabled,
//     getCertificationCode,
//     verifyCertificationCode }: Props) {

function CertificationSection(props) {
    const status = props.status;
    const setStatus = props.setStatus;
    const createAndSendCertificationCode = props.createAndSendCertificationCode;
    const verifyCertificationCode = props.verifyCertificationCode;
    const formRef = useRef<HTMLDivElement>(null);

    async function _createAndSendCertificationCode() {
        if(await createAndSendCertificationCode()) {
            // 발송 성공
            console.log("@@@@setStatus - sendCode");
            setStatus("sendCode");
        }
        else {
            // 발송 실패
            console.log("@@@@setStatus - sendCodeFail");
            setStatus("sendCodeFail");
        }
    }

    async function _verifyCertificationCode() {
        if (formRef.current) {
            const { value } = formRef.current.querySelector('form > input');
            if(await verifyCertificationCode(value)) {
                // 인증 성공
                setStatus("verified");
            }
            else {
                // 인증 실패
                setStatus("notVerified");
            }
        }
    }

    function renderCertificationActions() {
        // 인증번호를 보내지 않은 상태이면
        if (status === "locked" || status === "sendCodeFail") {
            return (
                <>
                    <a
                        className = 'remove-password'
                        onClick = { _createAndSendCertificationCode }>인증번호 발송</a>
                </>
            );
        }
        // 인증번호를 보낸 상태면
        else if (status === "sendCode" || status === "notVerified") {
            return (
                <>
                    <a onClick = { _verifyCertificationCode }>인증</a>
                </>
            );
        }
        // 인증 완료 상태면
        else if (status === "verified") { // verified
            return (
                <>
                    인증 완료
                </>
            );
        }
        else { // timeout
            return (
                <>
                    시간 초과
                </>
            );
        }
    }

    /**
     * Method that renders the password action(s) based on the current
     * locked-status of the conference.
     *
     * @returns {React$Element<any>}
     */
     function renderComment() {
        if (status === "sendCode"){
            return (
                <p className = 'description2'>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;메신저 알림으로 인증번호가 발송되었습니다.
                </p>
            );
        }
        else if (status === "sendCodeFail"){
            return (
                <p className = 'description2'>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;인증코드 발송에 실패했습니다. 다시 시도하십시오.
                </p>
            );
        }
        else if (status === "notVerified"){
            return (
                <p className = 'description2'>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;틀린 인증번호 입니다.
                </p>
            );
        }
        else if (status === "timeout") {
            return (
                <p className = 'description2'>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;인증 가능시간을 초과했습니다.
                </p>
            );
        }
        else if (status === "verified") {
            return (
                <p className = 'description2'>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;인증이 완료되었습니다.
                </p>
            );
        }
        else {
            return (
                <p className = 'description2'>
                    &nbsp;
                </p>
            );
        }
    }

    return (
        <div className = 'security-dialog password-section'>
            <p className = 'description'>
                마지막 교육 생성일로부터 30일이 초과 되었습니다. 인증번호 확인을 통해 잠김 계정을 해제하십시오.
            </p>
            <div className = 'security-dialog password'>
                <div
                    className = 'info-dialog info-dialog-column info-dialog-password'
                    ref = { formRef }>
                    <CertificationForm
                        status = { status }
                        setStatus = { setStatus }
                        onSubmit = { verifyCertificationCode } />
                </div>
                <div className = 'security-dialog password-actions'>
                    { renderCertificationActions() }
                </div>
            </div>
            { renderComment() }
        </div>
    );
}

export default translate(CertificationSection);
