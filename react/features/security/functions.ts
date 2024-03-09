// @flow

import { setPassword } from '../base/conference/actions';

export function setRandomPassword(conference:any, dispatch:any, stateful:any) {
    dispatch(setPassword(conference, conference.lock, Math.random().toString(36).substr(2,8)));
}

// export async function isValidCookie() {
//     const response = await fetch('/api/check-cookie.json');
//     const text = await response.text();
//     if(text === 'true') {
//         return true;
//     }
//     else {
//         return false;
//     }
// }

// export async function authenticateAccount() {
//     const response = await fetch("/api/v1/authentication/account", {
//         method: "POST",
//         headers: {
//             'Content-type': 'application/json'
//         }
//     });
//     const status = response.status;
//     const json = await response.json();

//     if(status === 200) {    // 최초 접속 또는 30일 이내 접속
//         console.log("@@@@authenticateAccount response - json : " + json);
//         console.log("@@@@authenticateAccount response - json.message : " + json.message);
//         console.log("@@@@authenticateAccount response - json.data : " + json.data);
//         console.log("@@@@authenticateAccount response - json.data.stfNo : " + json.data.stfNo);
//         if(json.data.stfNo !== null && json.data.stfNo !== '') {
//             console.log("@@@@authenticateAccount stfNo : " + json.data.stfNo);
//             // 전역변수에 사번 설정
//             APP.conference.stfNo = json.data.stfNo;
//         }
//         return "SUCCESS";
//     }
//     else if(status === 401) {   // 30일 초과 미접속으로 계정 잠금 상태
//         console.log("@@@@authenticateAccount response - json : " + json);
//         console.log("@@@@authenticateAccount response - json.message : " + json.message);
//         console.log("@@@@authenticateAccount response - json.data : " + json.data);
//         console.log("@@@@authenticateAccount response - json.data.stfNo : " + json.data.stfNo);
//         if(json.data.stfNo !== null && json.data.stfNo !== '') {
//             console.log("@@@@authenticateAccount stfNo : " + json.data.stfNo);
//             // 전역변수에 사번 설정
//             APP.conference.stfNo = json.data.stfNo;
//         }
//         return "LOCKED";
//     }
//     else {
//         console.log("@@@@authenticateAccount response - FAIL");
//         console.log("@@@@authenticateAccount response - json : " + json);
//         console.log("@@@@authenticateAccount response - json.message : " + json.message);
//         console.log("@@@@authenticateAccount response - json.data : " + json.data);
//         console.log("@@@@authenticateAccount response - json.data.stfNo : " + json.data.stfNo);
//         return "FAIL";
//     }
// }

export async function authenticateAccount() {
    const response = await fetch("/api/v1/authentication/account", {
        method: "POST",
        headers: {
            'Content-type': 'application/json'
        }
    });
    return response;
}

export async function createAndSendCertificationCode() {
    console.log("@@@@authenticateAccount APP.conference.stfNo : " + APP.conference.stfNo);
    const response = await fetch("/api/v1/authentication/certification?stfNo=" + APP.conference.stfNo, {
        method: "POST",
        headers: {
          'Content-type': 'application/json'
        }
        , body: JSON.stringify({
            //stfNo: APP.conference.stfNo
        })
    });
    const status = response.status;
    const json = await response.json();

    if(status === 200) {
        console.log("@@@@authenticateAccount response - json : " + json);
        console.log("@@@@createAndSendCertificationCode response - json.message : " + json.message);
        console.log("@@@@createAndSendCertificationCode response - json.data : " + json.data);
        console.log("@@@@createAndSendCertificationCode response - json.data.stfNo : " + json.data.stfNo);
        return true;
    }
    else {
        // 403 FORBIDDEN, 502 BAD GATEWAY
        // 사번과 SSO 인증토큰 불일치
        console.log("@@@@authenticateAccount response - json : " + json);
        console.log("@@@@createAndSendCertificationCode response - json.message : " + json.message);
        console.log("@@@@createAndSendCertificationCode response - json.data : " + json.data);
        console.log("@@@@createAndSendCertificationCode response - json.data.stfNo : " + json.data.stfNo);
        return false;

    }
}

export async function verifyCertificationCode(code:any) {
    const response = await fetch("/api/v1/authentication/certification?stfNo=" + APP.conference.stfNo + "&code=" + code.value, {
        method: "PUT",
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify({
            // stfNo: APP.conference.stfNo,
            // code: code
        })
    });
    const status = response.status;
    const json = await response.json();

    if(status === 200) {
        console.log("@@@@authenticateAccount response - json : " + json);
        console.log("@@@@createAndSendCertificationCode response - json.message : " + json.message);
        console.log("@@@@createAndSendCertificationCode response - json.data : " + json.data);
        console.log("@@@@createAndSendCertificationCode response - json.data.stfNo : " + json.data.stfNo);
        return true;
    }
    else {
        // 403 FORBIDDEN, 502 BAD GATEWAY
        // 사번과 SSO 인증토큰 불일치
        console.log("@@@@authenticateAccount response - json : " + json);
        console.log("@@@@createAndSendCertificationCode response - json.message : " + json.message);
        console.log("@@@@createAndSendCertificationCode response - json.data : " + json.data);
        console.log("@@@@createAndSendCertificationCode response - json.data.stfNo : " + json.data.stfNo);
        return false;
    }
}