(function () {

    ExecuteOrDelayUntilScriptLoaded(function () {
        var oldRenderListView = RenderListView;

        //Now redefine RenderListView with our override
        RenderListView = function (ctx, webPartID) {
            if (ctx.ListTitle == 'Master') {
                ctx.BaseViewID = 81;
            }

            //now call the original RenderListView
            oldRenderListView(ctx, webPartID);
        }

        JSRequest.EnsureSetup();
        var renderItems = new RenderIdeateItems();
        renderItems.Render();

    }, "ClientTemplates.js");

})();

function RenderIdeateItems() {

    //var obj = this;
    var ratings = [],
        onFnChangeEvent = '',
        Render = '';

    Render = function () {
        var overrideContext = {};
        overrideContext.BaseViewID = 81;
        overrideContext.ListTemplateType = 100;
        overrideContext.Templates = {};
        overrideContext.Templates.Header = 'Master Selection';
        overrideContext.Templates.Item = CustomItem;
        //overrideContext.Templates.Footer = '';
        SPClientTemplates.TemplateManager.RegisterTemplateOverrides(overrideContext);
    };

    function CustomItem(ctx) {
        var item = "",
            selId = (JSRequest.QueryString["SelectedID"] != "undefined" && JSRequest.QueryString["SelectedID"] != "") ? JSRequest.QueryString["SelectedID"] : "",
            check = (selId != "" && selId == ctx.CurrentItem.ID) ? "checked='checked'" : "";

        item += "<div><input type='radio' class='mapFunctions' name='selection' " + check + " onchange='SelectField(\"" + ctx.view + "\",\"" + ctx.CurrentItem.ID + "\");return false;' value='" + ctx.CurrentItem.Value + "' />" + ctx.CurrentItem.Value + "</div>";
        return item;
    }

    return {
        Render: Render
    };
}