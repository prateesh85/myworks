var MigrateDocSets;

MigrateDocSets = function (MigrateDocSets) {
    'use strict';
    var srcWeb = "",
        srcTasksList = "",
        docSetLibName = "",
        getAllTaskItems,
        moveDocSetItems,
        updateTaskItems;

    getAllTaskItems = function () {
        var srcCtx = new SP.ClientContext.get_current(),
            srcList = srcCtx.get_web().get_lists().getByTitle(srcTasksList),
            taskItems = null,
            allItemsQuery = "<View><Query></Query></View>",
            camlQuery = new SP.CamlQuery(),
            ctxObj = {
                ctx: srcCtx,
                items: taskItems
            };

        taskItems = srcList.getItems(camlQuery);
        srcCtx.load(taskItems);
        srcCtx.executeQueryAsync(
            Function.createDelegate(ctxObj, onGetAllTasksSuccess),
            Function.createDelegate(this, onError)
         );
    }

    function onGetAllTasksSuccess() {
        var taskItems = ctxObj.items,
            srcCtx = ctxObj.srcCtx;
        if (taskItems !== null && taskItems.get_count() > 0) {
            var listItemEnumerator = listItemColl.getEnumerator(),
                oListItem;

            while (listItemEnumerator.moveNext()) {
                oListItem = listItemEnumerator.get_current();

            }
        }
    }

    moveDocSetItems = function (itemTitleToFetch) {
        //var docLib = 
    }

    function onError(sender, args) {

    }

    return {
        getAllTaskItems: getAllTaskItems
    }
}(MigrateDocSets = MigrateDocSets || {});