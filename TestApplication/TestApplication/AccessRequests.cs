using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.SharePoint.Client;
using Microsoft.SharePoint.Client.UserProfiles;
using Microsoft.Office.Interop.Excel;
using System.IO;

namespace TestApplication
{
    class AccessRequests
    {
        public void CaptureRequests(string srcWeb, string srcList)
        {
            using (ClientContext destCtx = new ClientContext(srcWeb))
            {
                List oDestList = destCtx.Web.Lists.GetByTitle(srcList);
                //CamlQuery camlQuery = new CamlQuery(); //CamlQuery.CreateAllItemsQuery();
                //camlQuery.ViewXml = "<View><Query><OrderBy><FieldRef Name='Status' Ascending='TRUE'/></OrderBy><Where><And><Eq><FieldRef Name='_ModerationStatus'/><Value Type='ModStat'>2</Value></Eq><Geq><FieldRef Name='ID'/><Value Type='Number'>393</Value></Geq></And></Where></Query></View>";
                CamlQuery camlQuery = CamlQuery.CreateAllItemsQuery();
                ListItemCollection items = oDestList.GetItems(camlQuery);
                FieldCollection flds = oDestList.Fields;
                destCtx.Load(flds);
                destCtx.Load(items);
                destCtx.ExecuteQuery();

                Console.WriteLine("Total Items - " + items.Count.ToString());
                ExportToExcel(destCtx, items);
            }
        }

        private void ExportToExcel(ClientContext destCtx, ListItemCollection listFields)
        {
            PeopleManager peopleManager = new PeopleManager(destCtx);
            StringBuilder bldr = new StringBuilder();
            Microsoft.Office.Interop.Excel.Application oXL;
            Microsoft.Office.Interop.Excel._Workbook oWB;
            Microsoft.Office.Interop.Excel._Worksheet oSheet;

            int row = 2;
            oXL = new Microsoft.Office.Interop.Excel.Application();
            //Get a new workbook.
            oWB = (Microsoft.Office.Interop.Excel._Workbook)(oXL.Workbooks.Add(""));
            oSheet = (Microsoft.Office.Interop.Excel._Worksheet)oWB.ActiveSheet;

            oSheet.Cells[1, 1] = "ID";
            oSheet.Cells[1, 2] = "Requestor Email";
            oSheet.Cells[1, 3] = "Requestor WorkLocation Country";
            oSheet.Cells[1, 4] = "Requestor Area";
            oSheet.Cells[1, 5] = "Requestor ServiceLine";
            oSheet.Cells[1, 6] = "Requestor SubServiceLine";
            oSheet.Cells[1, 7] = "Requestor Rank";
            oSheet.Cells[1, 8] = "Status";
            oSheet.Cells[1, 9] = "ModerationStatus";//_ModerationStatus

            foreach (ListItem item in listFields)
            {
                //if (Convert.ToInt32(item["Status"]) == 0)
                {
                    string requestor = string.Empty;
                    try
                    {
                        requestor = Convert.ToString(item["RequestedFor"]).Split('|')[1];
                        PersonProperties RequestedFor = peopleManager.GetPropertiesFor(requestor);
                        destCtx.Load(RequestedFor, p => p.AccountName, p => p.Email, p => p.DisplayName, p => p.UserProfileProperties);
                        destCtx.ExecuteQuery();

                        oSheet.Cells[row, 1] = item.Id;
                        oSheet.Cells[row, 2] = RequestedFor.Email;
                        oSheet.Cells[row, 3] = RequestedFor.UserProfileProperties["EYWorkLocationAddressCountry"];
                        oSheet.Cells[row, 4] = RequestedFor.UserProfileProperties["EYAreaDescription"];
                        oSheet.Cells[row, 5] = RequestedFor.UserProfileProperties["EYServiceLineDescription"];
                        oSheet.Cells[row, 6] = RequestedFor.UserProfileProperties["EYSubServiceLineDescription"];
                        oSheet.Cells[row, 7] = RequestedFor.UserProfileProperties["EYRankDescription"];
                        oSheet.Cells[row, 8] = item["Status"];//"Pending";
                        oSheet.Cells[row, 9] = item["_ModerationStatus"];

                        oSheet.Cells.Columns.AutoFit();
                        Console.WriteLine("ID: {1} \nRequested For: {0} \nStatus: {2} \nModeration Status: {3} \n**********************************************************************", RequestedFor.Email, item.Id, Convert.ToString(item["Status"]), Convert.ToString(item["_ModerationStatus"]));
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine("Exception: " + ex.Message);
                        bldr.AppendLine("User - " + requestor + " - not found. Error Details : " + Environment.NewLine + ex.Message + Environment.NewLine + ex.StackTrace);
                        oSheet.Cells[row, 2] = requestor;
                        oSheet.Cells[row, 3] = "Info missing in profile";
                        oSheet.Cells[row, 4] = "Info missing in profile";
                        oSheet.Cells[row, 5] = "Info missing in profile";
                        oSheet.Cells[row, 6] = "Info missing in profile";
                        oSheet.Cells[row, 7] = "Info missing in profile";
                        oSheet.Cells[row, 8] = item["Status"];//"Pending";
                        oSheet.Cells[row, 9] = item["_ModerationStatus"];
                    }
                    row++;
                }
            }

            try
            {
                string fileName = @"C:\Test\AccessRequests_" + DateTime.Now.ToString("ddMMyyyyhhmmss") + ".xlsx";
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

        private static void releaseObject(object obj)
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
    }
}
