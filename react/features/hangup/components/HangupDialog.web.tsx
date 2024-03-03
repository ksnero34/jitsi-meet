import React, { Component } from 'react';
//import { Dialog } from '../../base/dialog/reducer';
import Dialog from '../../base/ui/components/web/Dialog';

/**
 * Implements a React {@link Component} which displays the component
 * {@code VideoQualitySlider} in a dialog.
 *
 * @extends Component
 */
export default class HangupDialog extends Component {
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        return (
            <Dialog
                //cancelKey = 'dialog.confirmNo'
                ok = {{ translationKey:'dialog.confirmYes'}}
                //onCancel = { this._onCancel }
                onSubmit = { this._onSubmit }
                //titleKey = 'liveStreaming.start'
                titleKey = "화상교육 종료"
                size = { 'medium' }>
                <div className = 'live-stream-dialog'>
                    화상교육을 종료하시겠습니까?
                </div>
            </Dialog>
        );
    }

    //_onSubmit: () => void;

    _onSubmit() {
        //document.location.href = "https://meet.hwgeneralins.com/";
        //document.location.href = getURLWithoutParams(getInviteURL(APP.store.getState()));
        document.location.href = window.location.protocol + "//" + window.location.hostname;
        
    }
}
