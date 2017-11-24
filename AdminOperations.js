// JavaScript source code

(function () {
    'use strict';
    Type.registerNamespace('EYC');

    EYC.Constants = {
        loading: null,
        enableDebugMode: false
    };

    EYC.AdminOps = function () {

        /// Summary: Method to get query string parameters.
        /// Parameters:
        /// key: Query string parameter to be fetched.
        this.getQueryStringValue = function (key) {
            JSRequest.EnsureSetup();
            return decodeURIComponent(JSRequest.QueryString[key]);
        };

        /// ListItems related operations
        this.ListItems = function () {

            /// Summary: Get listitems by query and list name (without paging).
            /// Parameters: 
            /// listName: Name of the list to fetch items
            /// query: CAML Query to fetch items
            this.GetListItems = function (listName, query) {

                var deferred = $.Deferred();
                EYC.Processing.startLoading();
                var clientContext = SP.ClientContext.get_current();
                var oList = clientContext.get_web().get_lists().getByTitle(listName);

                var camlQuery = new SP.CamlQuery();
                camlQuery.set_viewXml(query);

                this.listItemCollection = oList.getItems(camlQuery);

                clientContext.load(this.listItemCollection);

                clientContext.executeQueryAsync(
                    Function.createDelegate(this, function () {
                        EYC.Processing.endLoading();
                        deferred.resolve(this.listItemCollection);
                    }),
                    Function.createDelegate(this, function (sender, args) {
                        EYC.Processing.endLoading();
                        deferred.reject(sender, args);
                    })
                );

                return deferred.promise();
            };

            /// Summary: Get listitems by query and list name (without paging) in parallel threads.
            /// Parameters: 
            /// listName: Name of the list to fetch items
            /// query: CAML Query to fetch items
            this.GetListItemsInParallel = function () {
                this.getItems = function (listName, query) {
                    var deferred = $.Deferred();
                    //EYC.Processing.startLoading();
                    var clientContext = SP.ClientContext.get_current();
                    var oList = clientContext.get_web().get_lists().getByTitle(listName);

                    var camlQuery = new SP.CamlQuery();
                    camlQuery.set_viewXml(query);

                    this.listItemCollection = oList.getItems(camlQuery);

                    clientContext.load(this.listItemCollection);

                    clientContext.executeQueryAsync(
                        Function.createDelegate(this, function () {
                            //EYC.Processing.endLoading();
                            deferred.resolve(this.listItemCollection);
                        }),
                        Function.createDelegate(this, function (sender, args) {
                            EYC.Processing.endLoading();
                            deferred.reject(sender, args);
                        })
                    );

                    return deferred.promise();
                }
            };

            /// Summary: Get listitems by query and list name (without paging) from a specific folder.
            /// Parameters: 
            /// listName: Name of the list to fetch items
            /// query: CAML Query to fetch items
            this.GetListItemsFromFolder = function (listName, query, folderServerRelativeUrl) {

                var deferred = $.Deferred();
                EYC.Processing.startLoading();
                var clientContext = SP.ClientContext.get_current();
                var oList = clientContext.get_web().get_lists().getByTitle(listName);

                var camlQuery = new SP.CamlQuery();
                camlQuery.set_viewXml(query);
                camlQuery.set_folderServerRelativeUrl(folderServerRelativeUrl);

                this.listItemCollection = oList.getItems(camlQuery);

                clientContext.load(this.listItemCollection);

                clientContext.executeQueryAsync(
                    Function.createDelegate(this, function () {
                        EYC.Processing.endLoading();
                        deferred.resolve(this.listItemCollection);
                    }),
                    Function.createDelegate(this, function (sender, args) {
                        EYC.Processing.endLoading();
                        deferred.reject(sender, args);
                    })
                );

                return deferred.promise();
            };

            /// Summary: Get listitems by query and list name (without paging) from a specific folder in parallel threads.
            /// Parameters: 
            /// listName: Name of the list to fetch items
            /// query: CAML Query to fetch items
            this.GetListItemsFromFolderInParallel = function () {
                this.getItems = function (listName, query, folderServerRelativeUrl) {
                    var deferred = $.Deferred();
                    //EYC.Processing.startLoading();
                    var clientContext = SP.ClientContext.get_current();
                    var oList = clientContext.get_web().get_lists().getByTitle(listName);

                    var camlQuery = new SP.CamlQuery();
                    camlQuery.set_viewXml(query);
                    camlQuery.set_folderServerRelativeUrl(folderServerRelativeUrl);

                    this.listItemCollection = oList.getItems(camlQuery);

                    clientContext.load(this.listItemCollection);

                    clientContext.executeQueryAsync(
                        Function.createDelegate(this, function () {
                            //EYC.Processing.endLoading();
                            deferred.resolve(this.listItemCollection);
                        }),
                        Function.createDelegate(this, function (sender, args) {
                            EYC.Processing.endLoading();
                            deferred.reject(sender, args);
                        })
                    );

                    return deferred.promise();
                }
            };

            /// Summary: Get listitems batch by batch iteratively
            /// Parameters: 
            /// listName: Name of the list to fetch items
            /// query: CAML Query to fetch items
            /// listItemCollPosition: Position of the list items to be fetched.
            this.GetListItemsPaged = function (listName, query, listItemCollPosition) {

                var deferred = $.Deferred();
                EYC.Processing.startLoading();
                var clientContext = SP.ClientContext.get_current();
                var oList = clientContext.get_web().get_lists().getByTitle(listName);

                var camlQuery = new SP.CamlQuery();
                camlQuery.set_viewXml(query);

                this.listItemCollPos = listItemCollPosition;//(typeof listItemCollPosition != "undefined") ? listItemCollPosition : new SP.ListItemCollectionPosition();
                if (listItemCollPosition != null) {
                    camlQuery.set_listItemCollectionPosition(this.listItemCollPos);
                }


                this.listItemCollection = oList.getItems(camlQuery);

                clientContext.load(this.listItemCollection);


                clientContext.executeQueryAsync(
                    Function.createDelegate(this, function () {
                        EYC.Processing.endLoading();
                        var result = { position: this.listItemCollPos, items: this.listItemCollection };
                        deferred.resolve(result);
                    }),
                    Function.createDelegate(this, function (sender, args) {
                        EYC.Processing.endLoading();
                        deferred.reject(sender, args);
                    })
                );

                return deferred.promise();
            };

            /// Summary: Method to perform Batch Update on listitems
            /// Parameters: 
            /// listName: Name of the list to fetch items
            /// listItemsArr: Field Array with Field Internal names and Field Values. e.g. - {ID:1,Title:"Test"}
            /// folderUrl: List relative folder url e.g. - /Lists/ListName/Folder
            this.CreateListItemsBatched = function (listName, listItemsArr, folderUrl) {
                var deferred = $.Deferred();
                EYC.Processing.startLoading();
                var clientContext = SP.ClientContext.get_current();
                var oList = clientContext.get_web().get_lists().getByTitle(listName);
                var itemArray = [];

                $.each(listItemsArr, function (i, key) {
                    var itemCreateInfo = new SP.ListItemCreationInformation();
                    if (typeof folderUrl != "undefined" && folderUrl != "") { itemCreateInfo.set_folderUrl(folderUrl); }

                    var oListItem = oList.addItem(itemCreateInfo);

                    $.each(key, function (col, val) {
                        if (col != "ID") {
                            oListItem.set_item(col, val);
                        }
                    });
                    oListItem.update();
                    itemArray[i] = oListItem;
                    clientContext.load(itemArray[i]);
                });

                clientContext.executeQueryAsync(
                    Function.createDelegate(this, function () {
                        EYC.Processing.endLoading();
                        deferred.resolve(itemArray);
                    }),
                    Function.createDelegate(this, function (sender, args) {
                        EYC.Processing.endLoading();
                        deferred.reject(sender, args);
                    })
                );

                return deferred.promise();
            }

            /// Summary: Method to perform Batch Update on listitems
            /// Parameters: 
            /// listName: Name of the list to fetch items
            /// listItemsArr: Field Array with Field Internal names and Field Values. e.g. - {ID:1,Title:"Test"}
            this.UpdateListItemsBatched = function (listName, listItemsArr) {
                var deferred = $.Deferred();
                EYC.Processing.startLoading();
                var clientContext = SP.ClientContext.get_current();
                var oList = clientContext.get_web().get_lists().getByTitle(listName);
                var itemArray = [];

                $.each(listItemsArr, function (i, key) {
                    var oListItem = oList.getItemById(key.ID);
                    $.each(key, function (col, val) {
                        if (col != "ID") {
                            oListItem.set_item(col, val);
                        }
                    });
                    oListItem.update();
                    itemArray[i] = oListItem;
                    clientContext.load(itemArray[i]);
                });

                clientContext.executeQueryAsync(
                    Function.createDelegate(this, function () {
                        EYC.Processing.endLoading();
                        deferred.resolve(itemArray);
                    }),
                    Function.createDelegate(this, function (sender, args) {
                        EYC.Processing.endLoading();
                        deferred.reject(sender, args);
                    })
                );

                return deferred.promise();
            }
        };
    };

    /// Summary Handler for loading icons.
    EYC.Processing = {
        //loadJS: function () { SP.SOD.executeFunc('sp.ui.dialog.js', 'SP.UI.ModalDialog', function() {}); },
        startLoading: function () {
            EnsureScript('sp.ui.dialog.js', typeof (SP.UI.ModalDialog), function () { });
            EYC.Constants.loading = SP.UI.ModalDialog.showWaitScreenWithNoClose('', 'Processing...');
        },
        endLoading: function () { try { EYC.Constants.loading.close(); EYC.Constants.loading = null; } catch (ex) { } }
    };

    /// Summary : Log exception to ULS.
    EYC.Exception = {
        Log: function (msg, appName, page, funcName) {
            ULS.enable = true;
            var errMsg = "Exception - " + appName + " : Page - " + page + " | Function - " + funcName + " | Error - " + msg;
            ULSOnError(errMsg, page, 0);
        },
        LogToConsole: function (msg) {
            if (console) {
                console.log(msg);
            }
        }
    }

})();