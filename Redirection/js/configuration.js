/*jshint nomen: false */
/*global jQuery, SP, setTimeout, ExecuteOrDelayUntilScriptLoaded, Type, window,
document, ScriptLink */

(function () {
    'use strict';
    Type.registerNamespace('ScriptLink');

    ScriptLink.scriptLinkInfo = [];

    ScriptLink.scriptLinkConstants = {
        Title: 'Redirection',
        FileName: 'redirection.js',
        FilePath: '/sites/communityengagement/funding/SiteAssets/redirection/js/redirection.js?v=' + Date.now(),
        notificationMessages: {
            addCustomActionSuccMsg: 'Redirection Activated',
            addCustomActionErrMsg: 'Redirection Activation Failed',
            removeCustomActionSuccMsg: 'Redirection Deactivated',
            removeCustomActionErrMsg: 'Redirection Deactivation Failed',
            getAllActionsErrMsg: 'Script Link Information Retrieval Failed'
        }
    };

    ScriptLink.preloader = {
        loading: null,
        // Summary: Method for showing the loading preloader animation.
        // Parameters: None
        startLoading: function () {
            var funThis = this;
            function start() {
                window.self.Strings = {};
                window.self.Strings.STS = {};
                window.self.Strings.STS.L_SPClientPeoplePickerWaitImgAlt = '';
                funThis.loading = SP.UI.ModalDialog
                    .showWaitScreenWithNoClose('', 'Processing...');
            }
            if (this.loading === null) {
                ExecuteOrDelayUntilScriptLoaded(start, 'sp.ui.dialog.js');
            }
        },
        // Summary: Method for closing the loading preloader animation.
        // Parameters: None
        endLoading: function () {
            if (this.loading !== null) {
                this.loading.close();
                this.loading = null;
            }
        }
    };

    // Summary: Method for showing notifications.
    // Parameters:
    //      msg: Notification message to be shown.
    ScriptLink.showNotification = function (msg) {
        var notifyId = SP.UI.Notify.addNotification(msg, true);
        setTimeout(function () {
            SP.UI.Notify.removeNotification(notifyId);
        }, 3000);
    };

    // Summary: Method for linking a JS file to the masterpage.
    // Parameters:
    //      title: Title of the script link.
    //      scriptPath: Path of the script file.
    ScriptLink.addCustomAction = function () {
        ScriptLink.preloader.startLoading();
        var _ctx = SP.ClientContext.get_current(),
            oWeb = _ctx.get_web(),
            oCustActions = oWeb.get_userCustomActions(),
            newUserCustomAction = oCustActions.add();
        newUserCustomAction.set_location('ScriptLink');
        newUserCustomAction.set_scriptBlock('RegisterSod("' +
                ScriptLink.scriptLinkConstants.FileName + '","' +
                ScriptLink.scriptLinkConstants.FilePath + '");' +
                'SP.SOD.executeFunc("' + ScriptLink.scriptLinkConstants
            .FileName + '", null, null);');
        newUserCustomAction.set_title(ScriptLink.scriptLinkConstants.Title);
        newUserCustomAction.set_sequence(1000);
        newUserCustomAction.update();

        function addCustomActionSuccess() {
            ScriptLink.preloader.endLoading();
            ScriptLink.showNotification(ScriptLink.scriptLinkConstants
                .notificationMessages.addCustomActionSuccMsg);
            setTimeout(function () {
                window.location.reload();
            }, 1000);
        }
        function addCustomActionError(sender, args) {
            sender = sender;
            ScriptLink.preloader.endLoading();
            ScriptLink.showNotification(ScriptLink.scriptLinkConstants
                .notificationMessages.addCustomActionErrMsg + 'because ' +
                        args.get_message());
        }
        _ctx.executeQueryAsync(addCustomActionSuccess, addCustomActionError);
    };

    // Summary: Method for unlinking a JS file from the masterpage.
    // Parameters:
    //      title: Title of the script link.
    ScriptLink.removeCustomAction = function () {
        ScriptLink.preloader.startLoading();
        var _ctx = SP.ClientContext.get_current(),
            oWeb = _ctx.get_web(),
            oCustActions = oWeb.get_userCustomActions();
        _ctx.load(oCustActions);

        function removeCustomActionSuccess() {
            function pendingSuccess() {
                ScriptLink.preloader.endLoading();
                ScriptLink.showNotification(ScriptLink.scriptLinkConstants
                    .notificationMessages.removeCustomActionSuccMsg);
                setTimeout(function () {
                    window.location.reload();
                }, 1000);
            }
            function pendingError(sender, args) {
                sender = sender;
                ScriptLink.preloader.endLoading();
                ScriptLink.showNotification(ScriptLink.scriptLinkConstants
                    .notificationMessages.removeCustomActionErrMsg +
                            'because ' + args.get_message());
            }
            if (oCustActions !== null && oCustActions.get_count() > 0) {
                var actionEnum = oCustActions.getEnumerator(),
                    objToDelete = null,
                    curAction = null;
                while (actionEnum.moveNext()) {
                    curAction = actionEnum.get_current();

                    if (curAction.get_title() === ScriptLink
                        .scriptLinkConstants.Title) {
                        objToDelete = curAction;
                        break;
                    }
                }
                objToDelete.deleteObject();
                if (_ctx.get_hasPendingRequest()) {
                    _ctx.executeQueryAsync(pendingSuccess, pendingError);
                }
            }
        }
        function removeCustomActionError(sender, args) {
            sender = sender;
            ScriptLink.preloader.endLoading();
            ScriptLink.showNotification(ScriptLink.scriptLinkConstants
                .notificationMessages.removeCustomActionErrMsg +
                        'because ' + args.get_message());
        }
        _ctx.executeQueryAsync(removeCustomActionSuccess,
                removeCustomActionError);
    };

    // Summary: Method for getting the details of all script links
    // Parameters: None
    ScriptLink.getAllActions = function () {
        var _ctx = SP.ClientContext.get_current(),
            oWeb = _ctx.get_web(),
            oCustActions = oWeb.get_userCustomActions(),
            actionEnum = null,
            curAction = null;
        _ctx.load(oCustActions);

        function getAllActionsSuccess() {
            if (oCustActions !== null && oCustActions.get_count() > 0) {
                actionEnum = oCustActions.getEnumerator();
                while (actionEnum.moveNext()) {
                    curAction = actionEnum.get_current();
                    ScriptLink.scriptLinkInfo.push(curAction.get_title());
                }
            }
            ScriptLink.verifyStatus();
        }
        function getAllActionsError(sender, args) {
            sender = sender;
            ScriptLink.verifyStatus();
            ScriptLink.showNotification(ScriptLink.scriptLinkConstants
                .notificationMessages.getAllActionsErrMsg + 'because ' +
                        args.get_message());
        }
        _ctx.executeQueryAsync(getAllActionsSuccess, getAllActionsError);
    };

    // Summary: Method for checking whether the script link is already linked.
    // Parameters: None
    ScriptLink.verifyStatus = function () {
        var btnHandle = jQuery('#btnWrapper');
        if (jQuery.inArray(ScriptLink.scriptLinkConstants.Title,
                ScriptLink.scriptLinkInfo) >= 0) {
            btnHandle.html('<button type="button" id="deactBtn">' +
                    'Deactivate</button>');
            jQuery('#deactBtn').click(ScriptLink.removeCustomAction);
        } else {
            btnHandle.html('<button type="button" id="actBtn">' +
                    'Activate</button>');
            jQuery('#actBtn').click(ScriptLink.addCustomAction);
        }
        ScriptLink.preloader.endLoading();
    };

    jQuery(document).ready(function () {
        ScriptLink.preloader.startLoading();
        SP.SOD.executeOrDelayUntilScriptLoaded(ScriptLink
            .getAllActions, 'sp.js');
    });
}());