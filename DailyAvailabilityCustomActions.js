var siteUrl = _spPageContextInfo.webAbsoluteUrl,
    competencyUrl = "https://my.ey.net/Lists/SSISLibrary/",
    loading,
    listItem,
    currentUserInfo = {
        LoginName: "",
        GPN: "",
        UserName: "",
        Email: "",
        GPN: '',
        SL: "",
        SSL: "",
        Rank: "",
        Sector: "",
        City: "",
        Country: "",
        Region: "",
        StartDate: "",
        CompetencyUrl: "",
        Competencies: ""
    },
    ListDataFlag = false,
    UserDataFlag = false;

// Summary: Method for showing add new availability pop-up.
// Parameters: None
function addItemPopup() {
    var pageUrl = _spPageContextInfo.webAbsoluteUrl + '/Lists/DailyAvailability1/NewForm.aspx?Source=' + encodeURIComponent(window.location.href);
    var options = {
        title: "Add Availability",
        url: pageUrl,
        dialogReturnValueCallback: function (result, target) {
            if (result == SP.UI.DialogResult.OK) {
                startLoading();
                SP.SOD.executeFunc('sp.js', 'SP.ClientContext', getItemID);
            }
        }
    };
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        document.location.href = pageUrl;
    }
    else {
        SP.UI.ModalDialog.showModalDialog(options);
    }
    return false;
}

// Summary: Method for triggering the reporting when user clicks on "I'm interested" button.
// Parameters: 
//          itemID: ID of the item.
function Initialize(itemID) {
    userInfo();
    retrieveListItem(itemID, "Daily Availability");
}

// Summary: Method to retrieve list item information.
// Parameters: 
//          id: ID of the item.
//          list_name: Name of the list.
function retrieveListItem(id, list_name) {
    var clientContext = new SP.ClientContext(siteUrl);
    var oList = clientContext.get_web().get_lists().getByTitle(list_name);

    var camlQuery = new SP.CamlQuery();
    camlQuery.set_viewXml('<View><Query><Where><Eq><FieldRef Name=\'ID\'/>' +
        '<Value Type=\'Counter\'>' + id + '</Value></Eq></Where></Query></View>');
    this.collListItem = oList.getItems(camlQuery);

    clientContext.load(collListItem);
    clientContext.executeQueryAsync(Function.createDelegate(this, this.onQuerySucceeded), Function.createDelegate(this, this.onQueryFailed));
}

// Summary: Method to push retrieved list item information into an object.
// Parameters: 
//          sender: Sender.
//          args: Arguments.
function onQuerySucceeded(sender, args) {
    var listItemEnumerator = collListItem.getEnumerator();

    while (listItemEnumerator.moveNext()) {
        var oListItem = listItemEnumerator.get_current();
        listItem = {
            GPN: validateData(oListItem.get_item('AvailableGPN')),
            Name: validateData(oListItem.get_item('AvailableUserName')),
            SLSSL: validateData(oListItem.get_item('SLSSL') != null ? oListItem.get_item('SLSSL').get_lookupValue() : ''),
            Rank: validateData(oListItem.get_item('Rank')),
            Availability: validateData(oListItem.get_item('Availability')),
            Domain: validateData(oListItem.get_item('AvailableCompetency')),
            AboutMe: validateData(oListItem.get_item('AboutMe')),
            MyCompetencies: validateData(oListItem.get_item('UserCompetency')),
            SectorName: validateData(oListItem.get_item('AvailableSector')),
            CityName: validateData(oListItem.get_item('CityName')),
            Country: validateData(oListItem.get_item('Country')),
            Region: validateData(oListItem.get_item('AvailableRegion') != null ? oListItem.get_item('AvailableRegion').get_lookupId() : 3),
            Area: validateData(oListItem.get_item('Area')),
            EM: validateData(oListItem.get_item('ExperienceManager')),
            Counselor: validateData(oListItem.get_item('Counselor')),
            StartDate: validateData(oListItem.get_item('Startdate')),
            NoOfDays: validateData(oListItem.get_item('NumberOfDays')),
            EndDate: validateData(oListItem.get_item('EndDate'))
        };
    }
    ListDataFlag = true;
    ensureFun("Daily Availability Interest Staging List");
}

// Summary: Method to handling errors.
// Parameters: 
//          sender: Sender.
//          args: Arguments.
function onQueryFailed(sender, args) {
   // alert('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
}

// Summary: Method to ensuring that list data and user data are loaded.
// Parameters: 
//          listName: Name of the list.
function ensureFun(listName) {
    if (ListDataFlag && UserDataFlag) {
        ListDataFlag = false;
        createListItem(listName);
    }
}

// Summary: Method to create item in list.
// Parameters: 
//          listName: Name of the list.
function createListItem(listName) {
    var clientContext = new SP.ClientContext(siteUrl);
    var oList = clientContext.get_web().get_lists().getByTitle(listName);

    var itemCreateInfo = new SP.ListItemCreationInformation();
    this.oListItem = oList.addItem(itemCreateInfo);

    oListItem.set_item('AvailableGPN', listItem.GPN);
    oListItem.set_item('AvailableUserName', listItem.Name);
    oListItem.set_item('SLSSL', listItem.SLSSL);
    oListItem.set_item('Rank', listItem.Rank);
    oListItem.set_item('Availability', listItem.Availability);
    oListItem.set_item('AvailableCompetency', listItem.Domain);
    oListItem.set_item('AboutMe', listItem.AboutMe);
    oListItem.set_item('UserCompetency', listItem.MyCompetencies);
    oListItem.set_item('AvailableSector', listItem.SectorName);
    oListItem.set_item('CityName', listItem.CityName);
    oListItem.set_item('Country', listItem.Country);
    var regionvalue = new SP.FieldLookupValue();
    regionvalue.set_lookupId(listItem.Region);
    oListItem.set_item('AvailableRegion', regionvalue);
    oListItem.set_item('Area', listItem.Area);
    oListItem.set_item('ExperienceManager', listItem.EM);
    oListItem.set_item('Counselor', listItem.Counselor);
    if (listItem.StartDate) {
        oListItem.set_item('Startdate', listItem.StartDate);
        oListItem.set_item('NumberOfDays', listItem.NoOfDays);
        oListItem.set_item('EndDate', listItem.EndDate);
    }

    oListItem.set_item('GPN', currentUserInfo.GPN);
    oListItem.set_item('UserName1', currentUserInfo.UserName);
    oListItem.set_item('UserSLorSSL', currentUserInfo.SL + "-" + currentUserInfo.SSL);
    oListItem.set_item('UserRank', currentUserInfo.Rank);
    oListItem.set_item('UserSector', currentUserInfo.Sector);
    oListItem.set_item('Competency', currentUserInfo.Competencies);
    oListItem.set_item('UserCity', currentUserInfo.City);
    oListItem.set_item('UserCountry', currentUserInfo.Country);
    oListItem.set_item('UserRegion', localStorage.getItem("MERegion_" + _spPageContextInfo.userId) ? localStorage.getItem("MERegion_" + _spPageContextInfo.userId) : "");

    oListItem.update();

    clientContext.load(oListItem);
    clientContext.executeQueryAsync(
        Function.createDelegate(this, this.onQuerySucceededItemSave),
        Function.createDelegate(this, this.onQueryFailedItemSave)
    );
}

// Summary: Method to close preloader animation once item creation is complete.
// Parameters: None
function onQuerySucceededItemSave() {
    endLoading();
}

// Summary: Method to close preloader animation if item creation fails.
// Parameters: None
function onQueryFailedItemSave(sender, args) {
    endLoading();
}

// Summary: Method to retrieve current user details.
// Parameters: None
function userInfo() {
    var context = new SP.ClientContext.get_current();
    this.website = context.get_web();
    this.currentUser = website.get_currentUser();
    context.load(currentUser);
    context.executeQueryAsync(Function.createDelegate(this, this.onQuerySucceededUser), Function.createDelegate(this, this.onQueryFailedUser));
}

// Summary: Method to push retrieved user information into an object.
// Parameters: 
//          sender: Sender.
//          args: Arguments.
function onQuerySucceededUser(sender, args) {
    currentUserInfo.LoginName = ((typeof currentUser.get_loginName() != 'undefined') ? currentUser.get_loginName() : "");
    currentUserInfo.UserName = ((typeof currentUser.get_title() != 'undefined') ? currentUser.get_title() : "");
    currentUserInfo.Email = ((typeof currentUser.get_email() != 'undefined') ? currentUser.get_email() : "");

    fetchProfileInformation(currentUser.get_loginName());
}

// Summary: Method to handling errors.
// Parameters: 
//          sender: Sender.
//          args: Arguments.
function onQueryFailedUser(sender, args) {
    if (console) {
        console.log('request failed ' + args.get_message() + '\n' + args.get_stackTrace());
    }
}

// Summary: Method to get user's profile information.
// Parameters: 
//          userAccount: User's account name.
function fetchProfileInformation(userAccount) {
    if (typeof userAccount != "undefined" && userAccount != "") {
        var reqUrl = _spPageContextInfo.webAbsoluteUrl + "/_api/sp.userprofiles.peoplemanager/GetPropertiesFor(accountname=@v)?@v='" + encodeURIComponent(userAccount) + "'";
        $.ajax({
            url: reqUrl,
            type: "GET",
            headers: { "accept": "application/json;odata=verbose" },
            dataType: "json",
            success: function (data) {
                if (typeof data != "undefined" && typeof data.d != "undefined" && typeof data.d.UserProfileProperties != "undefined" && data.d.UserProfileProperties.results.length > 0) {
                    fillProfileInfo(data.d.UserProfileProperties.results);
                    if (currentUserInfo.CompetencyUrl.length > 0) {
                        getCompetencyDetails(currentUserInfo.CompetencyUrl);
                    }
                }
            },
            error: function (error) {
                if (console) {
                    console.log(JSON.stringify(error));
                }
            }
        });
    }
};

// Summary: Method to push retrieved user information into an object.
// Parameters: 
//          userProperties: Properties of the user.
function fillProfileInfo(userProperties) {
    for (var i = 0; i < userProperties.length; i++) {
        if (userProperties[i]['Key'] == "EYGPN") {
            currentUserInfo.GPN = userProperties[i]['Value'];
        }
        else if (userProperties[i]['Key'] == "EYServiceLineDescription") {
            currentUserInfo.SL = userProperties[i]['Value'];
        }
        else if (userProperties[i]['Key'] == "EYSubServiceLineDescription") {
            currentUserInfo.SSL = userProperties[i]['Value'];
        }
        else if (userProperties[i]['Key'] == "EYRankDescription") {
            currentUserInfo.Rank = userProperties[i]['Value'];
        }
        else if (userProperties[i]['Key'] == "EYPrimarySector") {
            currentUserInfo.Sector = userProperties[i]['Value'];
        }
        else if (userProperties[i]['Key'] == "EYWorkLocationAddressCity") {
            currentUserInfo.City = userProperties[i]['Value'];
        }
        else if (userProperties[i]['Key'] == "EYWorkLocationAddressCountry") {
            currentUserInfo.Country = userProperties[i]['Value'];
        }
        else if (userProperties[i]['Key'] == "EYPhysicalArea") {
            currentUserInfo.Region = userProperties[i]['Value'];
        }
        else if (userProperties[i]['Key'] == "SPS-HireDate") {
            currentUserInfo.StartDate = userProperties[i]['Value'];
        }
        else if (userProperties[i]['Key'] == "SPS-HireDate") {
            currentUserInfo.StartDate = userProperties[i]['Value'];
        }
        else if (userProperties[i]['Key'] == "EYGUI") {
            competencyUrl = "https://my.ey.net/Lists/SSISLibrary/";
            competencyUrl += userProperties[i]['Value'] + ".txt";
            currentUserInfo.CompetencyUrl = competencyUrl;
        }
    }
}

// Summary: Method to get user's competency information.
// Parameters: 
//          requestUrl: Competency URL.
function getCompetencyDetails(requestUrl) {
    $.ajax({
        type: "GET",
        url: requestUrl,
        async: true,
        contentType: "application/json;odata=verbose",
        headers: { "Accept": "application/json; odata=verbose" },
        dataType: "json",
        success: function (data) {
            currentUserInfo.Competencies = '';
            $.each(data.Competencies, function (index, value) {
                currentUserInfo.Competencies += value.CompetencyName + "; ";
            });
            UserDataFlag = true;
            ensureFun("Daily Availability Interest Staging List");
        },
        error: function (a, b, c) {
            currentUserInfo.Competencies = '';
            UserDataFlag = true;
            ensureFun("Daily Availability Interest Staging List");
        }
    });
};

// Summary: Method to validate the data.
// Parameters: 
//          data: Data to be validated.
function validateData(data) {
    if (data != null) {
        return data;
    }
    else {
        return "";
    }
}

// Summary: Method to show processing window.
// Parameters: None
function startLoading() {
    EnsureScript('sp.ui.dialog.js', typeof (SP.UI.ModalDialog), function () { });
    loading = SP.UI.ModalDialog.showWaitScreenWithNoClose('', 'Processing...');
}

// Summary: Method to close processing window.
// Parameters: None
function endLoading() { try { loading.close(); loading = null; } catch (ex) { } }

// Summary: Method for getting ID of latest item added by the current user.
// Parameters: None
function getItemID() {
    $.ajax({
        type: "GET",
        url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/Getbytitle('Daily%20Availability')/items?$select=ID,Author/Id,Author/Title,Author/EMail&$expand=Author&$filter=Author/Id eq " + _spPageContextInfo.userId + "&$orderby=ID desc",
        contentType: "application/json;odata=verbose",
        headers: { "Accept": "application/json; odata=verbose" },
        dataType: "json",
        success: function (data) {
            if (typeof data != "undefined" && typeof data.d != "undefined") {
                if (data.d.results.length) {
                    getCV(data.d.results[0].Author.EMail, data.d.results[0].ID);
                }
            }

        },
        error: function () {
            endLoading();
            document.location.href = window.location.href;
        }
    });
}

// Summary: Method to initiate the upload.
// Parameters: ID - Item ID
//			   attachments - Attachments to be added.
//			   index - Index value.
function initiateUpload(ID, attachments, index) {
    var obj = new upload();
    obj.uploadAttachement(ID, attachments, index);
}

// Summary: Method to get primary resume from profile document library
// Parameters: emailID - Logged in user email ID
//			   ID      - Item ID	
function getCV(emailID, ID) {
    flag = 0;
    $.support.cors = true;
    var text = null;
    var eyMySite = "https://my.ey.net";

    var searchurl = eyMySite + "/_api/search/query?querytext='EYCVOF:" + emailID + "+EYContentType:CV'&selectproperties='EYCVTitle,FileType,Path,EYPrimaryCV,EnablementKeywordsOWSMTXT'";

    $.ajax({
        type: "GET",
        url: searchurl,
        contentType: "application/json",
        headers: { "Accept": "application/json; odata=verbose" },
        beforeSend: function (x) {
            if (x && x.overrideMimeType) {
                x.overrideMimeType("application/j-son;charset=UTF-8");
            }
        },
        dataType: "json",
        success: function (data) {
            var results = data.d.query.PrimaryQueryResult.RelevantResults.Table.Rows.results;
            var searchResultsHtml = '';
            var attachments = [];
            var attachmentCount = 0;

            if (results.length != 0) {

                $.each(results, function (index, result) {

                    var filetype = result.Cells.results[3].Value;
                    var KeyWords = result.Cells.results[6].Value;
                    var cvURL = result.Cells.results[4].Value;
                    var cvName = cvURL.substring(cvURL.indexOf("ProfileCVs") + 11, cvURL.length);

                    getFileObject(cvName, decodeURI(cvURL), function (fileObject) {

                        function waitForElement() {
                            file = fileObject;
                            if (typeof file !== "undefined") {
                                attachments.push(file);
                                attachmentCount++;

                                if (attachmentCount == results.length) {
                                    initiateUpload(ID, attachments, 0);
                                }
                            }
                            else {
                                setTimeout(waitForElement, 250);
                            }
                        }

                        waitForElement();

                    });
                });
            }
            else {
                endLoading();
                document.location.href = window.location.href;
            }
        },
        error: function () {
            endLoading();
            document.location.href = window.location.href;
        }
    });
}

// Summary: Method to get the file from location
// Parameters: url - File Path or Url
//			   cb  - Call back function 	
function fetchBlob() {
    this.getFileBlob = function (url, cb) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url);
        xhr.responseType = "blob";
        xhr.addEventListener('load', function () {
            cb(xhr.response);
        });
        xhr.send();
    };
};

// Summary: Method to get the file details
// Parameters: blob - blob object
//			   name - File name 	
var blobToFile = function (blob, name) {
    blob.lastModifiedDate = new Date();
    blob.name = name;
    return blob;
};

// Summary: Method to get the file object 
// Parameters: fileName - Blob object
//			   filePathOrUrl - File Path or Url
//			   cb  		- Call back function 	
var getFileObject = function (fileName, filePathOrUrl, cb) {
    var blobObj = new fetchBlob();
    blobObj.getFileBlob(filePathOrUrl, function (blob) {
        cb(blobToFile(blob, fileName));
    });
};

// Summary: Method to read the file to buffer 
// Parameters: file - file object	
var fileBuffer = function () {
    this.getFileBuffer = function (file) {
        var deferred = $.Deferred();
        var reader = new FileReader();
        reader.onload = function (e) {
            deferred.resolve(e.target.result);
        }
        reader.onerror = function (e) {
            deferred.reject(e.target.error);
        }
        reader.readAsArrayBuffer(file);
        return deferred.promise();
    }
}

// Summary: Method to upload the attachement to list item
// Parameters: ID - List item ID	
function upload() {
    this.uploadAttachement = function (ID, files, index) {
        //Update request digest value
        UpdateFormDigest(_spPageContextInfo.webServerRelativeUrl, _spFormDigestRefreshInterval);

        var deferred = $.Deferred(),
            file = files[index],
            fileBuf = new fileBuffer();

        fileBuf.getFileBuffer(file).then(
            function (buffer) {
                var bytes = new Uint8Array(buffer);
                var content = new SP.Base64EncodedByteArray();
                var queryUrl = _spPageContextInfo.webServerRelativeUrl + "/_api/web/lists/getbytitle('Daily%20Availability')/items(" + ID + ")/AttachmentFiles/add(FileName='" + file.name + "')";
                $.ajax({
                    url: queryUrl,
                    type: "POST",
                    processData: false,
                    contentType: "application/json;odata=verbose",
                    data: buffer,
                    headers: {
                        "accept": "application/json;odata=verbose",
                        "X-RequestDigest": $("#__REQUESTDIGEST").val(),
                        "content-length": buffer.byteLength
                    },
                    success: function (data) {
                        flag++;
                        if (flag == files.length) {
                            endLoading();
                            document.location.href = window.location.href;
                        }
                        else {
                            initiateUpload(ID, files, ++index);
                        }
                    },
                    error: function (err) {
                        endLoading();
                        document.location.href = window.location.href;
                    }
                });
            },
            function (err) {
                deferred.reject(err);
            }
        );

        return deferred.promise();
    }
};

// Summary: Method to replace OOTB list search with custom list search.
// Parameters: 
//          WPID - ID of the webpart.	
function buildCustomListSearch(WPID) {
    var customSearchBoxHandle = '#csb' + WPID,
        spSearchButtonIDHandle = '#inplaceSearchDiv_' + WPID + '_lsimg',
        spSearchButtonClassHandle = '#inplaceSearchDiv_' + WPID + '_lsimgspan .ms-inlineSearch-searchImg',
        spSearchInputBoxHandle = '#inplaceSearchDiv_' + WPID + '_lsinput',
        spSearchBoxWrapperHandle = '#inplaceSearchDiv_' + WPID;

    $("<input class='custom-search-box' id='csb" + WPID + "' placeholder='Find an item' type='text'>").insertAfter(spSearchBoxWrapperHandle);

    function prepareParameters() {
        var searchKey = $(customSearchBoxHandle).val(),
            query = 'WORDS(',
            ev = document.createEvent("Event"),
            keywords,
            spSearchInputBox = $(spSearchInputBoxHandle);

        if (searchKey.length > 0) {
            keywords = searchKey.split(' ');
            $.each(keywords, function (i, v) {
                if (i !== keywords.length - 1) {
                    query += this + ', ';
                }
                else {
                    query += this + ')';
                }
            });
        }
        else {
            query = '';
        }

        spSearchInputBox.val(query);
        ev.initEvent('input', true, true)
        spSearchInputBox[0].dispatchEvent(ev);
    }

    var flag = true,
        notFirst = false;

    $(spSearchBoxWrapperHandle).bind("DOMSubtreeModified", function () {
        var spSearchButton = $(spSearchButtonIDHandle);
        if ((spSearchButton.length > 0) && flag) {
            flag = false;
            spSearchButton.click(function () {
                if (($(this).attr('class').indexOf('ms-inlineSearch-cancelImg') >= 0) && notFirst) {
                    $(customSearchBoxHandle).val('');
                }
                notFirst = true;
            });
        }
    });

    $(customSearchBoxHandle).change(prepareParameters);

    $(customSearchBoxHandle).keypress(function (e) {
        var key = e.which;
        if (key == 13) {
            prepareParameters();
            $(spSearchButtonClassHandle).click();
        }
    });
};

$(document).ready(function () {
    //Insert 'Add availability' button on the availability page.
    $('<button class="available-button" type="button" onClick="addItemPopup()" style="float:left; cursor:pointer; position: relative; bottom: 12px; margin-right: 8px;">Yes! I am available!</button>').insertBefore(".ms-InlineSearch-DivBaseline");

    //Replace OOTB list search with custom list search.
    buildCustomListSearch('WPQ2');

    $(".interest-button").click(function () {
        var itemID = $(this).attr('data-button');

        if (itemID.length > 0) {
            ListDataFlag = false;
            ExecuteOrDelayUntilScriptLoaded(function () { startLoading(); }, 'sp.ui.dialog.js');
            SP.SOD.executeOrDelayUntilScriptLoaded(function () { Initialize(itemID); }, 'sp.js');
        }
    });

    //Toggling instruction section based on the status(on edit mode or not) of the page.
    EnsureScript("ribbon", TypeofFullName("SP.Ribbon.PageStateActionButton"), function () {
        if (SP.Ribbon.PageState.Handlers.isInEditMode()) {
            $("#instrBody").show();
        }
        else {
            $("#instrBody").hide();
        }
    });

});