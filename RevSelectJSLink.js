var SecondPR;
SecondPR = function () {
    'use strict';
    var render,
        selected;

    // Summary: Method for changing the default CSR of Picture Library.
    // Parameters: None
    render = function () {

        function docFieldTemplate(ctx) {
            var email = (ctx.CurrentItem.NameofReviewer.length > 0) ? ctx.CurrentItem.NameofReviewer[0].email : "";
            return "<input type='radio' name='revSelect' onclick='SecondPR.selected(\"" + email + "\");' />";
        }

        Type.registerNamespace('itemCtx');
        Type.registerNamespace('itemCtx.Templates');
        itemCtx.Templates.Header = '';
        itemCtx.Templates.Fields = { "Select": { "View": docFieldTemplate } };
        itemCtx.Templates.Footer = '';
        SPClientTemplates.TemplateManager.RegisterTemplateOverrides(itemCtx);
    };

    selected = function (email) {
        if (email == "") {
            alert("no reviewer");
        }
        else {
            SP.UI.ModalDialog.commonModalDialogClose(SP.UI.DialogResult.OK, email);
        }
    }

    return {
        selected: selected,
        render: render
    };
}(SecondPR = SecondPR || {});

(function () {
    SecondPR.render();
})();