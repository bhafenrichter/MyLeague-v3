using Microsoft.Azure;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Blob;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MyLeague.Data.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            ViewBag.Title = "Home Page";

            return View();
        }
        [HttpPost]
        public ActionResult Index(HttpPostedFileBase file)
        {
            //var httpPostedFile = ControllerContext.Current.Request.Files["file"];

            //get a reference to the storage account
            CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
                CloudConfigurationManager.GetSetting("StorageConnectionString"));

            //create blob client 
            CloudBlobClient blobClient = storageAccount.CreateCloudBlobClient();

            // Retrieve a reference to a container.
            CloudBlobContainer container = blobClient.GetContainerReference("profile-picture");

            // Create the container if it doesn't already exist.
            container.CreateIfNotExists();

            // Create or overwrite the "myblob" blob with contents from a local file.
            CloudBlockBlob blockBlob = container.GetBlockBlobReference("myblob.png");
            blockBlob.UploadFromStream(file.InputStream);

            return RedirectToAction("Index");
        }
    }
}
