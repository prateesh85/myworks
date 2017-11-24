(function () {

    ExecuteOrDelayUntilScriptLoaded(function () {

        var objIdeate = new RenderIdeateParent();
        objIdeate.Render();

    }, "ClientTemplates.js");

})();

function RenderIdeateParent() {

    this.Render = function () {
        var overrideContext = {};
        //overrideContext.BaseViewID = 96;
        overrideContext.ListTemplateType = 115;
        overrideContext.Templates = {};
        var style = "<style>.leftAlign{ width:100%;float:left; margin: 10px 0px 10px 0px;} .med {width:25%;}" +
            " .large{ width:65%; } .leftAlign table{ width: 90% !important; } .btnClass { padding: 10px 0px 10px 0px; }</style>";
        overrideContext.Templates.Header = style + "<h2>Application Criticality Result</h2>";
        overrideContext.Templates.Item = customItem;
        SPClientTemplates.TemplateManager.RegisterTemplateOverrides(overrideContext);
    };

    function customItem(ctx) {

        var ItemHTML = "<div class='leftAlign'><div class='leftAlign med'>" + ctx.CurrentItem.BIANumber + "</div>"
            + "<div id='" + ctx.CurrentItem.ID + "' class='leftAlign large'>" + STSHtmlDecode(ctx.CurrentItem.AppCriticalityResult0)
            + "</div><div class='btnClass'><input type='button' value='Export' onclick='javascript:new ExportToExcel().ExportTable(\"" +
            ctx.CurrentItem.ID + "\", \"TableExport\")' /></div></div>";
        return ItemHTML;
    }
}

var ExportToExcel = function () {
    var iFrameId = 'exportFrame';

    function _exportTable(tableId, fileName) {
        var tab_text = "",
            tab,
            curDate = new Date();

        tab = document.getElementById(tableId); // id of table
        fileName = fileName + "_" + Date.parse(curDate) + ".xls";

        tab_text = tab.outerHTML;
        tab_text = tab_text.replace(/<A[^>]*>|<\/A>/g, "");//remove if u want links in your table
        tab_text = tab_text.replace(/<img[^>]*>/gi, ""); // remove if u want images in your table
        tab_text = tab_text.replace(/<input[^>]*>|<\/input>/gi, ""); // removes input params

        _export(tab_text, fileName, "Export");
    }

    function _export(tableHtml, filename, worksheetName) {
        var uri = 'data:application/vnd.ms-excel;base64,'
        , template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table cellspacing="0" rules="rows" border="1" style="color:Black;background-color:White;border-color:#CCCCCC;border-width:1px;border-style:None;width:100%;border-collapse:collapse;font-size:9pt;text-align:center;">{table}</table></body></html>'
        , base64 = function (s) { return window.btoa(unescape(encodeURIComponent(s))); }
        , format = function (s, c) { return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; }); }
        , ctx = { worksheet: worksheetName || 'Worksheet', table: tableHtml };
        if (navigator.msSaveBlob) {
            var blob = new Blob([format(template, ctx)], { type: 'application/vnd.ms-excel', endings: 'native' });
            navigator.msSaveBlob(blob, filename);
        } else {
            window.location.href = uri + base64(format(template, ctx));
        }
    }

    var TableToExcel = (function () {
        var uri = 'data:application/vnd.ms-excel;base64,'
        , template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table cellspacing="0" rules="rows" border="1" style="color:Black;background-color:White;border-color:#CCCCCC;border-width:1px;border-style:None;width:100%;border-collapse:collapse;font-size:9pt;text-align:center;">{table}</table></body></html>'
        , base64 = function (s) { return window.btoa(unescape(encodeURIComponent(s))); }
        , format = function (s, c) { return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; }); };
        return function (tableHtml, filename, worksheetName) {
            //if (!table.nodeType) { table = document.getElementById(table); }
            var ctx = { worksheet: worksheetName || 'Worksheet', table: tableHtml };
            if (navigator.msSaveBlob) {
                var blob = new Blob([format(template, ctx)], { type: 'application/vnd.ms-excel', endings: 'native' });
                navigator.msSaveBlob(blob, filename + '.xls');
            } else {
                window.location.href = uri + base64(format(template, ctx));
            }
        }
    })();

    return {
        ExportTable: _exportTable
    };
};