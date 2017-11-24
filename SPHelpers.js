'use strict';
var Scion;

Scion = function (Scion) {
    var OnSPReady;

    Scion.Globals = {
        curUser: null
    };

    Scion.Strings = {
        empDetails: 'Employee details',
        ppList: 'Passport requisition',
        alQuery: '',
        mlQuery: '',
        ppQuery: "<View>\
                      <Query>\
                          <Where>\
                            <Eq>\
                              <FieldRef Name='Employee_x0020_Name' LookupId='TRUE' />\
                              <Value Type='Lookup'>{ID}</Value>\
                            </Eq>\
                          </Where>\
                      </Query>\
                    </View>",
        toQuery: ''
    };

    Scion.ListOps = function () {
        var query = '',
                getSPListItems,
                getQueryStringValue;

        /// Summary: Method to get query string parameters.
        /// Parameters:
        /// key: Query string parameter to be fetched.
        getQueryStringValue = function (key) {
            JSRequest.EnsureSetup();
            return decodeURIComponent(JSRequest.QueryString[key]);
        };

        /// Summary : Method to retrieve all items from the tasks list.
        /// Parameters :
        /// listName : Title of the list from which data needs to be retrieved.
        getSPListItems = function (listName, query) {
            var deferred = $.Deferred(),
                clientContext,
                oList,
                camlQuery;

            Scion.Processing.startLoading();
            clientContext = new SP.ClientContext.get_current();
            oList = clientContext.get_web().get_lists().getByTitle(listName);
            Scion.Globals.curUser = clientContext.get_web().get_currentUser();

            camlQuery = new SP.CamlQuery();
            camlQuery.set_viewXml(query);

            this.listItemCollection = oList.getItems(camlQuery);

            clientContext.load(Scion.Globals.curUser);
            clientContext.load(this.listItemCollection);

            clientContext.executeQueryAsync(
                Function.createDelegate(this, function () {
                    Scion.Processing.endLoading();
                    deferred.resolve(this.listItemCollection);
                }),
                Function.createDelegate(this, function (sender, args) {
                    Scion.Processing.endLoading();
                    deferred.reject(sender, args);
                })
            );

            return deferred.promise();
        };

        return {
            getQueryStringValue: getQueryStringValue,
            getListItems: getSPListItems
        }
    };

    Scion.Forms = function () {
        var annualLeaveForm = '',
            medicalLeaveForm = '',
            passPortReqForm = '',
            timeOffForm = '',
            formName = '',
            query = '',
            initialize,
            populateForms;

        populateForms = function () {
            var formName = getForm(),
                listOps;
            switch (formName) {
                case 'ALForm':
                    break;

                case 'MLForm':
                    break;

                case 'TOForm':
                    break;

                case 'PPForm':
                    query = Scion.Strings.ppQuery.replace('{ID}', _spPageContextInfo.userId);

                    new Scion.ListOps().getListItems(Scion.Strings.empDetails, query).done(function (listItemColl) {
                        if (listItemColl !== null && listItemColl.get_count() > 0) {
                            var listItemEnumerator = listItemColl.getEnumerator(),
                                oListItem,
                                reptTo,
                                secondApprover,
                                thirdApprover,
                                dept,
                                a;

                            while (listItemEnumerator.moveNext()) {
                                oListItem = listItemEnumerator.get_current();
                                reptTo = (oListItem.get_item("Reportingto") != null) ? oListItem.get_item("Reportingto").get_email() : null;
                                secondApprover = (oListItem.get_item("Approver2") != null) ? oListItem.get_item("Approver2").get_email() : null;
                                thirdApprover = (oListItem.get_item("Approver3") != null) ? oListItem.get_item("Approver3").get_email() : null;
                                dept = (oListItem.get_item("Department") != null) ? oListItem.get_item("Department").get_lookupId() : null;

                                try { a = typeof SPClientPeoplePicker; } catch (e) { a = "undefined"; }
                                EnsureScript("clientpeoplepicker.js", a, function () {
                                    populateUser('Employee_x0020_Name_', _spPageContextInfo.userLoginName);
                                    if (reptTo != null) {
                                        populateUser('First_x0020_approver_', reptTo);
                                    }

                                    if (secondApprover != null) {
                                        populateUser('Second_x0020_approver_', secondApprover);
                                    }

                                    if (thirdApprover != null) {
                                        populateUser('HR_', thirdApprover);
                                    }
                                });

                                selectDepartment("Department_", dept);
                            }
                        }
                    });
                    break;

                default: break;
            }

            function populateUser(fldName, loginName) {
                var pickerElem = $("div[id^='" + fldName + "'].sp-peoplepicker-topLevel"),
                    editorElem = pickerElem.find(".sp-peoplepicker-editorInput"),
                    topSpanKey = pickerElem.attr('id'),
                    peoplePicker,
                    usrObj;

                editorElem.css({ 'display': 'none' });
                peoplePicker = SPClientPeoplePicker.SPClientPeoplePickerDict[topSpanKey];

                if (typeof peoplePicker == "undefined" || peoplePicker === null) { return; }

                usrObj = { 'Key': loginName };
                peoplePicker.AddUnresolvedUser(usrObj, true);
                $(".sp-peoplepicker-delImage").css({ 'display': 'none' });
            };

            function getForm() {
                var reqPath = _spPageContextInfo.serverRequestPath;

                if (reqPath.indexOf('/PASSPORTREQUISITION/') > -1) {
                    return 'PPForm';
                }

                return '';
            }

            function selectDepartment(fldName, value) {
                var selectedElem = $("select[id^='" + fldName + "'] option[value='" + value + "']");
                selectedElem.prop("selected", "true");
                selectedElem.attr("selected", "selected");
                $("select[id^='" + fldName + "']").attr("disabled", true);
            }
        };

        initialize = function () {

            populateForms();
        }

        return {
            initialize: initialize
        }
    };

    Scion.Processing = {
        loading: null,
        startLoading: function () {
            SP.SOD.executeFunc('sp.ui.dialog.js', 'SP.UI.ModalDialog', function () {
                Scion.Processing.loading = SP.UI.ModalDialog.showWaitScreenWithNoClose('', 'Processing...');
            });
        },
        endLoading: function () { try { Scion.Processing.loading.close(); Scion.Processing.loading = null; } catch (ex) { } }
    };

    function OnSPReady() {
        ExecuteOrDelayUntilScriptLoaded(
            ExecuteOrDelayUntilScriptLoaded(function () {
                Scion.Forms().initialize();
            },
            "sp.js"),
        "sp.core.js");
    }

    return {
        OnSPReady: OnSPReady
    }
}(Scion = Scion || {});

_spBodyOnLoadFunctionNames.push("Scion.OnSPReady");