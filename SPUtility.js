/*
   Name: SPUtility.js
   Version: 0.14.2
   Built: 2016-04-19
   Author: Kit Menke
   https://sputility.codeplex.com/
   Copyright (c) 2016
   License: The MIT License (MIT)
*/
Object.create || (Object.create = function (a) {
    function b() { }
    if (arguments.length > 1) throw new Error("Object.create implementation only accepts the first parameter.");
    return b.prototype = a, new b
});
var SPUtility = function (a) {
    "use strict";

    function b() {
        return null === X && (X = a("table.ms-formtoolbar input[value='Close']").length >= 1), X
    }

    function c() {
        return navigator.userAgent.toLowerCase().indexOf("msie") >= 0
    }

    function d(a) {
        return "undefined" == typeof a
    }

    function e(a) {
        return "string" == typeof a
    }

    function f(a) {
        return "number" == typeof a
    }

    function g(a) {
        return parseInt(a, 10)
    }

    function h(a) {
        return a.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1")
    }

    function i(a, b, c) {
        return a.replace(new RegExp(h(b), "g"), c)
    }

    function j(a) {
        return "string" == typeof a && (a = i(a, " ", ""), a = i(a, Z.thousandsSeparator, ""), a = a.replace(Z.decimalSeparator, "."), a = parseFloat(a)), a
    }

    function k(a) {
        return String(a).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/''/g, "&#39;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    }

    function l() {
        return 15 === Y
    }

    function m(a, b, c, d) {
        b = isNaN(b = Math.abs(b)) ? 2 : b, c = void 0 === c ? Z.decimalSeparator : c, d = void 0 === d ? Z.thousandsSeparator : d;
        var e = 0 > a ? "-" : "",
            f = parseInt(a = Math.abs(+a || 0).toFixed(b), 10) + "",
            g = (g = f.length) > 3 ? g % 3 : 0;
        return e + (g ? f.substr(0, g) + d : "") + f.substr(g).replace(/(\d{3})(?=\d)/g, "$1" + d) + (b ? c + Math.abs(a - f).toFixed(b).slice(2) : "")
    }

    function n(b) {
        if (null === b.Controls) return null;
        var c = a(b.Controls).find("input");
        if (null !== c && 1 === c.length) return c[0];
        throw "Unable to retrieve the input control for " + b.Name
    }

    function o(b, c) {
        var d, e = [],
            f = a(b.Controls).find(c),
            g = a(b.Controls).find("label");
        if (g.length < f.length) throw "Unable to get hashtable of controls.";
        for (d = 0; d < f.length; d++) e.push({
            key: a(g[d]).text(),
            value: f[d]
        });
        return e
    }

    function p(b, c) {
        var d = null;
        return a(b).each(function (a, b) {
            return b.key === c ? (d = b.value, !1) : void 0
        }), d
    }

    function q(b, c) {
        for (var d = 0; d < b.childNodes.length; d += 1)
            if (8 === b.childNodes[d].nodeType) {
                var e = b.childNodes[d].data,
                    f = e.match(/SPField\w+/);
                null !== f && f.length > 0 && (c.type = f[0]);
                var g = e.match(/FieldName="[^"]+/);
                null !== g && g.length > 0 && (c.name = g[0].substring(11));
                var h = e.match(/FieldInternalName="\w+/);
                null !== h && h.length > 0 && (c.internalName = h[0].substring(19));
                break
            }
        null === c.type && a(b).find("select[name$=ContentTypeChoice]").length > 0 && (c.type = "ContentTypeChoice", c.internalName = "ContentType", c.name = "Content Type")
    }

    function r(b) {
        var c = null,
            d = null,
            e = a(b).siblings(".ms-formlabel");
        if (null !== e) {
            var f = e.children("h3");
            if (c = f.length > 0 ? f[0] : e, null !== c && "NOBR" !== c.nodeName) {
                var g = a.trim(a(c).text());
                g.length > 2 && " *" === g.substring(g.length - 2) && (d = !0)
            }
        }
        var h = {
            name: null,
            internalName: null,
            label: null !== c ? a(c) : null,
            labelRow: null !== c ? c.parentNode : null,
            labelCell: e,
            isRequired: d,
            controlsRow: b.parentNode,
            controlsCell: b,
            type: null,
            spField: null
        };
        return q(b, h), h
    }

    function s() {
        if (null === V || null === W) {
            "object" == typeof _spPageContextInfo && (Y = 15 === _spPageContextInfo.webUIVersion ? 15 : 14), V = {}, W = {};
            for (var b = a("table.ms-formtable td.ms-formbody"), c = 0; c < b.length; c += 1) {
                var d = r(b[c]);
                null !== d && (V[d.name] = d, W[d.internalName] = d)
            }
        }
    }

    function t(b, c, d) {
        d ? (null !== b && a(b).show(), a(c).show()) : (null !== b && a(b).hide(), a(c).hide())
    }

    function u(a, b) {
        s();
        var c = V[a];
        if (d(c)) throw "toggleSPField: Unable to find a SPField named " + a + " - " + b;
        t(c.labelRow, c.controlsRow, b)
    }

    function v(b) {
        this.Label = b.label, this.LabelRow = b.labelRow, this.Name = b.name, this.InternalName = b.internalName, this.IsRequired = b.isRequired, this.Type = b.type;
        var c = a(b.controlsCell).children().not("script");
        c.length > 0 ? this.Controls = c[0] : this.Controls = null, this.ControlsRow = b.controlsRow, this.ReadOnlyLabel = null
    }

    function w(a) {
        v.call(this, a), this.Textbox = n(this)
    }

    function x(a) {
        w.call(this, a)
    }

    function y(a) {
        x.call(this, a), this.FormatOptions = {
            eventHandler: null,
            autoCorrect: !1,
            decimalPlaces: 2
        }
    }

    function z(a) {
        v.call(this, a), null !== this.Controls && (this.Dropdown = this.Controls)
    }

    function A(b) {
        if (v.call(this, b), null !== this.Controls) {
            var c = a(this.Controls).find("input"),
                d = c.length;
            d > 1 && "text" === c[d - 1].type ? (this.FillInTextbox = c[d - 1], this.FillInElement = c[d - 2], this.FillInAllowed = !0) : (this.FillInAllowed = !1, this.FillInTextbox = null, this.FillInElement = null)
        }
    }

    function B(a, b) {
        A.call(this, a), null !== this.Controls && (this.Dropdown = b, this.Dropdown = 1 === this.Dropdown.length ? this.Dropdown[0] : [])
    }

    function C(a) {
        A.call(this, a), null !== this.Controls && (this.RadioButtons = o(this, 'input[type="radio"]'), this.FillInAllowed && this.RadioButtons.pop())
    }

    function D(a) {
        A.call(this, a), null !== this.Controls && (this.Checkboxes = o(this, 'input[type="checkbox"]'), this.FillInAllowed && (this.FillInElement = this.Checkboxes.pop().value))
    }

    function E(a, b, c, e, f, g, h) {
        this.Year = null, this.Month = null, this.Day = null, this.IsTimeIncluded = !1, this.Hour = null, this.Minute = null, this.TimeFormat = null, this.DateSeparator = null, d(a) || d(b) || d(c) || (this.SetDate(a, b, c), d(e) || d(f) || (this.SetTime(e, f), d(g) || (this.TimeFormat = g, d(h) || (this.DateSeparator = h))))
    }

    function F(b) {
        if (v.call(this, b), this.DateTextbox = n(this), this.HourDropdown = null, this.MinuteDropdown = null, this.IsDateOnly = !0, this.HourValueFormat = null, null !== this.Controls) {
            var c = a(this.Controls).find("select");
            null !== c && 2 === c.length && (this.HourDropdown = c[0], a(this.HourDropdown).val().indexOf(" ") > -1 ? this.HourValueFormat = "string" : this.HourValueFormat = "number", this.MinuteDropdown = c[1], this.IsDateOnly = !1)
        }
    }

    function G(a) {
        v.call(this, a), this.Checkbox = n(this)
    }

    function H(b) {
        if (v.call(this, b), null !== this.Controls) {
            this.TextboxURL = null, this.TextboxDescription = null, this.TextOnly = !1;
            var c = a(this.Controls).find("input");
            null !== c && 2 === c.length && (this.TextboxURL = a(c[0]), this.TextboxDescription = a(c[1]))
        }
    }

    function I(a, b) {
        if (v.call(this, a), null !== this.Controls) {
            if (1 !== b.length) throw "Unable to get dropdown element for " + this.Name;
            this.Dropdown = b[0]
        }
    }

    function J(b, c) {
        if (v.call(this, b), null !== this.Controls) {
            if (1 !== c.length) throw "Unable to get input elements for " + this.Name;
            this.Textbox = a(c[0]), this.HiddenTextbox = a('input[id="' + this.Textbox.attr("optHid") + '"]')
        }
    }

    function K(a, b) {
        v.call(this, a), this.Textbox = b, this.TextType = "Plain"
    }

    function L(a, b) {
        K.call(this, a, b), this.TextType = "Rich"
    }

    function M(b, c) {
        v.call(this, b), this.Textbox = c[0], this.ContentDiv = a(this.Controls).find('div[contenteditable="true"]')[0], this.TextType = "Enhanced"
    }

    function N(b) {
        w.call(this, b), this.FileExtension = a(this.Textbox).parent().text()
    }

    function O(b) {
        if (v.call(this, b), null !== this.Controls) {
            var c = a(this.Controls).find("select");
            if (2 !== c.length) throw "Error initializing SPLookupMultiField named " + this.Name + ", unable to get select controls.";
            this.ListChoices = c[0], this.ListSelections = c[1], c = a(this.Controls).find("button"), 0 === c.length && (c = a(this.Controls).find('input[type="button"]')), this.ButtonAdd = c[0], this.ButtonRemove = c[1]
        }
    }

    function P(b) {
        if (v.call(this, b), null !== this.Controls) {
            this.spanUserField = null, this.upLevelDiv = null, this.textareaDownLevelTextBox = null, this.linkCheckNames = null, this.txtHiddenSpanData = null;
            var c = a(this.Controls).find("span.ms-usereditor");
            null !== c && 1 === c.length && (this.spanUserField = c[0], this.upLevelDiv = byid(this.spanUserField.id + "_upLevelDiv"), this.textareaDownLevelTextBox = byid(this.spanUserField.id + "_downlevelTextBox"), this.linkCheckNames = byid(this.spanUserField.id + "_checkNames"), this.txtHiddenSpanData = byid(this.spanUserField.id + "_hiddenSpanData"))
        }
    }

    function Q(b) {
        if (v.call(this, b), null !== this.Controls) {
            var c = a(this.Controls).children()[0];
            this.ClientPeoplePicker = window.SPClientPeoplePicker.SPClientPeoplePickerDict[a(c).attr("id")], this.EditorInput = a(this.Controls).find("[id$='_EditorInput']")[0]
        }
    }

    function R(a, b) {
        v.call(this, a), this.Controls = a.controlsCell, this.TextNode = b
    }

    function S(a, b) {
        v.call(this, a), this.Controls = a.controlsCell, this.Element = b
    }

    function T(c) {
        var d, e = null;
        if (b()) return d = c.controlsCell.childNodes, 5 === d.length ? new S(c, d[3]) : new R(c, d[2]);
        switch (c.type) {
            case "SPFieldText":
                e = new w(c);
                break;
            case "SPFieldNumber":
                e = new x(c);
                break;
            case "SPFieldCurrency":
                e = new y(c);
                break;
            case "ContentTypeChoice":
                e = new z(c);
                break;
            case "SPFieldChoice":
                d = a(c.controlsCell).find("select"), e = d.length > 0 ? new B(c, d) : new C(c);
                break;
            case "SPFieldMultiChoice":
                e = new D(c);
                break;
            case "SPFieldDateTime":
                e = new F(c);
                break;
            case "SPFieldBoolean":
                e = new G(c);
                break;
            case "SPFieldUser":
            case "SPFieldUserMulti":
            case "SPFieldBusinessData":
                e = "undefined" == typeof window.SPClientPeoplePicker ? new P(c) : new Q(c);
                break;
            case "SPFieldURL":
                e = new H(c);
                break;
            case "SPFieldLookup":
                d = a(c.controlsCell).find("select"), d.length > 0 ? e = new I(c, d) : (d = a(c.controlsCell).find("input"), e = new J(c, d));
                break;
            case "SPFieldNote":
                d = a(c.controlsCell).find("textarea"), d.length > 0 ? (d = d[0], window.RTE_GetEditorIFrame && null !== window.RTE_GetEditorIFrame(d.id) && (e = new L(c, d))) : (d = a(c.controlsCell).find('input[type="hidden"]'), d.length >= 1 && (e = new M(c, d))), null === e && (e = new K(c, d));
                break;
            case "SPFieldFile":
                e = new N(c);
                break;
            case "SPFieldLookupMulti":
                e = new O(c);
                break;
            default:
                e = new v(c)
        }
        return e
    }

    function U(a) {
        try {
            if (null === a.type) throw "Unknown SPField type.";
            return T(a)
        } catch (b) {
            throw "Error creating field named " + a.name + ": " + b.toString()
        }
    }
    var V = null,
        W = null,
        X = null,
        Y = 12,
        Z = {
            timeFormat: "12HR",
            dateSeparator: "/",
            decimalSeparator: ".",
            thousandsSeparator: ",",
            stringYes: "Yes",
            stringNo: "No"
        };
    v.prototype.Show = function () {
        return t(this.LabelRow, this.ControlsRow, !0), this
    }, v.prototype.Hide = function () {
        return t(this.LabelRow, this.ControlsRow, !1), this
    }, v.prototype.GetDescription = function () {
        if (l()) return a(this.Controls.parentNode).children("span.ms-metadata").text();
        var b = this.Controls.parentNode,
            c = a(a(b).contents().toArray().reverse()).filter(function () {
                return 3 === this.nodeType
            }).text();
        return c.replace(/^\s+/, "").replace(/\s+$/g, "")
    }, v.prototype.SetDescription = function (b) {
        var c;
        if (b = d(b) ? "" : b, l()) c = a(this.Controls.parentNode).children("span.ms-metadata"), 0 === c.length && (c = a('<span class="ms-metadata"/>'), a(this.Controls.parentNode).append(c)), a(c).html(b);
        else {
            c = this.Controls.parentNode;
            var e = a(a(c).contents().toArray().reverse()).filter(function () {
                return 3 === this.nodeType
            });
            0 === e.length ? (e = document.createTextNode(b), c.appendChild(e)) : a(e)[0].nodeValue = b
        }
    }, v.prototype._updateReadOnlyLabel = function (a) {
        this.ReadOnlyLabel && this.ReadOnlyLabel.html(a)
    }, v.prototype._makeReadOnly = function (b) {
        try {
            a(this.Controls).hide(), null === this.ReadOnlyLabel && (this.ReadOnlyLabel = a("<div/>").addClass("sputility-readonly"), a(this.Controls).after(this.ReadOnlyLabel)), this.ReadOnlyLabel.html(b), this.ReadOnlyLabel.show()
        } catch (c) {
            throw "Error making " + this.Name + " read only. " + c.toString()
        }
        return this
    }, v.prototype.MakeReadOnly = function () {
        return this._makeReadOnly(this.GetValue().toString())
    }, v.prototype.MakeEditable = function () {
        try {
            a(this.Controls).show(), null !== this.ReadOnlyLabel && a(this.ReadOnlyLabel).hide()
        } catch (b) {
            throw "Error making " + this.Name + " editable. " + b.toString()
        }
        return this
    }, v.prototype.toString = function () {
        return this.Name
    }, v.prototype.GetValue = function () {
        throw "GetValue not yet implemented for " + this.Type + " in " + this.Name
    }, v.prototype.SetValue = function () {
        throw "SetValue not yet implemented for " + this.Type + " in " + this.Name
    }, w.prototype = Object.create(v.prototype), w.prototype.GetValue = function () {
        return a(this.Textbox).val()
    }, w.prototype.SetValue = function (b) {
        return a(this.Textbox).val(b), this._updateReadOnlyLabel(this.GetValue().toString()), this
    }, w.prototype.MakeReadOnly = function () {
        return this._makeReadOnly(k(this.GetValue()))
    }, x.prototype = Object.create(w.prototype), x.prototype.GetValue = function () {
        return j(a(this.Textbox).val())
    }, x.prototype.SetValue = function (b) {
        return a(this.Textbox).val(b), this._updateReadOnlyLabel(this.GetValueString()), this
    }, x.prototype.GetValueString = function () {
        var a = this.GetValue();
        return a = isNaN(a) ? "" : a.toString()
    }, x.prototype.MakeReadOnly = function () {
        return this._makeReadOnly(this.GetValueString())
    }, y.prototype = Object.create(x.prototype), y.prototype.Format = function () {
        this.FormatOptions.autoCorrect ? (this.FormatOptions.eventHandler = a.proxy(function () {
            this.SetValue(this.GetFormattedValue())
        }, this), a(this.Textbox).on("change", this.FormatOptions.eventHandler), this.FormatOptions.eventHandler()) : this.FormatOptions.eventHandler && (a(this.Textbox).off("change", this.FormatOptions.eventHandler), this.FormatOptions.eventHandler = null)
    }, y.prototype.GetFormattedValue = function () {
        var a = this.GetValue();
        return "number" == typeof a && (a = m(a, this.FormatOptions.decimalPlaces)), a
    }, y.prototype.SetValue = function (b) {
        return a(this.Textbox).val(b), this._updateReadOnlyLabel(this.GetFormattedValue()), this
    }, y.prototype.MakeReadOnly = function () {
        return this._makeReadOnly(this.GetFormattedValue())
    }, z.prototype = Object.create(v.prototype), z.prototype.GetValue = function () {
        return this.Dropdown.options[this.Dropdown.selectedIndex].text
    }, z.prototype.SetValue = function (a) {
        var b, c, d;
        for (c = this.Dropdown.options, b = 0; b < c.length; b += 1)
            if (d = c[b], d.text === a || d.value === a) {
                this.Dropdown.selectedIndex = b, "function" == typeof ChangeContentType && ChangeContentType(this.Dropdown.id);
                break
            }
        return this._updateReadOnlyLabel(this.GetValue()), this
    }, A.prototype = Object.create(v.prototype), A.prototype._getFillInValue = function () {
        return a(this.FillInTextbox).val()
    }, A.prototype._setFillInValue = function (b) {
        this.FillInElement.checked = !0, a(this.FillInTextbox).val(b)
    }, B.prototype = Object.create(A.prototype), B.prototype.GetValue = function () {
        return this.FillInAllowed && this.FillInElement.checked === !0 ? this._getFillInValue() : a(this.Dropdown).val()
    }, B.prototype.SetValue = function (b) {
        var c = a(this.Dropdown).find('option[value="' + b + '"]').length > 0;
        if (!c && this.FillInAllowed) c ? (a(this.Dropdown).val(b), this.FillInElement.checked = !1) : this._setFillInValue(b);
        else {
            if (!c) throw "Unable to set value for " + this.Name + ' the value "' + b + '" was not found.';
            a(this.Dropdown).val(b)
        }
        return this._updateReadOnlyLabel(this.GetValue().toString()), this
    }, C.prototype = Object.create(A.prototype), C.prototype.GetValue = function () {
        var b = null;
        return a(this.RadioButtons).each(function (a, c) {
            var d = c.value;
            return d.checked ? (b = c.key, !1) : void 0
        }), this.FillInAllowed && null === b && this.FillInElement.checked === !0 && (b = a(this.FillInTextbox).val()), b
    }, C.prototype.SetValue = function (a) {
        var b = p(this.RadioButtons, a);
        if (null === b) {
            if (!this.FillInAllowed) throw "Unable to set value for " + this.Name + ' the value "' + a + '" was not found.';
            this._setFillInValue(a)
        } else b.checked = !0;
        return this._updateReadOnlyLabel(this.GetValue().toString()), this
    }, D.prototype = Object.create(A.prototype), D.prototype.MakeReadOnly = function () {
        return this._makeReadOnly(this.GetValue().join("; "))
    }, D.prototype.GetValue = function () {
        var b = [];
        return a(this.Checkboxes).each(function (a, c) {
            var d = c.value;
            d.checked && b.push(c.key)
        }), this.FillInAllowed && this.FillInElement.checked === !0 && b.push(a(this.FillInTextbox).val()), b
    }, D.prototype.SetValue = function (b, c) {
        var e = p(this.Checkboxes, b);
        if (c = d(c) ? !0 : c, null === e) {
            if (!this.FillInAllowed) throw "Unable to set value for " + this.Name + ' the value "' + b + '" was not found.';
            e = this.FillInElement, a(this.FillInTextbox).val(b), e.checked = c
        } else e.checked = c;
        return this._updateReadOnlyLabel(this.GetValue().join("; ")), this
    }, E.prototype.SetDate = function (a, b, c) {
        if (e(a) && (a = g(a)), e(b) && (b = g(b)), e(c) && (c = g(c)), !f(a) || !f(b) || !f(c)) throw "Unable to set date, invalid arguments (requires year, month, and day as integers).";
        this.Year = a, this.Month = b, this.Day = c
    }, E.prototype.SetTime = function (a, b) {
        if (this.IsTimeIncluded = !1, f(a)) {
            if (0 > a || a > 23) throw "Hour number parameter must be between 0 and 23.";
            this.Hour = a
        } else if (e(a)) {
            if (!this.IsValidHour(a)) throw 'Hour string parameter must be formatted like "1 PM" or "12 AM".';
            this.Hour = this.ConvertHourToNumber(a)
        }
        if (f(b)) {
            if (0 > b || b >= 60 || b % 5 !== 0) throw "Minute parameter is not in the correct format. Needs to be formatted like 0, 5, or 35.";
            this.Minute = b
        } else if (e(b)) {
            if (!this.IsValidMinute(b)) throw 'Minute parameter is not in the correct format. Needs to be formatted like "00", "05" or "35".';
            this.Minute = g(b)
        }
        this.IsTimeIncluded = !0
    }, E.prototype.IsValidDate = function () {
        return null !== this.Year && null !== this.Month && null !== this.Day
    }, E.prototype.IsValidHour = function (a) {
        return !d(a) && /^([1-9]|10|11|12) (AM|PM)$/.test(a)
    }, E.prototype.IsValidMinute = function (a) {
        return !d(a) && /^([0-5](0|5))$/.test(a)
    }, E.prototype.ConvertHourToNumber = function (a) {
        var b;
        return a = a.split(" "), b = g(a[0]), "AM" === a[1] ? 12 === b && (b = 0) : "PM" === a[1] && (b += 12), b
    }, E.prototype.PadWithZero = function (a) {
        return d(a) || null === a ? "" : e(a) && (a = g(a), isNaN(a)) ? "" : f(a) && 10 > a ? "0" + a.toString() : a.toString()
    }, E.prototype.GetShortDateString = function () {
        if (!this.IsValidDate()) return "";
        var a;
        return a = "12HR" === this.TimeFormat ? this.Month + Z.dateSeparator + this.Day + Z.dateSeparator + this.Year : this.PadWithZero(this.Day) + Z.dateSeparator + this.PadWithZero(this.Month) + Z.dateSeparator + this.Year
    }, E.prototype.GetHour = function () {
        var a = this.Hour;
        return "12HR" === this.TimeFormat && (0 === a ? a = 12 : a > 12 && (a -= 12)), a
    }, E.prototype.GetShortTimeString = function () {
        return this.IsTimeIncluded ? "12HR" === this.TimeFormat ? this.GetHour() + ":" + this.PadWithZero(this.Minute) + (this.Hour < 12 ? " AM" : " PM") : this.PadWithZero(this.GetHour()) + ":" + this.PadWithZero(this.Minute) : ""
    }, E.prototype.toString = function () {
        var a = this.GetShortDateString(),
            b = this.GetShortTimeString();
        return "" === a && "" === b ? "" : "" === a ? "" : "" === b ? a : a + " " + b
    }, F.prototype = Object.create(v.prototype), F.prototype.GetValue = function () {
        var b, c, d = a(this.DateTextbox).val().split(Z.dateSeparator),
            e = new E;
        if (e.TimeFormat = Z.timeFormat, e.DateSeparator = Z.dateSeparator, 3 === d.length) {
            var f, h, i;
            "12HR" === Z.timeFormat ? (h = d[0], i = d[1], f = d[2]) : (i = d[0], h = d[1], f = d[2]), e.SetDate(f, h, i)
        }
        return this.IsDateOnly || (b = a(this.HourDropdown).val(), "number" === this.HourValueFormat && (b = g(b)), c = a(this.MinuteDropdown).val(), e.SetTime(b, c)), e
    }, F.prototype.SetValue = function (a, b, c, e, f) {
        return d(a) || null === a || "" === a ? (this.SetDate(null), this.IsDateOnly || this.SetTime(null), this) : (this.SetDate(a, b, c), d(e) || d(f) || this.SetTime(e, f), this)
    }, F.prototype.SetDate = function (b, c, d) {
        if (null === b || "" === b) return a(this.DateTextbox).val(""), this;
        var e = new E;
        return e.TimeFormat = Z.timeFormat, e.DateSeparator = Z.dateSeparator, e.SetDate(b, c, d), a(this.DateTextbox).val(e.GetShortDateString()), this._updateReadOnlyLabel(this.GetValue().toString()), this
    }, F.prototype.SetTime = function (b, c) {
        if (this.IsDateOnly) throw "Unable to set the time for a Date only field.";
        var d = new E;
        if (d.TimeFormat = Z.timeFormat, d.DateSeparator = Z.dateSeparator, null === b || "" === b ? d.SetTime(0, 0) : d.SetTime(b, c), "string" === this.HourValueFormat) {
            var e;
            e = 0 === d.Hour ? "12 AM" : 12 === d.Hour ? "12 PM" : d.Hour > 12 ? (d.Hour - 12).toString() + " PM" : d.Hour.toString() + " AM", a(this.HourDropdown).val(e)
        } else a(this.HourDropdown).val(d.Hour);
        return a(this.MinuteDropdown).val(d.PadWithZero(d.Minute)), this._updateReadOnlyLabel(this.GetValue().toString()), this
    }, G.prototype = Object.create(v.prototype), G.prototype.GetValue = function () {
        return !!this.Checkbox.checked
    }, G.prototype.GetValueString = function () {
        return this.GetValue() ? Z.stringYes : Z.stringNo
    }, G.prototype.SetValue = function (a) {
        return a = e(a) ? Z.stringYes.toUpperCase() === a.toUpperCase() : !!a, this.Checkbox.checked = a, this._updateReadOnlyLabel(this.GetValueString()), this
    }, G.prototype.MakeReadOnly = function () {
        return this._makeReadOnly(this.GetValueString())
    }, H.prototype = Object.create(v.prototype), H.prototype.GetValue = function () {
        return [this.TextboxURL.val(), this.TextboxDescription.val()]
    }, H.prototype.SetValue = function (a, b) {
        return this.TextboxURL.val(a), this.TextboxDescription.val(b), this._updateReadOnlyLabel(this.GetHyperlink()), this
    }, H.prototype.GetHyperlink = function () {
        var a, b = this.GetValue();
        return a = this.TextOnly ? b[0] + ", " + b[1] : '<a href="' + b[0] + '">' + b[1] + "</a>"
    }, H.prototype.MakeReadOnly = function (a) {
        return a && !0 === a.TextOnly && (this.TextOnly = !0), this._makeReadOnly(this.GetHyperlink())
    }, I.prototype = Object.create(v.prototype), I.prototype.GetValue = function () {
        return this.Dropdown.options[this.Dropdown.selectedIndex].text
    }, I.prototype.SetValue = function (b) {
        if (f(b)) a(this.Dropdown).val(b);
        else {
            var c, d, e;
            for (d = this.Dropdown.options, c = 0; c < d.length; c += 1)
                if (e = d[c], e.text === b) {
                    this.Dropdown.selectedIndex = c;
                    break
                }
        }
        return this._updateReadOnlyLabel(this.GetValue()), this
    }, J.prototype = Object.create(v.prototype), J.prototype.GetValue = function () {
        return this.Textbox.val()
    }, J.prototype.SetValue = function (a) {
        var b, c, d, f, h, i = [];
        for (b = this.Textbox.attr("choices"), b = b.split(/\|(?=\d+)/), i.push(b[0]), f = 1; f < b.length - 1; f++) h = b[f].indexOf("|"), i.push(b[f].substring(0, h)), i.push(b[f].substring(h + 1));
        for (i.push(b[b.length - 1]), e(a) && (a = a.replace("|", "||")), f = 0; f < i.length; f += 2)
            if (c = g(i[f + 1]), d = i[f], a === c || a === d) {
                this.Textbox.val(d.replace("||", "|"));
                break
            }
        return null !== c && this.HiddenTextbox.val(c), this._updateReadOnlyLabel(this.GetValue()), this
    }, K.prototype = Object.create(v.prototype), K.prototype.GetValue = function () {
        return a(this.Textbox).val()
    }, K.prototype.SetValue = function (b) {
        return a(this.Textbox).val(b), this._updateReadOnlyLabel(this.GetValue()), this
    }, L.prototype = Object.create(K.prototype), L.prototype.GetValue = function () {
        return window.RTE_GetIFrameContents(this.Textbox.id)
    }, L.prototype.SetValue = function (b) {
        return a(this.Textbox).val(b), window.RTE_TransferTextAreaContentsToIFrame(this.Textbox.id), this._updateReadOnlyLabel(this.GetValue()), this
    }, M.prototype = Object.create(v.prototype), M.prototype.GetValue = function () {
        return a(this.ContentDiv).html()
    }, M.prototype.SetValue = function (b) {
        return a(this.ContentDiv).html(b), a(this.Textbox).val(b), this._updateReadOnlyLabel(this.GetValue()), this
    }, N.prototype = Object.create(w.prototype), N.prototype.GetValue = function () {
        return a(this.Textbox).val() + this.FileExtension
    }, O.prototype = Object.create(v.prototype), O.prototype.GetValue = function () {
        var a, b, c = [];
        for (b = this.ListSelections.options.length, a = 0; b > a; a += 1) c.push(this.ListSelections.options[a].text);
        return c
    }, O.prototype.MakeReadOnly = function () {
        return this._makeReadOnly(this.GetValue().join("; "))
    }, O.prototype.SetValue = function (b, c) {
        d(c) && (c = !0);
        var e, g, h, i, j, k;
        for (c ? (h = this.ListChoices.options, j = this.ButtonAdd) : (h = this.ListSelections.options, j = this.ButtonRemove), i = h.length, f(b) ? (b = b.toString(), k = "value") : k = "text", e = 0; i > e; e += 1) {
            if (g = h[e], g[k] === b) {
                g.selected = !0;
                break
            }
            g.selected = !1
        }
        return j.disabled = "", a(j).click(), this._updateReadOnlyLabel(this.GetValue().join("; ")), this
    }, P.prototype = Object.create(v.prototype), P.prototype.GetValue = function () {
        return a(this.upLevelDiv).text().replace(/^\s+|\u00A0|\s+$/g, "")
    }, P.prototype.SetValue = function (b) {
        return this.upLevelDiv.innerHTML = b, this.textareaDownLevelTextBox.innerHTML = b, c() && a(this.txtHiddenSpanData).val(b), this.linkCheckNames.click(), this._updateReadOnlyLabel(this.GetValue()), this
    }, Q.prototype = Object.create(v.prototype), Q.prototype.GetValue = function () {
        return this.ClientPeoplePicker.GetAllUserInfo()
    }, Q.prototype._getValueLinks = function (b) {
        function c(a) {
            var b = {
                users: a.users
            };
            a.d.resolve(b)
        }

        function d(a) {
            a.d.reject("Something went wrong...")
        }

        function e(b, e) {
            for (var f = a.Deferred(), g = new SP.ClientContext.get_current, h = b.length, i = [], j = 0; h > j; j++) {
                var k = g.get_web().ensureUser(b[j]);
                g.load(k), i.push(k)
            }
            var l = {
                d: f,
                loginNames: b,
                users: i
            };
            return g.executeQueryAsync(c.bind(e, l), d.bind(e, l)), f.promise()
        }
        var f = [],
            g = this;
        a.each(g.GetValue(), function (a, b) {
            null !== b.Key && f.push(b.Key)
        });
        var h = e(f, g);
        h.done(function (a) {
            for (var c = "", d = 0; d < a.users.length; d++) {
                var e = a.users[d];
                "" !== c && (c += "; "), c += '<a href="/_layouts/15/userdisp.aspx?ID=' + e.get_id().toString() + '&amp;RootFolder=*">' + e.get_title() + "</a>"
            }
            return b(c)
        }), h.fail(function (a) {
            var b = a;
            console.log(b)
        })
    }, Q.prototype._updateReadOnlyLabel = function () {
        var a = this;
        a.ReadOnlyLabel && this._getValueLinks(function (b) {
            a.ReadOnlyLabel.html(b)
        })
    }, Q.prototype.GetValueString = function () {
        return a.map(this.GetValue(), function (a) {
            return a.DisplayText
        }).join(", ")
    }, Q.prototype.SetValue = function (b) {
        return d(b) || null === b || "" === b ? this.ClientPeoplePicker.DeleteProcessedUser() : (a(this.EditorInput).val(b), this.ClientPeoplePicker.AddUnresolvedUserFromEditor(!0)), this._updateReadOnlyLabel(), this
    }, Q.prototype.MakeReadOnly = function () {
        return this._makeReadOnly(""), this._updateReadOnlyLabel(), this
    }, R.prototype = Object.create(v.prototype), R.prototype.GetValue = function () {
        return a.trim(a(this.TextNode).text())
    }, R.prototype.SetValue = function (a) {
        return this.TextNode.nodeValue = a, this
    }, R.prototype.MakeEditable = function () {
        return this
    }, R.prototype.MakeReadOnly = function () {
        return this
    }, S.prototype = Object.create(v.prototype), S.prototype.GetValue = function () {
        return a(this.Element).text()
    }, S.prototype.SetValue = function () {
        return this
    }, S.prototype.MakeEditable = function () {
        return this
    }, S.prototype.MakeReadOnly = function () {
        return this
    };
    var $ = {};
    return $.Debug = function () {
        return !1
    }, $.GetSPField = function (a) {
        s();
        var b = V[a];
        if (d(b)) throw "Unable to get a SPField named " + a;
        return null === b.spField && (b.spField = U(b)), b.spField
    }, $.GetSPFieldByInternalName = function (a) {
        s();
        var b = W[a];
        if (d(b)) throw "Unable to get a SPField with internal name " + a;
        return null === b.spField && (b.spField = U(b)), b.spField
    }, $.GetSPFields = function () {
        return s(), V
    }, $.GetSPFieldsInternal = function () {
        return s(), W
    }, $.HideSPField = function (a) {
        u(a, !1)
    }, $.ShowSPField = function (a) {
        u(a, !0)
    }, $.IsDispForm = function () {
        return b()
    }, $.Setup = function (b) {
        var c = a.extend({}, Z, b);
        if ("12HR" !== c.timeFormat && "24HR" !== c.timeFormat) throw "Unable to set timeFormat, should be 12HR or 24HR.";
        return Z = c, c
    }, $.GetTimeFormat = function () {
        return Z.timeFormat
    }, $.SetTimeFormat = function (a) {
        $.Setup({
            timeFormat: a
        })
    }, $.GetDateSeparator = function () {
        return Z.dateSeparator
    }, $.SetDateSeparator = function (a) {
        $.Setup({
            dateSeparator: a
        })
    }, $.GetDecimalSeparator = function () {
        return Z.decimalSeparator
    }, $.SetDecimalSeparator = function (a) {
        $.Setup({
            decimalSeparator: a
        })
    }, $.GetThousandsSeparator = function () {
        return Z.thousandsSeparator
    }, $.SetThousandsSeparator = function (a) {
        $.Setup({
            thousandsSeparator: a
        })
    }, $
}(jQuery);