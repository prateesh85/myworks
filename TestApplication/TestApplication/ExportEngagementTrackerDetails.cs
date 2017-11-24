using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.SharePoint.Client;
using Microsoft.SharePoint.Client.Taxonomy;
using System.IO;
using SP = Microsoft.SharePoint.Client;

namespace TestApplication
{
    class ExportEngagementTrackerDetails
    {
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

                Console.WriteLine("Copied file to destination.");
                Console.WriteLine("*********************************************");
            }
        }
    }
}
