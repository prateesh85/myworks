using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.IO;
using Microsoft.SharePoint.Client;
using System.Net;

namespace TestApplication
{
    class CreateFiles
    {
        #region System Account
        NetworkCredential srcSystemAccount = new NetworkCredential("D.GNIDE-SVC-SETUP.1", "5CGG66AxF5Cvt4", "eydev");
        #endregion

        public void GetItems(string webUrl, string listName)
        {
            using (ClientContext srcCtx = new ClientContext(webUrl))
            {
                srcCtx.Credentials = srcSystemAccount;
                List oList = srcCtx.Web.Lists.GetByTitle(listName);
                ListItemCollection items = oList.GetItems(CamlQuery.CreateAllItemsQuery());
                List oLibrary = srcCtx.Web.Lists.GetByTitle("MasterInsightsLibrary");
                ListItemCollection libItems = oList.GetItems(CamlQuery.CreateAllItemsQuery());
                srcCtx.Load(items);
                srcCtx.Load(libItems);
                srcCtx.ExecuteQuery();

                if (items.Count > 0)
                {
                    foreach (ListItem oItem in items)
                    {
                        //CreateFilesFromItem(Convert.ToString(oItem["Title"]), Convert.ToString(oItem["MaturityInsightItem"]));
                        foreach (ListItem oLibItem in libItems)
                        {
                            string fileName = Convert.ToString(oLibItem["FileLeafRef"]);
                            //if(Convert.ToString(oLibItem["FileLeafRef"]))
                        }
                    }
                }
            }
        }

        private void CreateFilesFromItem(string fileName, string content)
        {
            System.IO.File.WriteAllText(@"C:\GNInsights\" + fileName + ".html", content);
        }

        public void MoveFiles(string webUrl, string listName, string destUrl, string destWebUrl, string destListName)
        {
            using (ClientContext srcCtx = new ClientContext(webUrl))
            {
                using (ClientContext destCtx = new ClientContext(destUrl))
                {

                    //srcCtx.Credentials = srcSystemAccount;
                    Web oWeb = srcCtx.Web;
                    List oList = oWeb.Lists.GetByTitle(listName);
                    ListItemCollection items = oList.GetItems(CamlQuery.CreateAllItemsQuery());

                    srcCtx.Load(items, a => a.IncludeWithDefaultProperties(b => b.File));
                    srcCtx.ExecuteQuery();

                    List oLib = destCtx.Web.Lists.GetByTitle(destListName);
                    destCtx.Load(oLib, i => i.RootFolder.ServerRelativeUrl);

                    destCtx.ExecuteQuery();

                    destUrl = oLib.RootFolder.ServerRelativeUrl;

                    if (items.Count > 0)
                    {
                        foreach (ListItem oItem in items)
                        {
                            Microsoft.SharePoint.Client.File oFile = oWeb.GetFileByServerRelativeUrl(Convert.ToString(oItem["FileRef"]));
                            srcCtx.Load(oFile);

                            oFile.MoveTo(destUrl, MoveOperations.None);

                            srcCtx.ExecuteQuery();
                        }
                    }
                }
            }
        }

        private void MapPropertiesInLibrary(string fileName, ListItem spItem, ListItem spLibItem)
        {

        }

        public void UploadDocument(string webUrl, string libraryName, string filePath)
        {
            using (ClientContext srcCtx = new ClientContext(webUrl))
            {
                int count = 4500;
                List oList = srcCtx.Web.Lists.GetByTitle(libraryName);
                Folder oFolder = oList.RootFolder;

                srcCtx.Load(oFolder, a => a.ServerRelativeUrl);
                srcCtx.ExecuteQuery();

                using (FileStream fs = new FileStream(filePath, FileMode.Open))
                {
                    for (int i = 0; i < count; i++)
                    {
                        Microsoft.SharePoint.Client.File.SaveBinaryDirect(srcCtx, oFolder.ServerRelativeUrl + "/TOPTest" + i.ToString() + ".xlsx", fs, true);
                        Console.WriteLine("Uploaded Document number : " + (i + 1).ToString());
                    }
                }
            }
        }
    }
}
