using System;
using System.Collections.Generic;
using System.DirectoryServices;
using System.DirectoryServices.AccountManagement;
using System.Linq;
using System.Security.Principal;
using System.Text;
using System.Threading.Tasks;

namespace TestApplication
{
    class ADOperations
    {
        string directoryString = "OU=8 CLD Users,DC=8cld,DC=net";
        string stringDomainName = "8cld.net";//System.Net.NetworkInformation.IPGlobalProperties.GetIPGlobalProperties().DomainName;

        string userName = "adadmin";
        string pass = "P@ssw0rd1";

        public StringBuilder AddUserToAD(string userID, string DisplayName, StringBuilder logBldr)
        {
            using (DirectoryEntry objDirectory = new DirectoryEntry("LDAP://" + directoryString, userName, pass))
            {
                using (DirectorySearcher dSearch = new DirectorySearcher(objDirectory))
                {
                    dSearch.Filter = string.Format("(&(objectCategory=person)(objectClass=user)(sAMAccountName=" + userID + "))");
                    SearchResult result = dSearch.FindOne();

                    using (WindowsIdentity.GetCurrent().Impersonate())
                    {
                        using (PrincipalContext pCtx = new PrincipalContext(ContextType.Domain, stringDomainName, directoryString, userName, pass))
                        {
                            using (UserPrincipal objNewUser = new UserPrincipal(pCtx, userID, "Password$1", true))
                            {
                                objNewUser.EmailAddress = "prateesh.nair@xe04.ey.com";
                                objNewUser.DisplayName = DisplayName;
                                objNewUser.Enabled = true;
                                objNewUser.PasswordNeverExpires = true;
                                objNewUser.UserCannotChangePassword = false;
                                objNewUser.GivenName = DisplayName;
                                objNewUser.Save();
                            }
                        }
                    }
                }                
            }

            return logBldr;
        }
    }
}
