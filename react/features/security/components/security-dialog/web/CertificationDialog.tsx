// @flow

import React, { useState, useCallback } from 'react';
import Dialog from '../../../../base/ui/components/web/Dialog';
import CertificationSection from './CertificationSection';
import { useDispatch } from 'react-redux';
import { CloseCertificationAndOpenSecurityDialog } from '../../../actions';
import { createAndSendCertificationCode, verifyCertificationCode } from '../../../functions';

import { toggleDialog } from '../../../../base/dialog/actions';
import  SecurityDialog  from './SecurityDialog';

import { connect } from 'react-redux';

/**
 * Component that renders the security options dialog.
 *
 * @returns {React$Element<any>}
 */
function CertificationDialog(props) {
    // 상태정보 : locked, getCode, verified, notVerified
    const [ status, setStatus ] = useState("locked");
    //const [ certificationCodeEditEnabled, setCertificationCodeEditEnabled ] = useState(false);

    const dispatch = useDispatch();
    // const _getCertificationCode = useCallback(() => dispatch(getCertificationCode(), [ dispatch ]));
    // const _verifyCertificationCode = useCallback(() => dispatch(verifyCertificationCode(), [ dispatch ]));
    const onClose = useCallback(() => dispatch(_onClose()), [ dispatch ]);
    const onNext = useCallback(() => dispatch(CloseCertificationAndOpenSecurityDialog()), [ dispatch ]);

    //const toggleSecurityDialog = props.toggleSecurityDialog;

    return (
        <Dialog
            //cancelDisabled = { status === "verified" ? false : true }        // verified가 되면 팝업을 쉽게 닫을 수 있도록 cancel을 활성화
            //submitDisabled = { status === "verified" ? false : false }        // verified가 되기 전에 '닫기' 버튼 누르면 초기화면으로 이동
            ok = { {translationKey : status === "verified" ? '비밀번호 설정' : 'dialog.close'}}
            //cancelKey = 'dialog.close'
            onSubmit = { status === "verified" ? onNext : onClose }
            //onCancel = { _onCancel }
            hideCloseButton = { status === "verified" ? true : true }
            titleKey = '사용자 계정 잠김'
            size = { 'medium' }>
            <div className = 'security-dialog'>
                <CertificationSection
                    //certificationCodeEditEnabled = { certificationCodeEditEnabled }
                    //setCertificationCodeEditEnabled = { setCertificationCodeEditEnabled }
                    status = { status }
                    setStatus = { setStatus }
                    createAndSendCertificationCode = { createAndSendCertificationCode }
                    verifyCertificationCode = { verifyCertificationCode } />
            </div>
        </Dialog>
    );
}

function _onClose() {
    document.location.href = window.location.protocol + "//" + window.location.hostname;
    return true;
}

// function _onNext(props) {
//     const dispatch = useDispatch();
//     const toggleSecurityDialog = props.toggleSecurityDialog;
//     dispatch(toggleSecurityDialog());
//     return true;
// }

// function mapStateToProps(state) {
//     return null;
// }
// const mapDispatchToProps = { toggleSecurityDialog: toggleSecurity };

//export default connect(mapStateToProps, mapDispatchToProps)(CertificationDialog);
export default CertificationDialog;