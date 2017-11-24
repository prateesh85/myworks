Type.registerNamespace("SP.UI.Reputation");
SP.UI.Reputation.AverageRatingFieldTemplate = function () { };
SP.UI.Reputation.AverageRatingFieldTemplate.createRenderingContextOverrides = function () {
    var a = new Context;
    a.Templates.Fields = {
        AverageRating: {
            View: SP.UI.Reputation.AverageRatingFieldTemplate.renderAverageRatingField,
            NewForm: SP.UI.Reputation.AverageRatingFieldTemplate.renderAverageRatingField,
            EditForm: SP.UI.Reputation.AverageRatingFieldTemplate.renderAverageRatingField,
            DisplayForm: SP.UI.Reputation.AverageRatingFieldTemplate.renderAverageRatingField
        }
    };
    a.OnPostRender = SP.UI.Reputation.AverageRatingFieldTemplate.onPostRender;
    return a
};
SP.UI.Reputation.AverageRatingFieldTemplate.renderAverageRatingField = function (a) {
    var e, f, m = "",
        g, h, i = "",
        j, n = "",
        o = "",
        k = "",
        p = true,
        l = "",
        d = null,
        b = SPClientTemplates.Utility.GetFormContextForCurrentField(a);
    if (!SP.ScriptHelpers.isNullOrUndefined(b)) {
        if (SP.ScriptHelpers.isNullOrUndefined(b.itemAttributes) || SP.ScriptHelpers.isNullOrUndefined(b.itemAttributes.Id) || SP.ScriptHelpers.isNullOrUndefined(b.itemAttributes.FsObjType) || SP.ScriptHelpers.isNullOrUndefined(b.listAttributes) || SP.ScriptHelpers.isNullOrUndefined(b.listAttributes.Id)) return "";
        e = b.itemAttributes.Id;
        f = b.webAttributes.CurrentUserId;
        g = b.itemAttributes.FsObjType;
        k = b.listAttributes.Direction;
        h = b.listAttributes.Id;
        if (!SP.ScriptHelpers.isNullOrUndefined(b.listAttributes.ListTemplateType)) i = b.listAttributes.ListTemplateType.toString();
        j = Number.parseLocale(b.fieldValue);
        l = b.webAttributes.WebUrl;
        SP.UI.Reputation.AverageRatingRenderer.isAnonymous = (SP.ScriptHelpers.isNullOrUndefined(b.webAttributes.CurrentUserId) || b.webAttributes.CurrentUserId < 1).toString()
    } else {
        if (SP.ScriptHelpers.isNullOrUndefined(a.CurrentItem) || SP.ScriptHelpers.isNullOrUndefined(a.CurrentItem.ID) || SP.ScriptHelpers.isNullOrUndefined(a.CurrentItem.FSObjType)) return "";
        e = a.CurrentItem.ID;
        f = a.ListSchema.Userid;
        g = a.CurrentItem.FSObjType;
        m = a.CurrentItem.ContentTypeId;
        h = a.listName;
        i = a.listTemplate;
        k = a.ListSchema.Direction;
        j = Number.parseLocale(a.CurrentItem.AverageRating);
        o = a.CurrentItem.Ratings;
        d = a.CurrentItem.RatedBy;
        if (!SP.ScriptHelpers.isNullOrUndefined(d)) n = d.length.toString();
        l = a.HttpRoot;
        a.CurrentFieldSchema.AllowGridEditing = "FALSE";
        a.CurrentFieldSchema.GridActiveAndReadOnly = "TRUE";
        SP.UI.Reputation.AverageRatingRenderer.isAnonymous = (SP.ScriptHelpers.isNullOrUndefined(a.ListSchema.Userid) || a.ListSchema.Userid < 1).toString();
        p = SP.UI.Reputation.AverageRatingFieldTemplate.$13(a.listTemplate, g, m)
    }
    if (!p) return "";
    if (SP.UI.Reputation.GlobalTemplateOverrides.$J) {
        RegisterSod("reputation.js", SP.ScriptHelpers.getLayoutsPageUrl("reputation.js", l));
        SP.UI.Reputation.GlobalTemplateOverrides.$J = false
    }
    if (!SP.UI.Reputation.AverageRatingFieldTemplate.$2) SP.UI.Reputation.AverageRatingFieldTemplate.$2 = [];
    var c = new SP.UI.Reputation.AverageRatingRenderer(e, f, j, n, d, o, h, i, true, k);
    Array.add(SP.UI.Reputation.AverageRatingFieldTemplate.$2, new SP.UI.Reputation.AverageRatingHandler(c.elementId, c.$$d_$w_0, c.$$d_$i_0, c.$$d_$y_0, c.$$d_$x_0));
    return c.render()
};
SP.UI.Reputation.AverageRatingFieldTemplate.onPostRender = function () {
    if (SP.ScriptHelpers.isNullOrUndefined(SP.UI.Reputation.AverageRatingFieldTemplate.$2)) return;
    for (var c = 0, g = SP.UI.Reputation.AverageRatingFieldTemplate.$2.length; c < g; c++) {
        var a = SP.UI.Reputation.AverageRatingFieldTemplate.$2[c];
        if (SP.ScriptHelpers.isNullOrUndefined(a)) continue;
        var d = $get(a.elementId);
        if (!SP.ScriptHelpers.isNullOrUndefined(d))
            for (var e = 0, h = d.childNodes.length; e < h; e++) {
                var b = d.childNodes[e];
                if (SP.UI.Reputation.AverageRatingRenderer.isAnonymous === "true") $addHandler(b, "click", a.onClickStopPropagationHandler);
                else {
                    $addHandler(b, "click", a.onClickHandler);
                    $addHandler(b, "mouseover", a.onMouseOverHandler);
                    $addHandler(b, "mouseout", a.onMouseOutHandler)
                }
            }
        var f = $get(a.elementId + "-count");
        !SP.ScriptHelpers.isNullOrUndefined(f) && $addHandler(f, "click", a.onClickStopPropagationHandler)
    }
    Array.clear(SP.UI.Reputation.AverageRatingFieldTemplate.$2)
};
SP.UI.Reputation.AverageRatingFieldTemplate.$13 = function (g, h, d) {
    var b = false;
    if (h === "0" || g === "108") b = true;
    else if (!SP.ScriptHelpers.isNullOrUndefinedOrEmpty(d))
        for (var c = SP.UI.Reputation.AverageRatingFieldTemplate.$b, e = c.length, a = 0; a < e; ++a) {
            var f = c[a];
            if (d.toUpperCase().startsWith(f.toUpperCase())) {
                b = true;
                break
            }
        }
    return b
};
SP.UI.Reputation.AverageRatingHandler = function (a, b, c, d, e) {
    this.elementId = a;
    this.onClickHandler = b;
    this.onClickStopPropagationHandler = c;
    this.onMouseOverHandler = d;
    this.onMouseOutHandler = e
};
SP.UI.Reputation.AverageRatingHandler.prototype = {
    elementId: null,
    onClickHandler: null,
    onClickStopPropagationHandler: null,
    onMouseOverHandler: null,
    onMouseOutHandler: null
};
SP.UI.Reputation.AverageRatingRenderer = function (j, h, c, b, f, g, e, d, i, a) {
    this.$$d_$j_0 = Function.createDelegate(this, this.$j_0);
    this.$$d_$k_0 = Function.createDelegate(this, this.$k_0);
    this.$$d_$x_0 = Function.createDelegate(this, this.$x_0);
    this.$$d_$y_0 = Function.createDelegate(this, this.$y_0);
    this.$$d_$i_0 = Function.createDelegate(this, this.$i_0);
    this.$$d_$w_0 = Function.createDelegate(this, this.$w_0);
    this.$1_0 = j;
    this.$P_0 = h;
    this.$g_0 = e;
    this.$V_0 = d;
    this.$C_0 = c;
    this.$7_0 = SP.ScriptHelpers.isNullOrUndefinedOrEmpty(b) ? "0" : b;
    this.$W_0 = f;
    this.$X_0 = g;
    this.$R_0 = i;
    if (SP.ScriptHelpers.isNullOrUndefinedOrEmpty(a) || a.toUpperCase() !== "RTL" && a.toUpperCase() !== "LTR") this.$Z_0 = !SP.ScriptHelpers.isNullOrUndefinedOrEmpty(document.documentElement.dir) && document.documentElement.dir.toUpperCase() === "RTL" ? true : false;
    else this.$Z_0 = a.toUpperCase() === "RTL" ? true : false;
    this.elementId = this.$n_0();
    this.$B_0 = this.$r_0();
    this.onClickHandler = this.$$d_$w_0;
    this.onClickStopPropagationHandler = this.$$d_$i_0;
    this.onMouseOverHandler = this.$$d_$y_0;
    this.onMouseOutHandler = this.$$d_$x_0
};
SP.UI.Reputation.AverageRatingRenderer.prototype = {
    onClickHandler: null,
    onClickStopPropagationHandler: null,
    onMouseOverHandler: null,
    onMouseOutHandler: null,
    elementId: null,
    $1_0: 0,
    $P_0: 0,
    $g_0: null,
    $V_0: null,
    $C_0: 0,
    $7_0: null,
    $X_0: null,
    $B_0: null,
    $f_0: null,
    $W_0: null,
    $R_0: false,
    $Z_0: false,
    $F_0: null,
    $5_0: null,
    render: function () {
        var a = new SP.HtmlBuilder;
        a.addCssClass("ms-comm-noWrap");
        if (this.$V_0 === "108") {
            a.addCssClass("ms-comm-cmdSpaceListItem");
            a.renderBeginTag("li")
        } else if (this.$V_0 === "301") a.renderBeginTag("span");
        else {
            a.addAttribute("align", "right");
            a.renderBeginTag("div")
        }
        this.$12_0(a);
        a.addCssClass("ms-comm-ratingSeparator");
        a.renderBeginTag("span");
        a.renderEndTag();
        this.$11_0(a);
        a.renderEndTag();
        return a.toString()
    },
    renderStars: function () {
        SP.UI.Reputation.AverageRatingRenderer.$A && SP.UI.Reputation.RatingsHelpers.$l(this.$R_0);
        this.$F_0 = this.$c_0();
        var e = new SP.HtmlBuilder,
            b = 1,
            c = this.$F_0;
        for (var d in c) {
            var f = {
                key: d,
                value: c[d]
            },
                a = "";
            a += '<a href="javascript:;">';
            a += "<span ";
            a += 'class="ms-comm-ratingsImageContainer"';
            if (SP.UI.Reputation.AverageRatingRenderer.isAnonymous.toUpperCase() !== "TRUE") a += this.$u_0(b);
            a += ">";
            a += "<img ";
            a += 'id="' + this.elementId + "-img-" + f.key + '" ';
            a += String.format('alt="' + SP.Utilities.LocUtility.getLocalizedCountValue(Strings.STS.L_SPRatingsNotRatedAltText, Strings.STS.L_SPRatingsNotRatedAltTextIntervals, b) + '"', b);
            a += 'src="' + f.value + '"/>';
            a += "</span>";
            a += "</a>";
            e.write(a);
            b++
        }
        return e.toString()
    },
    $12_0: function (a) {
        a.addAttribute("id", this.elementId);
        a.renderBeginTag("span");
        a.write(this.renderStars());
        a.renderEndTag()
    },
    $11_0: function (a) {
        a.addCssClass("ms-comm-ratingCountContainer");
        a.addAttribute("id", this.elementId + "-count");
        a.addAttribute("title", String.format(SP.Utilities.LocUtility.getLocalizedCountValue(Strings.STS.L_SPRatingsCountAltText, Strings.STS.L_SPRatingsCountAltTextIntervals, Number.parseLocale(this.$7_0)), this.$7_0));
        a.renderBeginTag("span");
        a.write(this.$7_0);
        a.renderEndTag()
    },
    $y_0: function (d) {
        if (SP.ScriptHelpers.isNullOrUndefined(d.target)) return;
        var c = null;
        switch (d.target.tagName) {
            case "A":
                c = d.target.firstChild.firstChild;
                break;
            case "SPAN":
                c = d.target.firstChild;
                break;
            case "IMG":
                c = d.target
        }
        if (!SP.ScriptHelpers.isNullOrUndefined(c)) {
            var e = SP.UI.Reputation.RatingsHelpers.$d(c.id),
                a = 0,
                b = 6;
            while (a !== e || b !== e) {
                if (a !== e) {
                    a = a + 1;
                    var f = $get(this.elementId + "-img-" + a.toString());
                    if (!SP.ScriptHelpers.isNullOrUndefined(f)) f.src = SP.UI.Reputation.AverageRatingRenderer.ImageUrls.$M
                }
                if (b !== e) {
                    b = b - 1;
                    if (b !== a) {
                        var g = $get(this.elementId + "-img-" + b.toString());
                        if (!SP.ScriptHelpers.isNullOrUndefined(g)) g.src = SP.UI.Reputation.AverageRatingRenderer.ImageUrls.$L
                    }
                }
            }
        }
    },
    $x_0: function (c) {
        if (SP.ScriptHelpers.isNullOrUndefined(c.target) || SP.ScriptHelpers.isNullOrUndefined(c.target.parentNode)) return;
        for (var a = 1; a <= 5; a++) {
            var b = $get(this.elementId + "-img-" + a.toString());
            if (!SP.ScriptHelpers.isNullOrUndefined(b)) b.src = this.$F_0[a.toString()].toString()
        }
    },
    $w_0: function (d) {
        d.preventDefault();
        var a = d.target;
        if (SP.ScriptHelpers.isNullOrUndefined(a)) {
            a = d.rawEvent.srcElement;
            if (SP.ScriptHelpers.isNullOrUndefined(a)) return
        }
        var c = null;
        switch (a.tagName) {
            case "A":
                c = a.firstChild;
                break;
            case "SPAN":
                c = a;
                break;
            case "IMG":
                c = a.parentNode
        }
        if (!SP.ScriptHelpers.isNullOrUndefined(c) && !SP.ScriptHelpers.isNullOrUndefined(c.firstChild)) {
            var e = c.firstChild;
            e.src = SP.UI.Reputation.AverageRatingRenderer.ImageUrls.$K;
            var f = SP.UI.Reputation.RatingsHelpers.$d(e.id),
                b = this;
            EnsureScriptFunc("reputation.js", "Microsoft.Office.Server.ReputationModel.Reputation", function () {
                var a = new SP.ClientContext;
                b.$5_0 = Microsoft.Office.Server.ReputationModel.Reputation.setRating(a, b.$g_0, b.$1_0, f);
                a.executeQueryAsync(b.$$d_$k_0, b.$$d_$j_0);
                b.$f_0 = f.toString()
            })
        }
        d.stopPropagation()
    },
    $i_0: function (a) {
        a.stopPropagation()
    },
    $k_0: function () {
        if (SP.ScriptHelpers.isNullOrUndefined(this.$5_0) || SP.ScriptHelpers.isNullOrUndefined(this.$5_0.get_value())) return;
        this.$C_0 = this.$5_0.get_value();
        this.$F_0 = this.$c_0();
        for (var a = 1; a <= 5; a++) {
            var b = $get(this.elementId + "-img-" + a.toString());
            if (!SP.ScriptHelpers.isNullOrUndefined(b)) b.src = this.$F_0[a.toString()].toString()
        }
        if (SP.ScriptHelpers.isNullOrUndefinedOrEmpty(this.$B_0)) {
            var c = $get(this.elementId + "-count");
            if (!SP.ScriptHelpers.isNullOrUndefined(c)) {
                this.$7_0 = (Number.parseInvariant(this.$7_0) + 1).toString();
                c.innerHTML = this.$7_0;
                this.$B_0 = this.$f_0
            }
        }
    },
    $j_0: function (b, a) {
        alert(a.get_message())
    },
    $u_0: function (b) {
        var a = "";
        if (SP.ScriptHelpers.isNullOrUndefinedOrEmpty(this.$B_0)) a = String.format('title="' + SP.Utilities.LocUtility.getLocalizedCountValue(Strings.STS.L_SPRatingsNotRatedAltText, Strings.STS.L_SPRatingsNotRatedAltTextIntervals, b) + '"', b);
        else a = String.format('title="' + SP.Utilities.LocUtility.getLocalizedCountValue(Strings.STS.L_SPRatingsRatedAltText, Strings.STS.L_SPRatingsRatedAltTextIntervals, Number.parseLocale(this.$B_0)) + '"', this.$B_0);
        return a
    },
    $r_0: function () {
        var f = "";
        if (!SP.ScriptHelpers.isNullOrUndefinedOrEmpty(this.$X_0) && !SP.ScriptHelpers.isNullOrUndefined(this.$P_0)) {
            var a = [];
            Array.addRange(a, this.$X_0.split(","));
            for (var b = 0, k = a.length; b < k; b++) SP.ScriptHelpers.isNullOrUndefinedOrEmpty(a[b].toString()) && Array.removeAt(a, b);
            if (this.$R_0) {
                var c = this.$W_0;
                if (!SP.ScriptHelpers.isNullOrUndefined(c) && a.length === c.length)
                    for (var h = null, d = 0, l = c.length; d < l; d++) {
                        h = c[d];
                        if (h.id === this.$P_0.toString()) {
                            f = a[d].toString();
                            break
                        }
                    }
            } else {
                var i = this.$W_0;
                if (!SP.ScriptHelpers.isNullOrUndefinedOrEmpty(i)) {
                    var m = new RegExp("(\\d+);#", "g"),
                        g = i.match(m);
                    if (a.length === g.length)
                        for (var e = 0, n = g.length; e < n; e++) {
                            var j = g[e],
                                o = j.substr(0, j.length - 2);
                            if (o === this.$P_0.toString()) {
                                f = a[e].toString();
                                break
                            }
                        }
                }
            }
        }
        return f
    },
    $n_0: function () {
        var a = "averageRatingElement-";
        if (SP.ScriptHelpers.isNullOrUndefined($get(a + this.$1_0))) a += this.$1_0;
        else a += "best" + this.$1_0;
        return a
    },
    $c_0: function () {
        for (var d = {}, b = this.$C_0 - Math.floor(this.$C_0), e = this.$C_0 - b, a = "", c = 1; c <= 5; c++) {
            if (e > 0) {
                a = SP.UI.Reputation.AverageRatingRenderer.ImageUrls.$I;
                e--
            } else if (b > 0) {
                if (b >= .25 && b <= .75)
                    if (this.$Z_0) a = SP.UI.Reputation.AverageRatingRenderer.ImageUrls.$O;
                    else a = SP.UI.Reputation.AverageRatingRenderer.ImageUrls.$N;
                else if (b > .75) a = SP.UI.Reputation.AverageRatingRenderer.ImageUrls.$I;
                else a = SP.UI.Reputation.AverageRatingRenderer.ImageUrls.$H;
                b = 0
            } else a = SP.UI.Reputation.AverageRatingRenderer.ImageUrls.$H;
            d[c.toString()] = a
        }
        return d
    }
};
SP.UI.Reputation.AverageRatingRenderer.ImageUrls = function () { };
SP.UI.Reputation.RatingsHelpers = function () { };
SP.UI.Reputation.RatingsHelpers.$d = function (a) {
    var b = a.substr(a.length - 1);
    return Number.parseInvariant(b)
};
SP.UI.Reputation.RatingsHelpers.$l = function (a) {
    if (a) {
        SP.UI.Reputation.AverageRatingRenderer.ImageUrls.$K = GetThemedImageUrl("RatingsLargeStarFilled.png");
        SP.UI.Reputation.AverageRatingRenderer.ImageUrls.$H = GetThemedImageUrl("RatingsSmallStarEmpty.png");
        SP.UI.Reputation.AverageRatingRenderer.ImageUrls.$I = GetThemedImageUrl("RatingsSmallStarFilled.png");
        SP.UI.Reputation.AverageRatingRenderer.ImageUrls.$N = GetThemedImageUrl("RatingsSmallStarLeftHalfFilled.png");
        SP.UI.Reputation.AverageRatingRenderer.ImageUrls.$O = GetThemedImageUrl("RatingsSmallStarRightHalfFilled.png");
        SP.UI.Reputation.AverageRatingRenderer.ImageUrls.$L = GetThemedImageUrl("RatingsSmallStarHoveroverEmpty.png");
        SP.UI.Reputation.AverageRatingRenderer.ImageUrls.$M = GetThemedImageUrl("RatingsSmallStarHoveroverFilled.png")
    } else {
        SP.UI.Reputation.AverageRatingRenderer.ImageUrls.$K = SP.UI.Reputation.RatingsHelpers.$6("RatingsLargeStarFilled.png");
        SP.UI.Reputation.AverageRatingRenderer.ImageUrls.$H = SP.UI.Reputation.RatingsHelpers.$6("RatingsSmallStarEmpty.png");
        SP.UI.Reputation.AverageRatingRenderer.ImageUrls.$I = SP.UI.Reputation.RatingsHelpers.$6("RatingsSmallStarFilled.png");
        SP.UI.Reputation.AverageRatingRenderer.ImageUrls.$N = SP.UI.Reputation.RatingsHelpers.$6("RatingsSmallStarLeftHalfFilled.png");
        SP.UI.Reputation.AverageRatingRenderer.ImageUrls.$O = SP.UI.Reputation.RatingsHelpers.$6("RatingsSmallStarRightHalfFilled.png");
        SP.UI.Reputation.AverageRatingRenderer.ImageUrls.$L = SP.UI.Reputation.RatingsHelpers.$6("RatingsSmallStarHoveroverEmpty.png");
        SP.UI.Reputation.AverageRatingRenderer.ImageUrls.$M = SP.UI.Reputation.RatingsHelpers.$6("RatingsSmallStarHoveroverFilled.png")
    }
    SP.UI.Reputation.AverageRatingRenderer.$A = false
};
SP.UI.Reputation.RatingsHelpers.$6 = function (c) {
    var a = "",
        b = $get(c);
    if (!SP.ScriptHelpers.isNullOrUndefined(b)) a = b.src;
    return a
};
SP.UI.Reputation.LikesFieldTemplate = function () { };
SP.UI.Reputation.LikesFieldTemplate.createRenderingContextOverrides = function () {
    var a = new Context;
    a.Templates.Fields = {
        Likes: {
            View: SP.UI.Reputation.LikesFieldTemplate.renderLikesField
        }
    };
    a.OnPostRender = SP.UI.Reputation.LikesFieldTemplate.onPostRender;
    return a
};
SP.UI.Reputation.LikesFieldTemplate.renderLikesField = function (a) {
    if (SP.ScriptHelpers.isNullOrUndefined(a.CurrentItem) || SP.ScriptHelpers.isNullOrUndefined(a.CurrentItem.ID)) return "";
    if (a.listTemplate !== "108" && !SP.UI.Reputation.LikesFieldTemplate.$v(a.CurrentItem) && (SP.ScriptHelpers.isNullOrUndefined(a.CurrentItem.FSObjType) || a.CurrentItem.FSObjType === "1")) return "";
    if (SP.UI.Reputation.GlobalTemplateOverrides.$J) {
        RegisterSod("reputation.js", SP.ScriptHelpers.getLayoutsPageUrl("reputation.js", a.HttpRoot));
        SP.UI.Reputation.GlobalTemplateOverrides.$J = false
    }
    if (!SP.UI.Reputation.LikesFieldTemplate.$4) SP.UI.Reputation.LikesFieldTemplate.$4 = [];
    var b = new SP.UI.Reputation.LikesRenderer(a);
    SP.UI.Reputation.LikesRenderer.$U = (SP.ScriptHelpers.isNullOrUndefined(a.ListSchema.Userid) || a.ListSchema.Userid < 1).toString();
    Array.add(SP.UI.Reputation.LikesFieldTemplate.$4, new SP.UI.Reputation.LikesHandler(b.$9_0, b.$$d_onClick, b.$$d_$i_0));
    if (SP.UI.Reputation.LikesFieldTemplate.$A) {
        SP.UI.Reputation.LikesHelpers.$l();
        SP.UI.Reputation.LikesFieldTemplate.$A = false
    }
    a.CurrentFieldSchema.AllowGridEditing = "FALSE";
    a.CurrentFieldSchema.GridActiveAndReadOnly = "TRUE";
    return b.render()
};
SP.UI.Reputation.LikesFieldTemplate.onPostRender = function () {
    if (SP.ScriptHelpers.isNullOrUndefined(SP.UI.Reputation.LikesFieldTemplate.$4)) return;
    for (var c = 0, d = SP.UI.Reputation.LikesFieldTemplate.$4.length; c < d; c++) {
        var a = SP.UI.Reputation.LikesFieldTemplate.$4[c];
        if (SP.ScriptHelpers.isNullOrUndefined(a)) continue;
        var b = $get(a.elementId);
        if (!SP.ScriptHelpers.isNullOrUndefined(b)) {
            if (SP.UI.Reputation.LikesRenderer.$U === "true") $addHandler(b, "click", a.onClickStopPropagationHandler);
            else $addHandler(b, "click", a.onClickHandler);
            $addHandler(b, "contextmenu", a.onClickStopPropagationHandler)
        }
    }
    Array.clear(SP.UI.Reputation.LikesFieldTemplate.$4)
};
SP.UI.Reputation.LikesFieldTemplate.$v = function (b) {
    var a = b.ContentTypeId;
    return !SP.ScriptHelpers.isNullOrUndefinedOrEmpty(a) ? a.startsWith("0x0120D520A808") : false
};
SP.UI.Reputation.LikesHandler = function (a, b, c) {
    this.elementId = a;
    this.onClickHandler = b;
    this.onClickStopPropagationHandler = c
};
SP.UI.Reputation.LikesHandler.prototype = {
    elementId: null,
    onClickHandler: null,
    onClickStopPropagationHandler: null
};
SP.UI.Reputation.LikesRenderer = function (a) {
    this.$$d_$j_0 = Function.createDelegate(this, this.$j_0);
    this.$$d_$k_0 = Function.createDelegate(this, this.$k_0);
    this.$$d_$i_0 = Function.createDelegate(this, this.$i_0);
    this.$$d_onClick = Function.createDelegate(this, this.onClick);
    this.$Q_0 = a;
    this.$3_0 = a.CurrentItem;
    this.$1_0 = this.$3_0.ID;
    this.$G_0 = this.$3_0.LikesCount;
    this.$9_0 = this.$o_0();
    this.$Y_0 = this.$p_0();
    if (!SP.ScriptHelpers.isNullOrUndefined(a.ListSchema) && !SP.ScriptHelpers.isNullOrUndefined(a.ListSchema.Userid)) this.$D_0 = a.ListSchema.Userid.toString();
    this.$E_0 = this.$q_0();
    this.$8_0 = this.$E_0 < 0
};
SP.UI.Reputation.LikesRenderer.prototype = {
    $9_0: null,
    $Y_0: null,
    $e_0: false,
    $8_0: false,
    $1_0: 0,
    $E_0: 0,
    $G_0: null,
    $D_0: null,
    $Q_0: null,
    $3_0: null,
    $5_0: null,
    render: function () {
        var a = new SP.HtmlBuilder,
            b = "span";
        if (this.$Q_0.listTemplate === "108") {
            b = "li";
            a.addCssClass("ms-comm-cmdSpaceListItem");
            a.addCssClass("ms-noList")
        }
        a.addAttribute("id", this.$Y_0);
        a.renderBeginTag(b);
        a.write(this.renderLink(this.$9_0));
        a.renderEndTag();
        return a.toString()
    },
    renderLink: function (b) {
        var a = new SP.HtmlBuilder;
        !SP.ScriptHelpers.isNullOrUndefinedOrEmpty(this.$G_0) && this.$G_0 !== "0" && this.$10_0(a);
        a.addAttribute("href", "javascript:;");
        a.addAttribute("id", b);
        a.addAttribute("class", "ms-secondaryCommandLink");
        a.renderBeginTag("a");
        a.write(SP.UI.Reputation.LikesHelpers.$t(this.$8_0));
        a.renderEndTag();
        return a.toString()
    },
    $10_0: function (a) {
        var e = Number.parseLocale(this.$G_0),
            c = !this.$8_0,
            f = this.$3_0.LikedBy,
            b = "";
        if (c) b = SP.UI.Reputation.LikesHelpers.ImageUrls.$T;
        else b = SP.UI.Reputation.LikesHelpers.ImageUrls.$S;
        a.addCssClass("ms-comm-likesMetadata ms-metadata");
        var d = SP.UI.Reputation.LikesHelpers.$s(this.$3_0, SP.UI.Reputation.LikesRenderer.$h, this.$D_0, c);
        !SP.ScriptHelpers.isNullOrUndefinedOrEmpty(d) && a.addAttribute("title", d);
        a.renderBeginTag("span");
        a.addCssClass("ms-comm-likesImgContainer");
        a.renderBeginTag("span");
        a.addAttribute("src", b);
        a.renderBeginTag("img");
        a.renderEndTag();
        a.renderEndTag();
        a.addCssClass("ms-comm-likesCount ms-comm-reputationNumbers");
        a.renderBeginTag("span");
        a.write(e.toString());
        a.renderEndTag();
        a.renderEndTag()
    },
    $i_0: function (a) {
        a.preventDefault();
        a.stopPropagation()
    },
    onClick: function (c) {
        c.preventDefault();
        var b = c.target;
        if (!SP.ScriptHelpers.isNullOrUndefined(b)) b.disabled = true;
        var a = this;
        EnsureScriptFunc("reputation.js", "Microsoft.Office.Server.ReputationModel.Reputation", function () {
            var b = new SP.ClientContext;
            a.$5_0 = Microsoft.Office.Server.ReputationModel.Reputation.setLike(b, a.$Q_0.listName, a.$1_0, a.$8_0);
            b.executeQueryAsync(a.$$d_$k_0, a.$$d_$j_0)
        })
    },
    $k_0: function () {
        if (SP.ScriptHelpers.isNullOrUndefined(this.$5_0) || SP.ScriptHelpers.isNullOrUndefined(this.$5_0.get_value())) return;
        this.$G_0 = this.$5_0.get_value().toString();
        this.$8_0 = !this.$8_0;
        if (this.$8_0) {
            SP.UI.Reputation.LikesHelpers.$z(this.$3_0, this.$D_0, this.$E_0);
            this.$E_0 = -1
        } else this.$E_0 = SP.UI.Reputation.LikesHelpers.$m(this.$3_0, this.$D_0);
        var d = $get(this.$Y_0);
        if (!SP.ScriptHelpers.isNullOrUndefined(d)) {
            d.innerHTML = this.renderLink(this.$9_0);
            var b = $get(this.$9_0);
            if (!SP.ScriptHelpers.isNullOrUndefined(b)) {
                $addHandler(b, "click", this.$$d_onClick);
                $addHandler(b, "contextmenu", this.$$d_$i_0)
            }
        }
        var a = "likesElement-" + (!this.$e_0 ? "best" : "") + this.$1_0,
            f = "root-" + a,
            e = $get(f);
        if (!SP.ScriptHelpers.isNullOrUndefined(e)) {
            e.innerHTML = this.renderLink(a);
            var c = $get(a);
            if (!SP.ScriptHelpers.isNullOrUndefined(c)) {
                $addHandler(c, "click", this.$$d_onClick);
                $addHandler(c, "contextmenu", this.$$d_$i_0)
            }
        }
    },
    $j_0: function (c, b) {
        var a = $get(this.$9_0);
        if (!SP.ScriptHelpers.isNullOrUndefined(a)) a.disabled = false;
        alert(b.get_message())
    },
    $o_0: function () {
        var a = "likesElement-";
        if (SP.ScriptHelpers.isNullOrUndefined($get(a + this.$1_0))) a += this.$1_0;
        else a += "best" + this.$1_0;
        return a
    },
    $p_0: function () {
        var a = "root-likesElement-";
        if (SP.ScriptHelpers.isNullOrUndefined($get(a + this.$1_0))) a += this.$1_0;
        else {
            a += "best" + this.$1_0;
            this.$e_0 = true
        }
        return a
    },
    $q_0: function () {
        var b = this.$3_0.LikedBy;
        if (!SP.ScriptHelpers.isNullOrUndefined(b))
            for (var a = 0, c = b.length; a < c; a++) {
                var d = b[a];
                if (d.id === this.$D_0) return a
            }
        return -1
    }
};
SP.UI.Reputation.LikesHelpers = function () { };
SP.UI.Reputation.LikesHelpers.$t = function (a) {
    return a ? Strings.STS.L_SPDiscLike : Strings.STS.L_SPDiscUnlike
};
SP.UI.Reputation.LikesHelpers.$s = function (f, e, g, h) {
    var a = "",
        b = f.LikedBy;
    if (!SP.ScriptHelpers.isNullOrUndefined(b)) {
        var c = b.length;
        if (h) a += Strings.STS.L_CalloutLastEditedYou;
        while (c > 0 && e > 0) {
            c--;
            var d = b[c];
            if (d.id === g) continue;
            if (!SP.ScriptHelpers.isNullOrUndefinedOrEmpty(a)) a += "&#013";
            a += SP.Utilities.HttpUtility.htmlEncode(d.title);
            e--
        }
    }
    return a
};
SP.UI.Reputation.LikesHelpers.$m = function (c, d) {
    var a = c.LikedBy;
    if (SP.ScriptHelpers.isNullOrUndefined(a) || !a.length) a = [];
    var b = new UserInfo;
    b.id = d;
    Array.add(a, b);
    c.LikedBy = a;
    return a.length - 1
};
SP.UI.Reputation.LikesHelpers.$z = function (b, d, c) {
    var a = b.LikedBy;
    if (!SP.ScriptHelpers.isNullOrUndefined(a))
        if (a.length > c) {
            Array.removeAt(a, c);
            b.LikedBy = a
        }
};
SP.UI.Reputation.LikesHelpers.$l = function () {
    SP.UI.Reputation.LikesHelpers.ImageUrls.$S = GetThemedImageUrl("Like.11x11x32.png");
    SP.UI.Reputation.LikesHelpers.ImageUrls.$T = GetThemedImageUrl("LikeFull.11x11x32.png")
};
SP.UI.Reputation.LikesHelpers.ImageUrls = function () { };

function Context() {
    this.Templates = {}
}
Context.prototype = {
    CurrentFieldSchema: null,
    CurrentItem: null,
    HttpRoot: null,
    listName: null,
    listTemplate: null,
    ListSchema: null,
    OnPreRender: null,
    OnPostRender: null
};

function FormContext() { }
FormContext.prototype = {
    controlMode: 0,
    fieldName: null,
    fieldSchema: null,
    fieldValue: null,
    itemAttributes: null,
    listAttributes: null,
    webAttributes: null
};

function UserInfo() { }
UserInfo.prototype = {
    email: null,
    id: null,
    picture: null,
    sip: null,
    title: null,
    value: null
};
SP.UI.Reputation.GlobalTemplateOverrides = function () { };
SP.UI.Reputation.GlobalTemplateOverrides.$$cctor = function () {
    SPClientTemplates.TemplateManager.RegisterTemplateOverrides(SP.UI.Reputation.LikesFieldTemplate.createRenderingContextOverrides());
    SPClientTemplates.TemplateManager.RegisterTemplateOverrides(SP.UI.Reputation.AverageRatingFieldTemplate.createRenderingContextOverrides())
};
SP.UI.Reputation.AverageRatingFieldTemplate.registerClass("SP.UI.Reputation.AverageRatingFieldTemplate");
SP.UI.Reputation.AverageRatingHandler.registerClass("SP.UI.Reputation.AverageRatingHandler");
SP.UI.Reputation.AverageRatingRenderer.registerClass("SP.UI.Reputation.AverageRatingRenderer");
SP.UI.Reputation.AverageRatingRenderer.ImageUrls.registerClass("SP.UI.Reputation.AverageRatingRenderer.ImageUrls");
SP.UI.Reputation.RatingsHelpers.registerClass("SP.UI.Reputation.RatingsHelpers");
SP.UI.Reputation.LikesFieldTemplate.registerClass("SP.UI.Reputation.LikesFieldTemplate");
SP.UI.Reputation.LikesHandler.registerClass("SP.UI.Reputation.LikesHandler");
SP.UI.Reputation.LikesRenderer.registerClass("SP.UI.Reputation.LikesRenderer");
SP.UI.Reputation.LikesHelpers.registerClass("SP.UI.Reputation.LikesHelpers");
SP.UI.Reputation.LikesHelpers.ImageUrls.registerClass("SP.UI.Reputation.LikesHelpers.ImageUrls");
Context.registerClass("Context");
FormContext.registerClass("FormContext");
UserInfo.registerClass("UserInfo");
SP.UI.Reputation.GlobalTemplateOverrides.registerClass("SP.UI.Reputation.GlobalTemplateOverrides");

function sp_ui_reputation_initialize() {
    SP.UI.Reputation.AverageRatingFieldTemplate.$b = ["0x0120d5"];
    SP.UI.Reputation.AverageRatingFieldTemplate.$2 = null;
    SP.UI.Reputation.AverageRatingRenderer.isAnonymous = "false";
    SP.UI.Reputation.AverageRatingRenderer.$A = true;
    SP.UI.Reputation.AverageRatingRenderer.ImageUrls.$K = "";
    SP.UI.Reputation.AverageRatingRenderer.ImageUrls.$H = "";
    SP.UI.Reputation.AverageRatingRenderer.ImageUrls.$I = "";
    SP.UI.Reputation.AverageRatingRenderer.ImageUrls.$N = "";
    SP.UI.Reputation.AverageRatingRenderer.ImageUrls.$O = "";
    SP.UI.Reputation.AverageRatingRenderer.ImageUrls.$L = "";
    SP.UI.Reputation.AverageRatingRenderer.ImageUrls.$M = "";
    SP.UI.Reputation.LikesFieldTemplate.$4 = null;
    SP.UI.Reputation.LikesFieldTemplate.$A = true;
    SP.UI.Reputation.LikesRenderer.$h = 20;
    SP.UI.Reputation.LikesRenderer.$U = "false";
    SP.UI.Reputation.LikesHelpers.ImageUrls.$T = "";
    SP.UI.Reputation.LikesHelpers.ImageUrls.$S = "";
    SP.UI.Reputation.GlobalTemplateOverrides.$J = true;
    SP.UI.Reputation.GlobalTemplateOverrides.$$cctor()
}
sp_ui_reputation_initialize();
RegisterModuleInit("sp.ui.reputation.js", sp_ui_reputation_initialize);
typeof Sys != "undefined" && Sys && Sys.Application && Sys.Application.notifyScriptLoaded();
NotifyScriptLoadedAndExecuteWaitingJobs("sp.ui.reputation.js");