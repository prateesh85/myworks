using System;
using System.Text;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Net;
using System.Xml;
using Microsoft.SharePoint.Client;
using Microsoft.SharePoint.Client.Taxonomy;
using Microsoft.SharePoint.Client.WorkflowServices;
using System.IO;

using SP = Microsoft.SharePoint.Client;
using System.Threading;

namespace TestApplication
{
    class CopyListItems
    {
        NetworkCredential srcSystemAccount = new NetworkCredential();
        NetworkCredential destSystemAccount = new NetworkCredential();

        public StringBuilder UpdateAllItemsInList(string sourceWeb, string targetWeb, string sourceList, string targetList, string[] viewFields, StringBuilder logMsg)
        {
            ListItemCollection srcItems = null;
            using (ClientContext srcCtx = new ClientContext(sourceWeb))
            {
                srcCtx.Credentials = srcSystemAccount;
                CamlQuery query = CamlQuery.CreateAllItemsQuery(4000, viewFields);
                List oList = srcCtx.Web.Lists.GetByTitle(sourceList);
                srcItems = oList.GetItems(query);
                srcCtx.Load(srcItems);
                srcCtx.ExecuteQuery();
            }

            using (ClientContext destCtx = new ClientContext(targetWeb))
            {
                destCtx.Credentials = destSystemAccount;
                List oDestList = destCtx.Web.Lists.GetByTitle(targetList);
                foreach (ListItem srcItem in srcItems)
                {
                    ListItem destItem = oDestList.GetItemById(srcItem.Id);
                    destCtx.Load(destItem);
                    destCtx.ExecuteQuery();

                    Dictionary<string, object> srcFieldValues = srcItem.FieldValues;
                    Dictionary<string, object> destFieldValues = srcItem.FieldValues;

                    foreach (var field in destFieldValues)
                    {
                        string column = field.Key;
                        object value = field.Value;

                        var destFieldCol = destFieldValues.Select(a => a.Key.Equals(column));
                        if (destFieldCol != null && viewFields.Contains(column) && column != "ID")
                        {
                            destItem[column] = value;
                        }
                        else
                        {
                            logMsg.AppendLine(string.Format("Couldnot find destination item field {0} with ID {1}", column, srcItem.Id));
                        }
                    }

                    destItem.Update();
                    destCtx.ExecuteQuery();
                }
            }

            return logMsg;
        }

        public StringBuilder AddItemsInList(string targetWeb, string targetList, ResponseData respData, StringBuilder logMsg)
        {
            using (ClientContext destCtx = new ClientContext(targetWeb))
            {
                destCtx.Credentials = destSystemAccount;
                List oDestList = destCtx.Web.Lists.GetByTitle(targetList);
                ListItemCreationInformation itemCreateInfo = new ListItemCreationInformation();
                itemCreateInfo.FolderUrl = targetWeb + "Lists/" + targetList + "/" + respData.Country;

                FieldLookupValue ctry = new FieldLookupValue();
                ctry.LookupId = Convert.ToInt32(respData.CountryId);

                ListItem oListItem1 = oDestList.AddItem(itemCreateInfo);
                oListItem1["Title"] = respData.ArticleId;
                FieldLookupValue articleVal1 = new FieldLookupValue();
                articleVal1.LookupId = Convert.ToInt32(respData.QId1);
                oListItem1["QuestionId"] = articleVal1;
                oListItem1["Country"] = ctry;
                oListItem1["Response"] = respData.Val1;
                oListItem1["Lawtype"] = respData.LawType;
                oListItem1["IsParent"] = respData.IsParent1;
                oListItem1.Update();

                logMsg.AppendLine("***************************Adding response for Country - " + respData.Country + "*******************************");
                logMsg.AppendLine("Added Response for Qid - " + respData.QId1);

                // Uncomment below only for Count questions.
                ListItem oListItem2 = oDestList.AddItem(itemCreateInfo);
                oListItem2["Title"] = respData.ArticleId;
                FieldLookupValue articleVal2 = new FieldLookupValue();
                articleVal2.LookupId = Convert.ToInt32(respData.QId2);
                oListItem2["QuestionId"] = articleVal2;
                oListItem2["Country"] = ctry;
                oListItem2["Response"] = respData.Val2;
                oListItem2["Lawtype"] = respData.LawType;
                oListItem2["IsParent"] = respData.IsParent2;
                oListItem2.Update();
                ///////////////////////////////////////////////////////////////

                logMsg.AppendLine("Added Response for Qid - " + respData.QId2);

                Console.WriteLine("Adding response for Country - " + respData.Country);

                destCtx.ExecuteQuery();
            }

            return logMsg;
        }

        public void AddItemsInList(string targetWeb, string targetList)
        {
            using (ClientContext destCtx = new ClientContext(targetWeb))
            {
                //destCtx.Credentials = destSystemAccount;
                List oDestList = destCtx.Web.Lists.GetByTitle(targetList);//GetById(new Guid("5DAB1828-60FE-4D71-8B03-F54FDD52E2C7"));//
                //int OM = 1;

                for (int a = 1; a < 6100; a++)
                {
                    //if (a == 10 || a == 20 || a == 30 || a == 40)
                    //{
                    //    OM++;
                    //}
                    //for (int i = 1; i < 100; i++)
                    {
                        ListItemCreationInformation itemCreateInfo = new ListItemCreationInformation();
                        ListItem oListItem1 = oDestList.AddItem(itemCreateInfo);

                        oListItem1["Title"] = "Item_" + a.ToString();
                        //oListItem1["GroupBy"] = "OM" + OM;

                        oListItem1.Update();
                    }

                    destCtx.ExecuteQuery();
                }
            }
        }

        public void GetItemsFromList(string srcWeb, string srcList, string targetWeb, string destLib)
        {
            using (ClientContext destCtx = new ClientContext(srcWeb))
            {
                Site collection = destCtx.Site;
                destCtx.Load(collection, cols => cols.ServerRelativeUrl);
                destCtx.ExecuteQuery();

                Web sWeb = collection.OpenWeb(collection.ServerRelativeUrl + "/SR/");
                destCtx.Load(sWeb);
                destCtx.ExecuteQuery();


                List oDestList = destCtx.Web.Lists.GetByTitle(srcList);
                //ListItemCollection oItems = oDestList.GetItems(new CamlQuery() { ViewXml = "<View><Query><OrderBy Name='ID' Ascending='True' /></Query></View>" });
                ListItemCollection oItems = oDestList.GetItems(new CamlQuery() { ViewXml = "<View><Query><Where><Geq><FieldRef Name=\"ID\" /><Value Type=\"Counter\">80</Value></Geq></Where><OrderBy><FieldRef Name='ID' Ascending='True' /></OrderBy></Query></View>" });
                destCtx.Load(oItems, a => a.IncludeWithDefaultProperties(b => b.File.Title, c => c.File.ServerRelativeUrl, d => d.File.Name));
                destCtx.ExecuteQuery();

                foreach (ListItem oItem in oItems)
                {
                    //string fileName = (!string.IsNullOrEmpty(oItem.File.Title)) ? oItem.File.Title : oItem.File.Name;
                    //string destLib = "/sites/Mobile_Test_Center/SR/Testing/" + fileName;
                    //SP.File.SaveBinaryDirect(destCtx, destLib, SP.File.OpenBinaryDirect(destCtx, oItem.File.ServerRelativeUrl).Stream, true);
                    //destCtx.ExecuteQuery();

                    Console.WriteLine("Copying item - " + oItem.Id.ToString());
                    UpdateListItem(destCtx, targetWeb, oItem, destLib);

                    //UpdateService(destCtx, oItem, destUrl);
                }
            }
        }

        public void UpdateListItem(ClientContext srcCtx, string targetWeb, ListItem destItem, string destLib)
        {
            using (ClientContext destCtx = new ClientContext(targetWeb))
            {
                #region OldCode
                //destCtx.Credentials = destSystemAccount;
                //GetById(new Guid("5DAB1828-60FE-4D71-8B03-F54FDD52E2C7"));//

                //Field authFld = oDestList.Fields.GetByInternalNameOrTitle("Created By");
                //destCtx.Load(authFld);

                //User author = destCtx.Web.EnsureUser("mea\\prateesh.nair");
                //destCtx.Load(author);


                //authFld.ReadOnlyField = false;
                //destCtx.Load(authFld);
                //destCtx.ExecuteQuery();


                //ListItem destItem = oDestList.GetItemById(itemID);
                //destCtx.Load(destItem, a => a.File.ServerRelativeUrl, a => a.File.Title);
                //destCtx.ExecuteQuery();
                #endregion

                Web oWeb = destCtx.Web;
                destCtx.Load(oWeb, a => a.Folders, b => b.ServerRelativeUrl);

                List oDestList = destCtx.Web.Lists.GetByTitle(destLib);
                destCtx.Load(oDestList, a => a.Fields, a => a.RootFolder, a => a.RootFolder.ServerRelativeUrl, a => a.RootFolder.Files);

                //SP.File oFile = destCtx.Site.RootWeb.GetFileByServerRelativeUrl(destItem.File.ServerRelativeUrl);
                SP.File oFile = destCtx.Web.GetFileByServerRelativeUrl(destItem.File.ServerRelativeUrl);
                ClientResult<Stream> data = oFile.OpenBinaryStream();
                destCtx.Load(oFile, b => b.Title, d => d.Name, a => a.Versions, a => a.ListItemAllFields, a => a.ContentTag);
                destCtx.ExecuteQuery();

                string fileName = (!string.IsNullOrEmpty(oFile.Title)) ? oFile.Title : oFile.Name;

                Folder oFolder = oDestList.RootFolder;

                int bufferSize = 2000000;
                Byte[] readBuffer = new Byte[bufferSize];

                if (data != null)
                {

                    using (MemoryStream memStream = new MemoryStream())
                    {
                        data.Value.CopyTo(memStream);
                        readBuffer = memStream.ToArray();
                    }
                }

                using (MemoryStream destStream = new MemoryStream(readBuffer))
                {
                    FileCreationInformation fileInfo = new FileCreationInformation();
                    fileInfo.ContentStream = destStream;
                    fileInfo.Overwrite = true;
                    fileInfo.Url = oFolder.ServerRelativeUrl + "/" + fileName;

                    Console.WriteLine(string.Format("Copying file from {0} to {1}", destItem.File.ServerRelativeUrl, oFolder.ServerRelativeUrl + "/" + fileName));
                    SP.File newFile = oFolder.Files.Add(fileInfo);

                    ListItem newItem = newFile.ListItemAllFields;
                    if (destItem.Id == 95)
                    {
                        FieldUserValue authUser = new FieldUserValue();
                        authUser.LookupId = 189;
                        newItem["Author"] = authUser;
                    }
                    else
                    {
                        newItem["Author"] = destItem["Author"];
                    }

                    newItem["Created"] = destItem["Created"];
                    newItem["Editor"] = destItem["Editor"];
                    newItem["Modified"] = destItem["Modified"];

                    newItem.Update();
                    destCtx.ExecuteQuery();
                }

                #region OldCode

                //SP.File.SaveBinaryDirect(srcCtx, destUrl + "/" + fileName, SP.File.OpenBinaryDirect(srcCtx, destItem.File.ServerRelativeUrl).Stream, true);
                //oFile.CheckOut();
                //ListItem curItem = oFile.ListItemAllFields;
                //curItem["Author"] = authUser;
                //curItem.Update();
                //oFile.CheckIn(string.Empty, CheckinType.OverwriteCheckIn);

                //FieldUserValue authUser = new FieldUserValue();
                //authUser.LookupId = author.Id;


                //destItem["Author"] = authUser;
                //var createdByField = new ListItemFormUpdateValue
                //{
                //    FieldName = "Created_x0020_By",
                //    FieldValue = author.Id.ToString()
                //};

                //var updatedValues = new List<ListItemFormUpdateValue> { createdByField };
                //destItem.ValidateUpdateListItem(updatedValues, true, "");

                //destItem.Update();
                #endregion

                Console.WriteLine("Copied file to destination.");
                Console.WriteLine("*********************************************");
            }
        }

        public void GetDiageoTasks(string srcWeb, string srcList, string targetWeb, string destLib)
        {
            using (ClientContext srcCtx = new ClientContext(srcWeb))
            {
                Web oWeb = srcCtx.Web;
                List oList = oWeb.Lists.GetByTitle(srcList);
                ListItemCollection oItems = oList.GetItems(CamlQuery.CreateAllItemsQuery());
                srcCtx.Load(oItems);
                srcCtx.ExecuteQuery();

                foreach (ListItem oItem in oItems)
                {
                    Console.WriteLine("Updating task item - " + oItem.Id.ToString());
                    //UpdateListItemAndTasks(destCtx, targetWeb, oItem, destLib);
                }
            }
        }

        //public void UpdateListItemAndTasks(ClientContext srcCtx, ListItem taskItem, string docLib)
        //{
        //    List oDocLib = srcCtx.Web.Lists.GetByTitle(docLib);
        //    ListItemCollection oDocs = oDocLib.GetItems(new CamlQuery() { ViewXml="" });


        //    Web oWeb = destCtx.Web;
        //    destCtx.Load(oWeb, a => a.Folders, b => b.ServerRelativeUrl);

        //    List oDestList = destCtx.Web.Lists.GetByTitle(destLib);
        //    destCtx.Load(oDestList, a => a.Fields, a => a.RootFolder, a => a.RootFolder.ServerRelativeUrl, a => a.RootFolder.Files);

        //    SP.File oFile = destCtx.Web.GetFileByServerRelativeUrl(destItem.File.ServerRelativeUrl);
        //    ClientResult<Stream> data = oFile.OpenBinaryStream();
        //    destCtx.Load(oFile, b => b.Title, d => d.Name, a => a.Versions, a => a.ListItemAllFields, a => a.ContentTag);
        //    destCtx.ExecuteQuery();

        //    string fileName = (!string.IsNullOrEmpty(oFile.Title)) ? oFile.Title : oFile.Name;

        //    Folder oFolder = oDestList.RootFolder;

        //    int bufferSize = 2000000;
        //    Byte[] readBuffer = new Byte[bufferSize];

        //    if (data != null)
        //    {

        //        using (MemoryStream memStream = new MemoryStream())
        //        {
        //            data.Value.CopyTo(memStream);
        //            readBuffer = memStream.ToArray();
        //        }
        //    }

        //    using (MemoryStream destStream = new MemoryStream(readBuffer))
        //    {
        //        FileCreationInformation fileInfo = new FileCreationInformation();
        //        fileInfo.ContentStream = destStream;
        //        fileInfo.Overwrite = true;
        //        fileInfo.Url = oFolder.ServerRelativeUrl + "/" + fileName;

        //        Console.WriteLine(string.Format("Copying file from {0} to {1}", destItem.File.ServerRelativeUrl, oFolder.ServerRelativeUrl + "/" + fileName));
        //        SP.File newFile = oFolder.Files.Add(fileInfo);

        //        ListItem newItem = newFile.ListItemAllFields;
        //        if (destItem.Id == 95)
        //        {
        //            FieldUserValue authUser = new FieldUserValue();
        //            authUser.LookupId = 189;
        //            newItem["Author"] = authUser;
        //        }
        //        else
        //        {
        //            newItem["Author"] = destItem["Author"];
        //        }

        //        newItem["Created"] = destItem["Created"];
        //        newItem["Editor"] = destItem["Editor"];
        //        newItem["Modified"] = destItem["Modified"];

        //        newItem.Update();
        //        destCtx.ExecuteQuery();
        //    }

        //    Console.WriteLine("Copied file to destination.");
        //    Console.WriteLine("*********************************************");

        //}

        public void UpdateService(ClientContext destCtx, ListItem srcItem, string destUrl)
        {
            CopyService.Copy myCopyService = new CopyService.Copy();
            myCopyService.Credentials = System.Net.CredentialCache.DefaultCredentials;

            myCopyService.Url = "https://share.ey.net/sites/Mobile_Test_Center/_vti_bin/Copy.asmx";

            string copySource = "https://share.ey.net" + "/" + srcItem.File.ServerRelativeUrl;
            //        string[] copyDest = { "http://Server2/Site1/Shared Documents/test.txt", 
            //"http://Server2/Site2/Shared Documents/test.txt" };

            CopyService.FieldInformation myFieldInfo = new CopyService.FieldInformation();
            CopyService.FieldInformation[] myFieldInfoArray = { myFieldInfo };
            byte[] myByteArray;

            copySource = SP.Utilities.HttpUtility.UrlPathEncode(copySource, true);

            uint myGetUint = myCopyService.GetItem(copySource, out myFieldInfoArray, out myByteArray);

            CopyService.CopyResult myCopyResult1 = new CopyService.CopyResult();
            //CopyService.CopyResult myCopyResult2 = new CopyService.CopyResult();
            CopyService.CopyResult[] myCopyResultArray = { myCopyResult1 };

            SP.File oFile = destCtx.Site.RootWeb.GetFileByServerRelativeUrl(copySource);
            destCtx.Load(oFile, b => b.Title, d => d.Name);
            destCtx.ExecuteQuery();


            string fileName = (!string.IsNullOrEmpty(oFile.Title)) ? oFile.Title : oFile.Name;
            string[] copyDest = { destUrl + "/" + fileName };

            uint myCopyUint = myCopyService.CopyIntoItems(copySource, copyDest, myFieldInfoArray, myByteArray, out myCopyResultArray);
        }

        public static void CopyDocuments(string srcUrl, string srcLibrary, string destUrl, string destLibrary)
        {
            // set up the src client
            using (ClientContext srcContext = new ClientContext(srcUrl))
            {
                // set up the destination context
                using (ClientContext destContext = new ClientContext(destUrl))
                {
                    // get the source list and items
                    Web srcWeb = srcContext.Web;
                    List srcList = srcWeb.Lists.GetByTitle(srcLibrary);

                    ListItemCollection itemColl = srcList.GetItems(new CamlQuery());
                    srcContext.Load(itemColl);
                    srcContext.ExecuteQuery();

                    // get the destination list

                    Web destWeb = destContext.Web;
                    destContext.Load(destWeb);
                    destContext.ExecuteQuery();

                    foreach (var doc in itemColl)
                    {
                        try
                        {
                            Microsoft.SharePoint.Client.File file = doc.File;
                            srcContext.Load(file);
                            srcContext.ExecuteQuery();

                            // build destination url

                            string nLocation = destWeb.ServerRelativeUrl.TrimEnd('/') + "/" + destLibrary.Replace(" ", "") + "/" + file.Name;

                            // read the file, copy the content to new file at new location

                            FileInformation fileInfo = Microsoft.SharePoint.Client.File.OpenBinaryDirect(srcContext, file.ServerRelativeUrl);
                            Microsoft.SharePoint.Client.File.SaveBinaryDirect(destContext, nLocation, fileInfo.Stream, true);
                        }

                        catch (Exception ex)
                        {
                            throw ex;
                        }
                    }
                    Console.WriteLine("success...");
                }
            }
        }

        public void DeleteListItems(string targetWeb, string targetList)
        {
            using (ClientContext destCtx = new ClientContext(targetWeb))
            {
                //destCtx.Credentials = destSystemAccount;
                List oDestList = destCtx.Web.Lists.GetByTitle(targetList);
                CamlQuery query = CamlQuery.CreateAllItemsQuery();
                ListItemCollection oItems = oDestList.GetItems(query);
                destCtx.Load(oItems);
                destCtx.ExecuteQuery();
                int OM = 1;

                for (int a = 1; a < 52; a++)
                {
                    if (a == 10 || a == 20 || a == 30 || a == 40)
                    {
                        OM++;
                    }
                    for (int i = 1; i < 100; i++)
                    {
                        ListItemCreationInformation itemCreateInfo = new ListItemCreationInformation();
                        ListItem oListItem1 = oDestList.AddItem(itemCreateInfo);

                        oListItem1["Title"] = "Title" + i.ToString();
                        oListItem1["GroupBy"] = "OM" + OM;

                        oListItem1.Update();
                    }

                    destCtx.ExecuteQuery();
                }
            }
        }

        public void DeleteAllListItems(string targetWeb, string targetList)
        {
            using (ClientContext destCtx = new ClientContext(targetWeb))
            {
                //destCtx.Credentials = destSystemAccount;
                List oList = destCtx.Web.Lists.GetByTitle(targetList);
                CamlQuery query = new CamlQuery() { ViewXml = "<View><Query><Where><Leq><FieldRef Name=\"ID\" /><Value Type=\"Counter\">2000</Value></Leq></Where></Query></View>" };//CamlQuery.CreateAllItemsQuery();

                ListItemCollection oItems = oList.GetItems(query);
                destCtx.Load(oItems);
                destCtx.ExecuteQuery();
                int i = 1;
                int j = 0;

                foreach (ListItem item in oItems.ToList<ListItem>())
                {
                    item.DeleteObject();
                    i++;
                    if (i == 100)
                    {
                        oList.Update();
                        destCtx.ExecuteQuery();
                        i = 1;
                        j++;
                        Console.WriteLine("Deleting batch : " + j.ToString());
                    }
                }

                oList.Update();
                destCtx.ExecuteQuery();
            }
        }

        public void GetQuestionItem(string webUrl, string listName, string itemID1, string itemID2, ref bool item1IsParent, ref bool item2IsParent)
        {
            using (ClientContext srcCtx = new ClientContext(webUrl))
            {
                srcCtx.Credentials = destSystemAccount;
                List oList = srcCtx.Web.Lists.GetByTitle(listName);
                ListItem item1 = oList.GetItemById(itemID1);
                ListItem item2 = oList.GetItemById(itemID2);
                srcCtx.Load(item1);
                if (item2 != null)
                    srcCtx.Load(item2);
                srcCtx.ExecuteQuery();

                if (item1 != null)
                {
                    item1IsParent = Convert.ToBoolean(item1["IsParent"]);
                    if (item2 != null)
                        item2IsParent = Convert.ToBoolean(item2["IsParent"]);
                }
            }
        }

        public void DeleteItemsInFolder(string webUrl, string listName)
        {
            using (ClientContext srcCtx = new ClientContext(webUrl))
            {
                srcCtx.Credentials = destSystemAccount;
                List oList = srcCtx.Web.Lists.GetByTitle(listName);

                string[] Countries = { "Austria", "Belgium", "Bulgaria", "Croatia", "Cyprus", "Czech Republic", "Denmark", "Estonia", "Finland", "France", "Germany", "Greece", "Hungary", "Iceland", "Ireland", "Italy", "Latvia", "Liechtenstein", "Lithuania", "Luxembourg", "Malta", "Norway", "Poland", "Portugal", "Romania", "Slovakia", "Slovenia", "Spain", "Sweden", "The Netherlands", "United Kingdom" };
                CamlQuery query = CamlQuery.CreateAllItemsQuery();

                ListItemCollection items = oList.GetItems(query);
                var allItems = srcCtx.LoadQuery(items);
                srcCtx.ExecuteQuery();



                foreach (ListItem item in allItems.ToList<ListItem>())
                {
                    if (item.FileSystemObjectType != FileSystemObjectType.Folder)
                    {
                        item.DeleteObject();
                    }
                }

                oList.Update();
                srcCtx.ExecuteQuery();
            }
        }

        public void GetAllListEvents(string webUrl, string listName)
        {
            using (ClientContext srcCtx = new ClientContext(webUrl))
            {
                srcCtx.Credentials = destSystemAccount;
                List oList = srcCtx.Web.Lists.GetByTitle(listName);

                EventReceiverDefinitionCollection oReceivers = oList.EventReceivers;

                srcCtx.Load(oReceivers);

                //oList.Update();
                srcCtx.ExecuteQuery();

                foreach (EventReceiverDefinition oEvent in oReceivers)
                {
                    Console.WriteLine(oEvent.EventType.ToString());
                    Console.WriteLine(oEvent.ReceiverClass);
                }
            }
        }

        public void CaptureListDetails(string targetWeb, string targetList)
        {
            using (ClientContext destCtx = new ClientContext(targetWeb))
            {
                //destCtx.Credentials = destSystemAccount;
                List oDestList = destCtx.Web.Lists.GetByTitle(targetList);
                FieldCollection listFields = oDestList.Fields;

                destCtx.Load(oDestList);
                destCtx.Load(listFields);

                destCtx.ExecuteQuery();

                ExportFieldsToExcel(listFields, targetList);
            }
        }

        public void ExportFieldsToExcel(FieldCollection listFields, string listName)
        {
            StringBuilder bldr = new StringBuilder();
            Microsoft.Office.Interop.Excel.Application oXL;
            Microsoft.Office.Interop.Excel._Workbook oWB;
            Microsoft.Office.Interop.Excel._Worksheet oSheet;

            int row = 2;

            oXL = new Microsoft.Office.Interop.Excel.Application();

            //Get a new workbook.
            oWB = (Microsoft.Office.Interop.Excel._Workbook)(oXL.Workbooks.Add(""));
            oSheet = (Microsoft.Office.Interop.Excel._Worksheet)oWB.ActiveSheet;

            //Add table headers going cell by cell.
            oSheet.Cells[1, 1] = "Display Name";
            oSheet.Cells[1, 2] = "Internal Name";
            oSheet.Cells[1, 3] = "Type";
            oSheet.Cells[1, 4] = "Required";

            foreach (Field fld in listFields)
            {
                if (!fld.Hidden)
                {
                    oSheet.Cells[row, 1] = fld.Title;
                    oSheet.Cells[row, 2] = fld.InternalName;
                    oSheet.Cells[row, 3] = fld.TypeAsString;
                    oSheet.Cells[row, 4] = Convert.ToString(fld.Required);
                    oSheet.Cells.Columns.AutoFit();

                    row++;
                }
            }

            try
            {
                string fileName = @"C:\Test\" + listName + ".xlsx";
                oWB.SaveAs(fileName, Microsoft.Office.Interop.Excel.XlFileFormat.xlWorkbookDefault, Type.Missing, Type.Missing,
                    false, false, Microsoft.Office.Interop.Excel.XlSaveAsAccessMode.xlNoChange,
                    Type.Missing, Type.Missing, Type.Missing, Type.Missing, Type.Missing);

                oWB.Close();
            }
            catch (Exception ex)
            {
                Console.WriteLine("Something went wrong.");
                bldr.AppendLine("Error Details : " + Environment.NewLine + ex.Message + Environment.NewLine + ex.StackTrace);
            }
            finally
            {
                releaseObject(oSheet);
                releaseObject(oWB);
                releaseObject(oXL);

                if (bldr.Length > 0)
                {
                    using (StreamWriter wtr = new StreamWriter("Log" + DateTime.Now.ToString("ddMMyyyyhhmmss") + ".txt"))
                    {
                        wtr.Write(Convert.ToString(bldr));
                    }
                }
            }
        }

        private void releaseObject(object obj)
        {
            try
            {
                System.Runtime.InteropServices.Marshal.ReleaseComObject(obj);
                obj = null;
            }
            catch (Exception ex)
            {
                obj = null;
                Console.WriteLine("Exception Occured while releasing object " + ex.ToString());
            }
            finally
            {
                GC.Collect();
            }
        }

        public void CopyListTemplate(string srcWeb, string srcList, string targetWeb, string destList)
        {
            using (ClientContext srcCtx = new ClientContext(srcWeb))
            {
                List oSrcList = srcCtx.Web.Lists.GetByTitle(srcList);
                srcCtx.Load(oSrcList, a => a.Fields, a => a.ContentTypes, a => a.Fields.SchemaXml, a => a.Views);
                srcCtx.ExecuteQuery();

                using (ClientContext destCtx = new ClientContext(targetWeb))
                {
                    StringBuilder logBldr = new StringBuilder();
                    List oDestList = destCtx.Web.Lists.GetByTitle(destList);
                    destCtx.Load(oDestList, a => a.Fields, a => a.Fields.SchemaXml, a => a.Views);
                    destCtx.ExecuteQuery();

                    List<string> destFldColl = new List<string>();

                    foreach (Field destFld in oDestList.Fields)
                    {
                        if (!destFld.FromBaseType && !destFld.Hidden)
                        {
                            destFldColl.Add(destFld.InternalName);
                        }
                    }

                    foreach (Field srcFld in oSrcList.Fields)
                    {
                        if (!destFldColl.Contains(srcFld.InternalName) && !srcFld.FromBaseType && !srcFld.Hidden)
                        {
                            try
                            {
                                Console.WriteLine(srcFld.InternalName);
                                string intName = srcFld.InternalName;
                                string displayName = srcFld.Title;
                                XmlDocument xDoc = new System.Xml.XmlDocument();
                                xDoc.LoadXml(srcFld.SchemaXml);
                                XmlAttribute dispName = (XmlAttribute)xDoc.SelectSingleNode("//Field/@DisplayName");
                                dispName.Value = srcFld.InternalName;

                                oDestList.Fields.AddFieldAsXml(xDoc.OuterXml, false, AddFieldOptions.AddToDefaultContentType);
                                oDestList.Update();
                                destCtx.ExecuteQuery();

                                if (intName != displayName)
                                {
                                    Field spField = oDestList.Fields.GetByInternalNameOrTitle(srcFld.InternalName);
                                    spField.Title = displayName;
                                    spField.Update();
                                    destCtx.ExecuteQuery();
                                }

                                logBldr.AppendLine("Created Field - " + srcFld.Title);
                                Console.WriteLine("Created Field - " + srcFld.Title);
                            }
                            catch (Exception ex)
                            {
                                Console.WriteLine("Exception - " + ex.Message);
                                logBldr.AppendLine("Exception adding field *** " + srcFld.Title + " *** - " + ex.Message);
                            }
                        }
                    }

                    using (StreamWriter wtr = new StreamWriter("Log_" + DateTime.Now.ToString("mmddYYYYhhmmss") + ".txt"))
                    {
                        wtr.Write(Convert.ToString(logBldr));
                    }
                }
            }
        }

        public void CopyListViews(string srcWeb, string srcList, string targetWeb, string destList)
        {
            using (ClientContext srcCtx = new ClientContext(srcWeb))
            {
                List oSrcList = srcCtx.Web.Lists.GetByTitle(srcList);
                srcCtx.Load(oSrcList, a => a.Views, a => a.SchemaXml);
                srcCtx.ExecuteQuery();

                using (ClientContext destCtx = new ClientContext(targetWeb))
                {
                    StringBuilder logBldr = new StringBuilder();
                    List oDestList = destCtx.Web.Lists.GetByTitle(destList);
                    destCtx.Load(oDestList, a => a.Views, a => a.SchemaXml);
                    destCtx.ExecuteQuery();

                    List<string> destViewColl = new List<string>();

                    foreach (View destView in oDestList.Views)
                    {
                        if (!destView.PersonalView)
                        {
                            destViewColl.Add(destView.Title);
                        }
                    }

                    foreach (View srcView in oSrcList.Views)
                    {
                        if (!destViewColl.Contains(srcView.Title) && !srcView.PersonalView)
                        {
                            try
                            {
                                srcCtx.Load(srcView, a => a.ViewFields);
                                srcCtx.ExecuteQuery();

                                List<string> vwFlds = new List<string>();
                                foreach (string vwFld in srcView.ViewFields)
                                {
                                    vwFlds.Add(vwFld);
                                }

                                ViewCreationInformation vwInfo = new ViewCreationInformation();
                                vwInfo.Title = srcView.Title;
                                vwInfo.Paged = srcView.Paged;
                                vwInfo.PersonalView = srcView.PersonalView;
                                vwInfo.Query = srcView.ViewQuery;
                                vwInfo.RowLimit = srcView.RowLimit;
                                vwInfo.SetAsDefaultView = srcView.DefaultView;
                                vwInfo.ViewFields = vwFlds.ToArray<string>();
                                vwInfo.ViewTypeKind = ViewType.Html;

                                oDestList.Views.Add(vwInfo);

                                oDestList.Update();
                                destCtx.ExecuteQuery();

                                logBldr.AppendLine("Created View - " + srcView.Title);
                                Console.WriteLine("Created View - " + srcView.Title);
                            }
                            catch (Exception ex)
                            {
                                Console.WriteLine("Exception - " + ex.Message);
                                logBldr.AppendLine("Exception adding view *** " + srcView.Title + " *** - " + ex.Message);
                            }
                        }
                    }

                    using (StreamWriter wtr = new StreamWriter("Log_" + DateTime.Now.ToString("mmddYYYYhhmmss") + ".txt"))
                    {
                        wtr.Write(Convert.ToString(logBldr));
                    }
                }
            }
        }

        public static void CopyDocumentsToFolder(string srcUrl, string srcLibrary, string destUrl, string destLibrary)
        {
            // set up the src client
            using (ClientContext srcContext = new ClientContext(srcUrl))
            {
                // set up the destination context
                using (ClientContext destContext = new ClientContext(destUrl))
                {
                    // get the source list and items
                    Web srcWeb = srcContext.Web;
                    List srcList = srcWeb.Lists.GetByTitle(srcLibrary);

                    ListItemCollection itemColl = srcList.GetItems(new CamlQuery() { ViewXml = "<View Scope=\"Recursive\"><Query><OrderBy Name='ID' Ascending='True' /></Query></View>" });
                    srcContext.Load(itemColl, a => a.IncludeWithDefaultProperties(b => b.Folder.ListItemAllFields, b => b.Folder.Name, b => b.File, b => b.File.Name, b => b.Folder.ParentFolder.Name));
                    srcContext.ExecuteQuery();

                    // get the destination list

                    Web destWeb = destContext.Web;
                    destContext.Load(destWeb);
                    destContext.ExecuteQuery();

                    foreach (var doc in itemColl)
                    {
                        try
                        {
                            if (doc.FileSystemObjectType == FileSystemObjectType.File)
                            {
                                Microsoft.SharePoint.Client.File file = doc.File;
                                //ClientResult<Stream> data = file.OpenBinaryStream();
                                //srcContext.Load(file);
                                //srcContext.ExecuteQuery();
                                var folderUrl = (string)doc.FieldValues["FileDirRef"];
                                var parentFolder = doc.ParentList.ParentWeb.GetFolderByServerRelativeUrl(folderUrl);
                                srcContext.Load(parentFolder);
                                srcContext.ExecuteQuery();
                                // build destination url

                                string folder = parentFolder.Name;

                                if (folder != "SiteAssets")
                                {
                                    string nLocation = destWeb.ServerRelativeUrl.TrimEnd('/') + "/" + destLibrary.Replace(" ", "") + "/" + folder + "/" + file.Name;
                                    Console.WriteLine("Source File : " + file.Name);
                                    Console.WriteLine("Destination Path : " + nLocation);
                                    // read the file, copy the content to new file at new location
                                    FileInformation fileInfo = Microsoft.SharePoint.Client.File.OpenBinaryDirect(srcContext, file.ServerRelativeUrl);
                                    Microsoft.SharePoint.Client.File.SaveBinaryDirect(destContext, nLocation, fileInfo.Stream, true);

                                    //using (MemoryStream memStream = new MemoryStream())
                                    //{
                                    //    data.Value.CopyTo(memStream);
                                    //    Microsoft.SharePoint.Client.File.SaveBinaryDirect(destContext, nLocation, memStream, true);
                                    //}

                                }
                            }
                        }
                        catch (Exception ex)
                        {
                            //throw ex;
                        }
                    }
                    Console.WriteLine("success...");
                }
            }
        }

        public void AddUsersToSPGroup(string webUrl, int grpId, string[] data)
        {
            StringBuilder logBldr = new StringBuilder();

            using (ClientContext ctx = new ClientContext(webUrl))
            {
                GroupCollection Groups = ctx.Web.SiteGroups;
                Group ownersGroup = Groups.GetById(grpId);
                ctx.Load(ownersGroup);
                ctx.ExecuteQuery();

                string GroupName = ownersGroup.Title;

                foreach (string info in data)
                {
                    string email = string.Empty;
                    try
                    {
                        string[] sep = { ";" };
                        email = info.Split(sep, StringSplitOptions.RemoveEmptyEntries)[0];

                        User newUser = ctx.Web.EnsureUser(email);
                        ctx.Load(newUser);
                        ctx.ExecuteQuery();

                        ownersGroup.Users.AddUser(newUser);

                        Console.WriteLine("Added user - " + email);
                        logBldr.AppendLine("Added user - " + email);
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine("Failed Adding user - " + email + " | Exception - " + ex.Message);
                        logBldr.AppendLine("Failed Adding user - " + email + " | Exception - " + ex.Message);
                    }
                }

                using (StreamWriter wtr = new StreamWriter("UserAdditionLog_" + DateTime.Now.ToString("mmddYYYYhhmmss") + ".txt"))
                {
                    wtr.Write(Convert.ToString(logBldr));
                }
            }
        }

        public void GetSuspendedWFItems(string webUrl, string listName, string workflowName)
        {
            StringBuilder logBldr = new StringBuilder();

            using (ClientContext ctx = new ClientContext(webUrl))
            {
                WorkflowStatus workflowStatus = WorkflowStatus.Suspended;
                Web oWeb = ctx.Web;
                List oList = oWeb.Lists.GetByTitle(listName);
                ctx.Load(oList, l => l.Id, l => l.WorkflowAssociations);
                ctx.ExecuteQuery();

                Guid listGUID = oList.Id;
                //var association = oList.WorkflowAssociations.Where(wfA => wfA.Name == workflowName);

                var wfServicesManager = new WorkflowServicesManager(ctx, oWeb);
                var wfSubscriptionService = wfServicesManager.GetWorkflowSubscriptionService();
                WorkflowSubscriptionCollection wfSubscriptions = wfSubscriptionService.EnumerateSubscriptionsByList(listGUID);
                ctx.Load(wfSubscriptions, wfSubs => wfSubs.Where(wfSub => wfSub.Name == workflowName));
                ctx.ExecuteQuery();
                WorkflowSubscription wfSubscription = wfSubscriptions.First();

                if (wfSubscription != null)
                {
                    WorkflowInstanceService wfInstanceService = wfServicesManager.GetWorkflowInstanceService();
                    WorkflowInstanceCollection wfInstanceCollection = wfInstanceService.Enumerate(wfSubscription);
                    ctx.Load(wfInstanceCollection, wfInstances => wfInstances.Where(wfI => wfI.Status == workflowStatus));
                    ctx.ExecuteQuery();

                    var startParameters = new Dictionary<string, object>();

                    foreach (var wfInstance in wfInstanceCollection)
                    {
                        //if (wfInstance.Status == WorkflowStatus.Suspended)
                        {
                            string strItemID = wfInstance.Properties["Microsoft.SharePoint.ActivationProperties.ItemId"];
                            int itemID = Convert.ToInt32(strItemID);
                            Console.WriteLine("Item ID : " + strItemID);
                            Console.WriteLine(wfInstance.Properties["Microsoft.SharePoint.ActivationProperties.CurrentItemUrl"]);
                            logBldr.AppendLine("Workflow Status - " + wfInstance.Status.ToString() + "    |   Item ID - " + strItemID);
                            //logBldr.AppendLine("Suspended Items - " + wfInstance.Properties["Microsoft.SharePoint.ActivationProperties.CurrentItemUrl"] + "    |   Fault Info - " + wfInstance.FaultInfo);
                            // wfInstanceService.TerminateWorkflow(wfInstance);
                            //ctx.ExecuteQuery();
                            //Thread.Sleep(5000);
                            //wfInstanceService.StartWorkflowOnListItem(wfSubscription, itemID, startParameters);
                            //ctx.ExecuteQuery();
                        }
                    }

                    using (StreamWriter wtr = new StreamWriter("SuspendedWFsLog_" + DateTime.Now.ToString("mmddYYYYhhmmss") + ".txt"))
                    {
                        wtr.Write(Convert.ToString(logBldr));
                    }
                }
            }
        }

        public void RestartSuspendedWFItems(string[] ids, string webUrl, string listName, string workflowName)
        {
            StringBuilder logBldr = new StringBuilder();

            using (ClientContext ctx = new ClientContext(webUrl))
            {
                WorkflowStatus workflowStatus = WorkflowStatus.Suspended;
                Web oWeb = ctx.Web;
                List oList = oWeb.Lists.GetByTitle(listName);
                ctx.Load(oList, l => l.Id, l => l.WorkflowAssociations);
                ctx.ExecuteQuery();

                Guid listGUID = oList.Id;
                var association = oList.WorkflowAssociations.Where(wfA => wfA.Name == workflowName);

                var wfServicesManager = new WorkflowServicesManager(ctx, oWeb);
                var wfSubscriptionService = wfServicesManager.GetWorkflowSubscriptionService();
                WorkflowSubscriptionCollection wfSubscriptions = wfSubscriptionService.EnumerateSubscriptionsByList(listGUID);
                ctx.Load(wfSubscriptions, wfSubs => wfSubs.Where(wfSub => wfSub.Name == workflowName));
                ctx.ExecuteQuery();
                WorkflowSubscription wfSubscription = wfSubscriptions.First();

                if (wfSubscription != null)
                {
                    WorkflowInstanceService wfInstanceService = wfServicesManager.GetWorkflowInstanceService();
                    WorkflowInstanceCollection wfInstanceCollection = wfInstanceService.Enumerate(wfSubscription);
                    ctx.Load(wfInstanceCollection, wfInstances => wfInstances.Where(wfI => wfI.Status == workflowStatus));
                    ctx.ExecuteQuery();

                    var startParameters = new Dictionary<string, object>();

                    foreach (var wfInstance in wfInstanceCollection)
                    {
                        string strItemID = wfInstance.Properties["Microsoft.SharePoint.ActivationProperties.ItemId"];
                        int itemID = Convert.ToInt32(strItemID);
                        Console.WriteLine("Item ID : " + strItemID);
                        Console.WriteLine(wfInstance.Properties["Microsoft.SharePoint.ActivationProperties.CurrentItemUrl"]);
                        logBldr.AppendLine("Suspended Items - " + wfInstance.Properties["Microsoft.SharePoint.ActivationProperties.CurrentItemUrl"] + "    |   Fault Info - " + wfInstance.FaultInfo);
                        wfInstanceService.TerminateWorkflow(wfInstance);
                        ctx.ExecuteQuery();
                        Thread.Sleep(5000);
                        wfInstanceService.StartWorkflowOnListItem(wfSubscription, itemID, startParameters);
                        ctx.ExecuteQuery();
                    }

                    using (StreamWriter wtr = new StreamWriter("SuspendedWFsLog_" + DateTime.Now.ToString("mmddYYYYhhmmss") + ".txt"))
                    {
                        wtr.Write(Convert.ToString(logBldr));
                    }
                }
            }
        }
    }

    public static class TermStoreExtensions
    {

        public static void GetTerms(string webUrl)
        {
            using (ClientContext srcCtx = new ClientContext(webUrl))
            {
                var taxonomySession = TaxonomySession.GetTaxonomySession(srcCtx);
                var termStore = taxonomySession.GetDefaultSiteCollectionTermStore();
                var allTerms = termStore.GetAllTerms();
                srcCtx.ExecuteQuery();
                //print 
                foreach (var term in allTerms)
                {
                    Console.WriteLine(term.Name);
                }
            }
        }

        public static IEnumerable<Term> GetAllTerms(this TermStore termStore)
        {
            var ctx = termStore.Context;
            ctx.Load(termStore,
                       store => store.Groups.Include(
                           group => group.TermSets
                       )
               );
            ctx.ExecuteQuery();
            var result = new Dictionary<TermSet, TermCollection>();
            foreach (var termGroup in termStore.Groups)
            {
                foreach (var termSet in termGroup.TermSets)
                {
                    var allTermsInTermSet = termSet.GetAllTerms();
                    ctx.Load(allTermsInTermSet);
                    result[termSet] = allTermsInTermSet;
                }
            }
            var allTerms = result.SelectMany(x => x.Value);
            return allTerms;
        }

    }


    class ResponseData
    {
        public string QId1 { get; set; }
        public string QId2 { get; set; }
        public string Val1 { get; set; }
        public string Val2 { get; set; }
        public bool IsParent1 { get; set; }
        public bool IsParent2 { get; set; }
        public string ArticleId { get; set; }
        public string CountryId { get; set; }
        public string LawType { get; set; }
        public string Country { get; set; }
    }
}
