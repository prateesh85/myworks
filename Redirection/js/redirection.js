(function () {
    'use strict';
    Type.registerNamespace('EY.Redirection');

    EY.Redirection.CONSTANTS = {
        MIGRATION_GROUP_NAME: 'communityengagement Owners',
        REDIRECTION_PAGE_URL: 'https://internal.ey.net/sites/communityengagement/funding/SitePages/Site_Maintenance.aspx',
        REDIRECTION_PAGE_NAME: 'DownTime',
        DISCLAIMER_PAGE_NAME: 'Disclaimer',
        PREFERENCE_PAGE_NAME: 'Preferences',
        CONFIGURATION_PAGE_NAME: 'Configuration',
        SITEMAINTANENCE_PAGE_NAME: 'Site_Maintenance'
    };

    EY.Redirection.checkGroupMembership = function (groupName, callBackFunc) {
        function isCurrentUserMemberOfGroup(groupName, onComplete) {
            var currentContext = new SP.ClientContext.get_current();
            var currentWeb = currentContext.get_web();

            var currentUser = currentContext.get_web().get_currentUser();
            currentContext.load(currentUser);

            var allGroups = currentWeb.get_siteGroups();
            currentContext.load(allGroups);

            var group = allGroups.getByName(groupName);
            currentContext.load(group);

            var groupUsers = group.get_users();
            currentContext.load(groupUsers);

            currentContext.executeQueryAsync(onSuccess, onFailure);

            function onSuccess(sender, args) {
                var userInGroup = false;
                var groupUserEnumerator = groupUsers.getEnumerator();
                while (groupUserEnumerator.moveNext()) {
                    var groupUser = groupUserEnumerator.get_current();
                    if (groupUser.get_id() == currentUser.get_id()) {
                        userInGroup = true;
                        break;
                    }
                }
                onComplete(userInGroup);
            }
            function onFailure(sender, args) {
                onComplete(null);
            }
        }
        ExecuteOrDelayUntilScriptLoaded(function () {
            if (groupName !== "") {
                isCurrentUserMemberOfGroup(groupName, callBackFunc);
            }
        }, 'sp.js');
    };

    EY.Redirection.initialize = function () {
        var pageUrl = window.location.href;

        if ((pageUrl.indexOf('SiteAssets') === -1) && (pageUrl.indexOf(EY.Redirection.CONSTANTS.CONFIGURATION_PAGE_NAME) === -1) && (pageUrl.indexOf(EY.Redirection.CONSTANTS.SITEMAINTANENCE_PAGE_NAME) === -1)) {
            EY.Redirection.checkGroupMembership(EY.Redirection.CONSTANTS.MIGRATION_GROUP_NAME, function (presenceFlag) {
                // for all non-admin users
                if ((presenceFlag !== null) && !presenceFlag) {
                    window.location = EY.Redirection.CONSTANTS.REDIRECTION_PAGE_URL;
                }
            });
        }
    };

    // $(document).ready(EY.Redirection.initialize);
    EY.Redirection.initialize();

}());