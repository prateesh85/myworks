//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Text;
//using System.Threading.Tasks;
//using Microsoft.SharePoint;

//namespace TestApplication
//{
//    class GetEventReceivers
//    {
//        string webUrl = "http://cldsp.cloudapp.net:1100/";
//        string listUrl = "";
//        public const string list_CountryEdit = "/Lists/CountryPermissions/";
//        public const string list_ImplementationStatusEdit = "/Lists/ImplementationStatusEdit/";
//        string list_QuestionaireResponse = "/Lists/QuestionaireResponse/";

//        public void GetAllEventReceivers()
//        {
//            listUrl = list_CountryEdit;
//            GetItems();
//            //using(SPSite oSite = new SPSite(webUrl))
//            //{
//            //    using(SPWeb oWeb = oSite.OpenWeb())
//            //    {
//            //        SPList oList = oWeb.GetList(listUrl);
//            //        if (oList != null)
//            //        {
//            //            SPEventReceiverDefinitionCollection eventsColl = oList.EventReceivers;
//            //            int count = eventsColl.Count;
//            //            if (count > 0)
//            //            {
//            //                for (int i = 0; i < count; i++)
//            //                {
//            //                    SPEventReceiverDefinition eventReceiver = oList.EventReceivers[i];
//            //                    Console.WriteLine(eventReceiver.Class);
//            //                    Console.WriteLine(eventReceiver.Type);
//            //                }
//            //            }                        
//            //        }
//            //    }
//            //}
//        }

//        public void GetItems()
//        {
//            listUrl = list_QuestionaireResponse;
//            using (SPSite oSite = new SPSite(webUrl))
//            {
//                using (SPWeb oWeb = oSite.OpenWeb())
//                {
//                    SPList oList = oWeb.GetList(listUrl);
//                    if (oList != null)
//                    {
//                        SPQuery camlQuery = new SPQuery();
//                        camlQuery.Query = "<Where><Eq><FieldRef Name=\"QREditItemID\" /><Value Type=\"Text\">63</Value></Eq></Where>";
//                        //camlQuery.Query = "<Query><Where><Eq><FieldRef Name=\"QREditItemID\" /><Value Type=\"Text\">" + sourceItem.ID.ToString() + "</Value></Eq></Where></Query>";
//                        camlQuery.ViewAttributes = "Scope='RecursiveAll'";
//                        SPListItemCollection oItems = oList.GetItems(camlQuery);
//                        if (oItems.Count > 0)
//                        {
                            
//                        }
//                    }
//                }
//            }
//        }
//    }
//}
