// JavaScript source code
(function () {
    'use strict';
    Type.registerNamespace('EYC');

    EYC.ME = function () {
        this.allProfiles = [];
        var competencyUrl = "https://my.ey.net/Lists/SSISLibrary/";
        var eyMySite = "https://my.ey.net/";

        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || !detectIE()) {
            eyMySite = _spPageContextInfo.webAbsoluteUrl;
        }

        var cvloaded = false, competencyLoaded = false;

        var profileInfo = {
            photoUrl: "",
            firstName: "",
            lastName: "",
            name: "",
            loginName: "",
            rank: "",
            serviceLine: '',
            subServiceLine: "",
            phone: "",
            mysite: "",
            email: "",
            sip: "",
            google: "",
            facebook: "",
            twitter: "",
            linkedIn: "",
            aboutMe: null,
            askMe: null,
            cV: "",
            certifications: [],
            eyGui: "",
            competencyUrl: "",
            competencies: [],
            competencyHtml: "",
            compOverallScore: 0,
            topStrengths: "",
            pastProjects: null
        };

        this.getUserDetails = function (userID) {
            EYC.Processing.startLoading();
            fetchUserFromWeb(userID);
        };

        var fetchUserFromWeb = function (userID) {
            $.ajax({
                type: "GET",
                url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/getuserbyid(" + userID + ")",
                async: true,
                contentType: "application/json;odata=verbose",
                headers: { "Accept": "application/json; odata=verbose" },
                dataType: "json",
                success: function (data) {
                    if (typeof data != "undefined" && typeof data.d != "undefined") {
                        fetchProfileInformation(data.d.LoginName);
                    }
                    else {
                        alert("Could not find the requested user.");
                    }
                },
                error: errorHandler
            });
        };

        var fetchProfileInformation = function (userAccount) {
            if (typeof userAccount != "undefined" && userAccount != "") {
                profileInfo.loginName = userAccount;
                //var reqUrl = _spPageContextInfo.webAbsoluteUrl + "/_api/sp.userprofiles.peoplemanager/GetPropertiesFor(accountname=@v)?@v='" + encodeURIComponent(userAccount) + "'";
                var reqUrl = eyMySite + "/_api/sp.userprofiles.peoplemanager/GetPropertiesFor(accountname=@v)?@v='" + encodeURIComponent(userAccount) + "'";

                $.ajax({
                    url: reqUrl,
                    type: "GET",
                    headers: { "accept": "application/json;odata=verbose" },
                    dataType: "json",
                    success: function (data) {
                        if (typeof data != "undefined" && typeof data.d != "undefined" && typeof data.d.UserProfileProperties != "undefined" && data.d.UserProfileProperties.results.length > 0) {
                            profileInfo.mysite = data.d.PersonalUrl;
                            profileInfo.email = data.d.Email;
                            profileInfo.name = data.d.DisplayName;
                            profileInfo.rank = data.d.Title;
                            profileInfo.photoUrl = (data.d.PictureUrl == null) ? "/_layouts/15/images/PersonPlaceholder.200x150x32.png" : data.d.PictureUrl;
                            var datas = data.d.UserProfileProperties.results;
                            fillProfileInfo(datas);
                            getCompetencyDetails(profileInfo.competencyUrl);
                            getCV(data.d.Email);
                        }
                    },
                    error: errorHandler
                });
            }
            else {
                alert("Could not find the requested user.");
            }
        };

        var getCompetencyDetails = function (requestUrl) {
            $.ajax({
                type: "GET",
                url: requestUrl,
                async: true,
                contentType: "application/json;odata=verbose",
                headers: { "Accept": "application/json; odata=verbose" },
                dataType: "json",
                success: buildCompetencyOverview,//buildCompetencyHtml,
                error: function (a, b, c) {
                    competencyLoaded = true;
                    profileInfo.competencyHtml = "";//"<div>No Competency information  found for the requested user.</div>";
                    //$("#competencies").html(competencyHtml);
                }
            });
        };

        var buildCompetencyHtml = function (data) {
            var jsonBefore = JSON.stringify(data, undefined, 2);
            var grouped = applyGrouping(data.Competencies);
            profileInfo.competencies = grouped;
            var jsonAfter = JSON.stringify(grouped, undefined, 2);
            var competencyHtml = "<div>No Competency information  found for the requested user.</div>";

            if (data.Certifications.length > 0) {
                getCertifications(data.Certifications);
            }

            if (data.Competencies.length > 0) {
                competencyHtml = '<div class="Area" id="competencyLastUpdated">Last Updated: ' + data.Competencies[0].CompetencyLastUpdated + '</div>';
                var curCtrlCount = 1;

                var CompetenciesView = function (level1Grouping) {
                    $(level1Grouping).each(function (i, curGrp) {
                        var competencyName = (typeof curGrp.name != "undefined" && curGrp.name != "") ? curGrp.name : "";
                        var subgroups = curGrp.subgroups;
                        var display = (competencyName != "") ? "" : "style='display:none;'";

                        competencyHtml += '<div class="level1"><table><tr><td><span style="font-weight:bold;"><a class="tree"><span id="ctrl_' + curCtrlCount++ + '">' + competencyName + '</span></a></span></td></tr></table></div>';

                        if (typeof subgroups != "undefined" && subgroups.length > 0) {
                            Level2View(subgroups);
                        }
                    });
                };

                var Level2View = function (level2Grouping) {
                    $(level2Grouping).each(function (i, curGrp) {
                        var competencyName = (typeof curGrp.name != "undefined" && curGrp.name != "") ? curGrp.name : "";
                        var competencies = curGrp.competencies;
                        var display = (competencyName != "") ? "" : "style='display:none;'";

                        competencyHtml += '<div class="level2"><span class="level2"><table ' + display + '><tr><td><span>&nbsp; <span id="ctrl_' + curCtrlCount++ + '" class="Area">' + competencyName +
                            '</span></span></td></tr></table></span><div class="level3">';

                        if (typeof competencies != "undefined" && competencies.length > 0) {
                            Level3View(competencies);
                        }

                        competencyHtml += '</div></div>';
                    });
                };

                var Level3View = function (level3Grouping) {
                    $(level3Grouping).each(function (i, curGrp) {
                        var competencyName = (typeof curGrp.CompetencyName != "undefined" && curGrp.CompetencyName != "") ? curGrp.CompetencyName : "";
                        var rating = (typeof curGrp.Rating != "undefined" && curGrp.Rating != "") ? curGrp.Rating : 0;
                        var ratingName = (typeof curGrp.RatingName != "undefined" && curGrp.RatingName != "") ? curGrp.RatingName : 0;

                        competencyHtml += '<table width="100%"><tr class="level3" width="60%">' +
                            '<td><span>&nbsp;&nbsp;&nbsp;&nbsp;  <a class="tree"><span id="ctrl_' + curCtrlCount++ + '">' + competencyName + '</span></a>&nbsp;</span></td>' +
                            '<td width="20%"><span id="star-rating"><span id="ctrl_' + curCtrlCount++ + '" class="stars"><span style="width: 32px;"></span></span>&nbsp;</span></td>' +
                            '<td width="20%"><span><span id="ctrl_' + curCtrlCount++ + '">' + ratingName + '</span></span></td>' +
                        '</tr></table>';
                    });
                };

                CompetenciesView(grouped);
            }

            profileInfo.competencyHtml = '<div class="userCompetency">' + competencyHtml + '</div>';
            competencyLoaded = true;
            buildHtml();
        }

        function buildCompetencyOverview(data) {
            var competencyHtml = "<div></div>";
            //profileInfo.competencies = groupByProficiency(data.Competencies);//groupByRating(data.Competencies);

            //if (profileInfo.competencies.length > 0) {
            //    var html = "<table>";

            //    if (profileInfo.competencies[0].Mastery.length > 0) {
            //        html += "<tr><td colspan='2'>Mastery</td></tr>";

            //        $(profileInfo.competencies[0].Mastery).each(function (i, c) {
            //            //html += '<tr><td><span><a class="tree"><span>' + c.name + '</span></a>&nbsp;</span></td><td><span class="stars">' + parseFloat(c.rating) + '</span></td><td><span>' + c.ratingName + '</span></td></tr>';
            //            html += '<tr><td><span><a class="tree"><span>' + c.name + '</span></a>&nbsp;</span></td><td><span class="stars">' + parseFloat(c.rating) + '</span></td></tr>';
            //        });

            //        //html += "</table>";
            //    }

            //    if (profileInfo.competencies[0].Proficient.length > 0) {
            //        html += "<tr><td colspan='2'>Proficient</td></tr>";

            //        $(profileInfo.competencies[0].Proficient).each(function (i, c) {
            //            //html += '<tr><td><span><a class="tree"><span>' + c.name + '</span></a>&nbsp;</span></td><td><span class="stars">' + parseFloat(c.rating) + '</span></td><td><span>' + c.ratingName + '</span></td></tr>';
            //            html += '<tr><td><span><a class="tree"><span>' + c.name + '</span></a>&nbsp;</span></td><td><span class="stars">' + parseFloat(c.rating) + '</span></td></tr>';
            //        });

            //        //html += "</table>";
            //    }

            //    html += "</table>";
            //    competencyHtml = html;
            //}

            competencyHtml = groupByProficiency(data.Competencies);
            profileInfo.competencyHtml = '<div class="userCompetency">' + competencyHtml + '</div>';
            competencyLoaded = true;
            buildHtml();
        };

        function bindProfileCompetency(comp) {
            var html = "<tr><td colspan='2'>" + comp[0].RatingName + "</td></tr>";

            $(comp).each(function (i, val) {
                html += '<tr><td><span><a class="tree"><span>' + val.CompetencyName + '</span></a>&nbsp;</span></td><td><span class="stars">' + parseFloat(val.Rating) + '</span></td></tr>';
            });

            return html;
        }

        function getCertifications(certifications) {
            var currDate = new Date();
            currDate = currDate.setHours(0, 0, 0, 0);

            for (var index = 0; index < certifications.length; index++) {
                var item = certifications[index]; // define the item that will be evaluated
                if (item.ExpirationDate != undefined && item.ExpirationDate != "") {
                    var yr = parseInt(item.ExpirationDate.substring(0, 4));
                    var mon = parseInt(item.ExpirationDate.substring(5, 7), 10);
                    var dt = parseInt(item.ExpirationDate.substring(8, 10), 10);
                    var certDate = new Date(yr, mon - 1, dt);
                    if (currDate <= certDate) {
                        profileInfo.certifications.push(item);
                    }
                }
            }
        }

        function getCV(displayName) {

            $.support.cors = true;
            var text = null;
            //displayName = displayName.split('|')[1];//spPageContextInfo.webAbsoluteUrl
            var searchurl = eyMySite + "/_api/search/query?querytext='EYCVOF:" + displayName + "+EYContentType:CV'&selectproperties='EYCVTitle,FileType,Path,EYPrimaryCV,EnablementKeywordsOWSMTXT'&enablesorting='true'&sortlist='EYPrimaryCV:descending,EYCVTitle:ascending'";

            $.ajax({
                type: "GET",
                url: searchurl,
                async: true,

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

                    if (results.length != 0) {

                        $.each(results, function (index, result) {
                            var filetype = result.Cells.results[3].Value;
                            var KeyWords = result.Cells.results[6].Value;
                            if (result.Cells.results[6].Value == null) {
                                KeyWords = "";
                            }
                            if (result.Cells.results[3].Value == null) {
                                filetype = "";
                            }
                            if (filetype == "pdf") {
                                searchResultsHtml += "<tr><td style='padding-right:20px;'><a href='" + result.Cells.results[4].Value + "' target=''>" +
                                        "<img class='image' src='/_layouts/images/ic" + filetype + ".png' alt='' />" +
                                      "</a></td><td style='padding-right:30px;'><a target='_blank' href='" + result.Cells.results[4].Value + "'>" + result.Cells.results[2].Value + "</a></td><td>" + KeyWords + "</td></tr>";

                            }
                            else {
                                searchResultsHtml += "<tr><td style='padding-right:20px;'><a href='" + result.Cells.results[4].Value + "' target=''>" +
                                        "<img class='image' src='/_layouts/images/ic" + filetype + ".gif' alt='' />" +
                                      "</a></td><td style='padding-right:30px;'><a target='_blank' href='" + result.Cells.results[4].Value + "'>" + result.Cells.results[2].Value + "</a></td><td>" + KeyWords + "</td></tr>";

                            }
                        });
                    }

                    profileInfo.cV = searchResultsHtml;
                    cvloaded = true;
                    buildHtml();
                },
                error: errorHandler
            });
        }

        var errorHandler = function (jqxr, errorCode, errorMsg) {
            var competencyHtml = "<div>Something went wrong. Please try again.</div>";
            //var NewDialog = $('<div>' + competencyHtml + '</div>');
            //NewDialog.dialog({
            //    resizable: false,
            //    modal: true,
            //    show: 'clip',
            //    minWidth: 600
            //});
            if (console) {
                console.log("Error Code : " + errorCode + "\n Error Message : " + errorMsg);
            }
            return false;
        }

        function groupByRating(d) {
            var grpdRatings = [];
            var grouped = applyGrouping(d);
            profileInfo.compOverallScore = d.length;

            $(d).each(function (i, c) {
                var rating = c.Rating;
                var ratingName = c.RatingName;

                var ratingGrp = {
                    name: ratingName,
                    scores: rating,
                    count: 1
                }

                var exRatgGrp = $.grep(grpdRatings, function (val) {
                    return (val.name == ratingName);
                });

                if (exRatgGrp.length > 0) {
                    exRatgGrp[0].scores = parseInt(exRatgGrp[0].scores) + parseInt(rating);
                    exRatgGrp[0].count++;
                }
                else {
                    grpdRatings.push(ratingGrp);
                }
            });

            grpdRatings = grpdRatings.sort(function (a, b) {
                return (b.scores - a.scores)
            });

            return grpdRatings;
        }

        function groupByProficiency(d) {
            var grpdRatings = d;
            var compInfo = [];
            var proficient = [];
            var mastered = [];
            var progressing = [];
            var beginning = [];
            var counter = 0;

            var grouped = applyGrouping(d);
            profileInfo.compOverallScore = d.length;

            var competencyHtml = "";

            mastered = $.grep(d, function (val) {
                return (val.RatingName == "Mastery")
            });
            counter = mastered.length > 0 ? ++counter : counter;
            if (mastered.length > 0) {
                competencyHtml += (competencyHtml == "") ? "<table>" + bindProfileCompetency(mastered) : bindProfileCompetency(mastered);
            }

            proficient = $.grep(d, function (val) {
                return (val.RatingName == "Proficient")
            });
            counter = proficient.length > 0 ? ++counter : counter;
            if (proficient.length > 0) {
                competencyHtml += (competencyHtml == "") ? "<table>" + bindProfileCompetency(proficient) : bindProfileCompetency(proficient);
            }

            if (counter < 2) {
                progressing = $.grep(d, function (val) {
                    return (val.RatingName == "Progressing")
                });
                counter = progressing.length > 0 ? ++counter : counter;
                if (progressing.length > 0) {
                    competencyHtml += (competencyHtml == "") ? "<table>" + bindProfileCompetency(progressing) : bindProfileCompetency(progressing);
                }
            }
            if (counter < 2) {
                beginning = $.grep(d, function (val) {
                    return (val.RatingName == "Beginning")
                });
                counter = beginning.length > 0 ? ++counter : counter;
                if (beginning.length > 0) {
                    competencyHtml += (competencyHtml == "") ? "<table>" + bindProfileCompetency(beginning) : bindProfileCompetency(beginning);
                }
            }

            //$(d).each(function (i, c) {
            //    var rating = c.Rating;
            //    var ratingName = c.RatingName;

            //    if (ratingName == "Proficient") {
            //        proficient.push({
            //            name: c.CompetencyName,
            //            rating: rating,
            //            ratingName: ratingName
            //        });
            //    }
            //    else if (ratingName == "Mastery") {
            //        mastered.push({
            //            name: c.CompetencyName,
            //            rating: rating,
            //            ratingName: ratingName
            //        });
            //    }
            //});

            //compInfo.push({
            //    Mastery: mastered,
            //    Proficient: proficient
            //});

            //return compInfo;

            return competencyHtml;
        }

        function applyGrouping(c) {
            var topgroups = [];

            $.each(c, function (i, comp) {

                comp.topgroup = getTopGroup(comp);
                comp.subgroup = getSubGroup(comp);

                var topgroup = false;
                var subgroup = false;

                $.each(topgroups, function (i, g) {
                    if (g.name == comp.topgroup) {
                        topgroup = g;
                        return false;
                    }
                });

                if (topgroup === false) {
                    topgroup =
                    {
                        name: comp.topgroup,
                        subgroups: []
                    };
                    topgroups.push(topgroup);
                }

                $.each(topgroup.subgroups, function (i, g) {
                    if (g.name == comp.subgroup) {
                        subgroup = g;
                        return false;
                    }
                });

                if (subgroup === false) {
                    subgroup =
                    {
                        name: comp.subgroup,
                        competencies: []
                    };
                    topgroup.subgroups.push(subgroup);
                }

                subgroup.competencies.push(comp);
            });

            return topgroups;
        }

        function getTopGroup(comp) {
            return comp.FrameworkName + " > " + comp.TreeName;
        }

        function getSubGroup(comp) {
            var subGroup = "";

            if (comp.BranchLevel3Name) subGroup = comp.BranchLevel3Name;
            if (comp.BranchLevel4Name) subGroup = subGroup + " > " + comp.BranchLevel4Name;
            if (comp.BranchLevel5Name) subGroup = subGroup + " > " + comp.BranchLevel5Name;
            if (comp.BranchLevel6Name) subGroup = subGroup + " > " + comp.BranchLevel6Name;

            return subGroup;
        }

        function fillProfileInfo(userProperties) {
            for (var i = 0; i < userProperties.length; i++) {

                switch (userProperties[i]['Key']) {
                    case "FirstName":
                        profileInfo.firstName = userProperties[i]['Value'];
                        break;
                    case "LastName":
                        profileInfo.lastName = userProperties[i]['Value'];
                        break;
                        //case "PreferredName":
                        //    profileInfo.name = userProperties[i]['Value'];
                        //    break;
                        //case "PictureURL":
                        //    profileInfo.photoUrl = userProperties[i]['Value'];
                        //    break;
                        //case "EYRankDescription":
                        //    profileInfo.rank = userProperties[i]['Value'];
                        //    break;
                    case "EYServiceLineDescription":
                        profileInfo.serviceLine = userProperties[i]['Value'];
                        break;
                    case "EYSubServiceLineDescription":
                        profileInfo.subServiceLine = userProperties[i]['Value'];
                        break;
                    case "WorkPhone":
                        profileInfo.phone = userProperties[i]['Value'];
                        break;
                        //case "WorkEmail":
                        //    profileInfo.email = userProperties[i]['Value'];
                        //    break;
                    case "EYTwitter":
                        profileInfo.twitter = userProperties[i]['Value'];
                        break;
                    case "EYLinkedIn":
                        profileInfo.linkedIn = userProperties[i]['Value'];
                        break;
                    case "EYFacebook":
                        profileInfo.facebook = userProperties[i]['Value'];
                        break;
                    case "EYGoogle+":
                        profileInfo.google = userProperties[i]['Value'];
                        break;
                    case "EYGUI":
                        competencyUrl += userProperties[i]['Value'] + ".txt";
                        profileInfo.competencyUrl = competencyUrl;
                        break;
                    case "SPS-Responsibility":
                        profileInfo.askMe = userProperties[i]['Value'];
                        break;
                    case "SPS-Interests":
                        profileInfo.aboutMe = userProperties[i]['Value'];
                        break;
                    case "SPS-PastProjects":
                        var pastProjectsColl = userProperties[i]['Value'];
                        profileInfo.pastProjects = pastProjectsColl.split('|');
                        break;
                    case "SPS-SipAddress":
                        profileInfo.sip = userProperties[i]['Value'];
                        break;
                        //case "PersonalSpace":
                        //    //profileInfo.mysite = "https://my.ey.net/" + userProperties[i]['Value'];
                        //    profileInfo.mysite = "https://my.ey.net/Person.aspx?accountname=" + encodeURIComponent(profileInfo.loginName);
                        //    break;
                    default: break;
                }
            }
        }

        function buildHtml() {
            profileInfo.photoUrl = (profileInfo.photoUrl.indexOf('MThumb') ? profileInfo.photoUrl.replace('MThumb', 'LThumb') : profileInfo.photoUrl);
            $('.profilePic > img').attr('src', profileInfo.photoUrl).attr('alt', profileInfo.name);
            var presence = '<img onload="IMNRC(' + profileInfo.sip + ', this)" name="imnmark" title="' + profileInfo.name + '" showofflinepawn="1" class="ms-spimn-img ms-spimn-presence-disconnected-10x10x32" src="/_layouts/15/images/spimn.png?rev=23" alt="' + profileInfo.name + '" sip="' + profileInfo.sip + '" id="imn_' + profileInfo.sip + ',type=sip">'
            $('.wrapper .ms-spimn-presenceWrapper').html(presence);
            $("#name").html(profileInfo.name);
            $("#rank").html(profileInfo.rank);
            $("#service").html(profileInfo.serviceLine + " - " + profileInfo.subServiceLine);
            $("#phone").html(profileInfo.phone);
            $("#email").html("<a href='mailto:" + profileInfo.email + "'>" + profileInfo.email + "</a>");
            $("#myprofile").html("<h3><a href='" + profileInfo.mysite + "' target='_blank'>View my Profile</a></h3>");
            if (profileInfo.linkedIn) {
                $("#linkedInProfile").html("<h3><a href='" + profileInfo.linkedIn + "' target='_blank'><img style='top: 2px; margin-right: 3px; position: relative;' src='../SiteAssets/images/linkedIn_logo.png'/>View LinkedIn Profile</a></h3>");
            }
            else {
                $("#linkedInProfile").html("");
            }
            //$("#social").html(profileInfo.name);
            $("#firstName").html(profileInfo.firstName);
            $("#about").html(splitToHalf(profileInfo.askMe, '|'));
            if (cvloaded) {
                $("#cvs").html(profileInfo.cV);
            }
            $("#certifications").html(certificationToHtml(profileInfo.certifications));
            if (competencyLoaded) {
                // old code from my profile 
                $("#competencies").html(profileInfo.competencyHtml);
                //$("#compOverview").html(profileInfo.compOverallScore);
                //$("#compStars").html(profileInfo.competencyHtml);
                $('span.stars').stars();
            }
            $("#pastProjects").html(jsonToHtml(profileInfo.pastProjects));

            IMNRC(profileInfo.sip, $('.wrapper .ms-spimn-presenceWrapper > img')[0]);

            $(".wrapper").dialog({
                resizable: false,
                modal: true,
                show: 'clip',
                minWidth: 900
            });

            EYC.Processing.endLoading();

            $('.ui-widget-overlay').on('click', function () {
                $(".wrapper").dialog('close');
            });
        }

        function splitToHtml(strData, splitchar) {
            var html = "";
            if (typeof strData != 'undefined' && strData != null && strData.length > 0) {
                var data = strData.split(splitchar);
                $(data).each(function (i, val) {
                    html += "<div>" + val + "</div>";
                });
            }
            else {
                html = "No data available.";
            }

            return html;
        }

        function splitToHalf(strData, splitchar) {
            var html = "";
            if (typeof strData != 'undefined' && strData != null && strData.length > 0) {
                var data = strData.split(splitchar);
                html += "<table>";
                $(data).each(function (i, val) {
                    var j = i + 1;
                    if (j % 2 == 0) {
                        html += "<td>" + val + "</td></tr>";
                    }
                    else {
                        html += "<tr><td>" + val + "</td>";
                    }

                });

                html += "</table>";
            }
            else {
                html = "No data available.";
            }

            return html;
        }

        function jsonToHtml(strData) {
            var html = "";
            if (typeof strData != 'undefined' && strData != null && strData != '') {
                //var data = strData.replace('[', '').replace(']', '').split(',');
                $(strData).each(function (i, val) {
                    html += "<p>" + val + "</p>";
                });
            } else {
                html = "No data available.";
            }

            return html;
        }

        function certificationToHtml(strData) {
            var html = "";
            if (typeof strData != 'undefined' && strData != null && strData != '') {
                //var data = strData.replace('[', '').replace(']', '').split(',');
                $(strData).each(function (i, val) {
                    html += "<div>" + val.Accomplishment + "</div>";
                });
            } else {
                html = "No data available.";
            }

            return html;
        }

        function detectIE() {
            var ua = window.navigator.userAgent;

            var msie = ua.indexOf('MSIE ');
            if (msie > 0) {
                // IE
                return true;
            }

            // other browser
            return false;
        }
    };

    EYC.Processing = {
        loading: null,
        startLoading: function () {
            EnsureScript('sp.ui.dialog.js', typeof (SP.UI.ModalDialog), function () { EYC.Processing.loading = SP.UI.ModalDialog.showWaitScreenWithNoClose('', 'Processing...'); });
        },
        endLoading: function () { try { EYC.Processing.loading.close(); EYC.Processing.loading = null; } catch (ex) { } }
    };
})();

$(document).ready(function () {
    //$("a[href*='userdisp']").on('click', function (e) {
    //    e.preventDefault();
    //    var link = $(this).attr('href');
    //    JSRequest.EnsureSetup();
    //    var userID = GetUrlKeyValue('ID', false, link);
    //    if (typeof userID != "undefined" || userID != "") {
    //        var meObj = new EYC.ME();
    //        meObj.getUserDetails(userID);
    //    }
    //});
    //.hover(
    //  function (e) {
    //      var link = $(this).attr('href');
    //      JSRequest.EnsureSetup();
    //      var userID = GetUrlKeyValue('ID', false, link);
    //      if (typeof userID != "undefined" || userID != "") {
    //          var meObj = new EYC.ME();
    //          meObj.getUserDetails(userID);
    //      }
    //  }, function () {
    //      $(".wrapper").dialog('close');
    //  });

    $("#instrHeader .ms-rteFontSize-3").on("click", function () {
        $("#instrBody").toggle();
        var src = $("#instrHeader img").attr("src");
        if (src.indexOf("down") > -1) {
            $("#instrHeader img").attr("src", "../SiteAssets/images/right-arrow-accordion.png");
        }
        else {
            $("#instrHeader img").attr("src", "../SiteAssets/images/down-arrow-accordion.png");
        }
    });

    //$(".s4-itm-cbx").replaceWith("<input type='button' value='I have an oppurtunity' />");

    //$("#sideNavBox").detach().insertBefore('#WebPartWPQ2');//('.ms-listviewtable');

    //$(".ms-cellStyleNonEditable input[type='button']").on('click', function () {
    //    alert('Oppurtunity Sent');
    //});
});

$.fn.stars = function () {
    return $(this).each(function () {
        // Get the value
        var val = parseFloat($(this).html());
        //val = Math.round(val * 4) / 4;
        // Make sure that the value is in 0 - 5 range, multiply to get width
        var size = Math.max(0, (Math.min(5, val))) * 16;
        // Create stars holder
        var $span = $('<span />').width(size);
        // Replace the numerical value with stars
        $(this).html($span);
    });
}