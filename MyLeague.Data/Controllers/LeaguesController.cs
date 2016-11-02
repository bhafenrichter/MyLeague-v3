using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;
using MyLeague.Data;
using System.Web;
using Microsoft.Azure; // Namespace for CloudConfigurationManager
using Microsoft.WindowsAzure.Storage; // Namespace for CloudStorageAccount
using Microsoft.WindowsAzure.Storage.Blob; // Namespace for Blob storage types

namespace MyLeague.Data.Controllers
{
    public class LeaguesController : ApiController
    {


        // GET: api/Leagues
        public IQueryable<League> GetLeagues()
        {
            using (var db = new MyLeaguesEntities())
                return db.Leagues;
        }

        // GET: api/Leagues/5
        [ResponseType(typeof(League))]
        public IHttpActionResult GetLeague(int id)
        {
            using (var db = new MyLeaguesEntities())
            {
                League league = db.Leagues.Find(id);
                if (league == null)
                {
                    return NotFound();
                }

                return Ok(league);
            }

        }

        [System.Web.Http.Route("api/Upload")]
        public string Upload(int id)
        {
            var httpPostedFile = HttpContext.Current.Request.Files["file"];

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
            CloudBlockBlob blockBlob = container.GetBlockBlobReference(id.ToString() + ".png");
            blockBlob.UploadFromStream(httpPostedFile.InputStream);

            return httpPostedFile.ContentType;
        }

        [System.Web.Http.Route("api/AvatarUpload")]
        public string AvatarUpload(int id)
        {
            var httpPostedFile = HttpContext.Current.Request.Files["file"];

            //get a reference to the storage account
            CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
                CloudConfigurationManager.GetSetting("StorageConnectionString"));

            //create blob client 
            CloudBlobClient blobClient = storageAccount.CreateCloudBlobClient();

            // Retrieve a reference to a container.
            CloudBlobContainer container = blobClient.GetContainerReference("league-avatar");

            // Create the container if it doesn't already exist.
            container.CreateIfNotExists();

            // Create or overwrite the "myblob" blob with contents from a local file.
            CloudBlockBlob blockBlob = container.GetBlockBlobReference(id.ToString() + ".png");
            blockBlob.UploadFromStream(httpPostedFile.InputStream);

            return httpPostedFile.ContentType;
        }

        [System.Web.Http.Route("api/GetLeaguesForUser")]
        public List<League> GetLeaguesForUser(int id)
        {
            using (var db = new MyLeaguesEntities())
            {
                db.Configuration.LazyLoadingEnabled = false;
                var query = db.Leagues
                                .Join(db.UserLeagues, league => league.ID, userleague => userleague.LeagueID, (league, userleague) => new { League = league, UserLeague = userleague })
                                .Where(x => x.UserLeague.UserID == id && x.UserLeague.IsDeleted == false)
                                .Select(x => x.League)
                                .Include("UserLeagues")
                                .Include("UserLeagues.User")
                                .Include("UserLeagues.User")
                                .Include("UserLeagues.Games")
                                .Include("UserLeagues.Games1")
                                .ToList();
                return query;
            }

        }

        [System.Web.Http.Route("api/CreateLeague")]
        public void CreateLeague(string name, string type, int userid)
        {
            using (var db = new MyLeaguesEntities())
            {
                League l = new League();
                l.LeagueName = name;
                l.LeagueType = type;
                l.CreatedOn = DateTime.Now;
                l.IsDeleted = false;
                l.MemberCount = 1;
                db.Leagues.Add(l);
                db.SaveChanges();

                UserLeague ul = new UserLeague();
                ul.UserID = userid;
                ul.PointsAllowed = 0;
                ul.PointsScored = 0;
                ul.Wins = 0;
                ul.Losses = 0;
                ul.LeagueID = l.ID;
                ul.IsDeleted = false;
                ul.CreatedOn = DateTime.Now;
                db.UserLeagues.Add(ul);
                db.SaveChanges();
            }

        }

        [System.Web.Http.Route("api/GetGamesForLeague")]
        public IEnumerable<Game> GetGamesForLeague(int id)
        {
            using (var db = new MyLeaguesEntities())
            {
                db.Configuration.LazyLoadingEnabled = false;
                var query = db.Games
                    .Where(x => x.LeagueID == id)
                    .OrderByDescending(x => x.CreatedOn).ToList();
                return query;
            }

        }

        [System.Web.Http.Route("api/GetUserLeaguesForLeague")]
        public IEnumerable<UserLeague> GetUserLeaguesForLeague(int id)
        {
            using (var db = new MyLeaguesEntities())
            {
                db.Configuration.LazyLoadingEnabled = false;
                var query = db.UserLeagues
                    .Include("User")
                    .Where(x => x.LeagueID == id)
                    .ToList();

                return query;
            }

        }

        [System.Web.Http.Route("api/LeaveLeague")]
        public void LeaveLeague(int userleagueid)
        {
            using (var db = new MyLeaguesEntities())
            {
                var userleague = db.UserLeagues.Where(x => x.ID == userleagueid).FirstOrDefault();
                userleague.IsDeleted = true;
                db.SaveChanges();
            }

        }

        [System.Web.Http.Route("api/CreateGame")]
        public void CreateGame(int userid, int opponentid, int userscore, int opponentscore, int lat, int lng, int leagueid)
        {
            using (var db = new MyLeaguesEntities())
            {
                if (userid != opponentid)
                {
                    Game g = db.Games.Create();
                    g.UserID = userid;
                    g.OpponentID = opponentid;
                    g.UserScore = userscore;
                    g.OpponentScore = opponentscore;
                    g.Latitude = lat;
                    g.Longitude = lng;
                    g.LeagueID = leagueid;
                    g.CreatedOn = DateTime.Now;
                    db.Games.Add(g);

                    var user = db.UserLeagues.Where(x => x.ID == userid).FirstOrDefault();
                    user.PointsScored += userscore;
                    user.PointsAllowed += opponentscore;

                    var opponent = db.UserLeagues.Where(x => x.ID == opponentid).FirstOrDefault();
                    opponent.PointsScored += opponentscore;
                    opponent.PointsAllowed += userscore;

                    if (userscore > opponentscore)
                    {
                        user.Wins++;
                        opponent.Losses++;
                    }
                    else if (userscore == opponentscore)
                    {
                        user.Ties++;
                        opponent.Ties++;
                    }
                    else
                    {
                        user.Losses++;
                        opponent.Wins++;
                    }
                    db.SaveChanges();
                }

            }
        }

        [System.Web.Http.Route("api/GetGamesPlayedCountForUser")]
        public int GetGamesPlayedCountForUser(int id)
        {
            using (var db = new MyLeaguesEntities())
            {
                return db.Games.Where(x => x.UserID == id || x.OpponentID == id).Count();
            }

        }

        [System.Web.Http.Route("api/GetGamesForUserLeague")]
        public IEnumerable<Game> GetGamesForUserLeague(int id)
        {
            using (var db = new MyLeaguesEntities())
            {
                return db.Games.Where(x => x.UserID == id || x.OpponentID == id).ToList();
            }

        }

        [System.Web.Http.HttpGet]
        [System.Web.Http.Route("api/SearchUsers")]
        public IEnumerable<User> SearchUsers(string searchtext)
        {
            using (var db = new MyLeaguesEntities())
            {
                db.Configuration.LazyLoadingEnabled = false;
                return db.Users.Where(x => x.FirstName.Contains(searchtext)
                    || x.LastName.Contains(searchtext)
                    || x.Email.Contains(searchtext)
                    || (x.FirstName + " " + x.LastName).Contains(searchtext))
                    .Take(10)
                    .ToList();
            }

        }

        [System.Web.Http.Route("api/AddUserToLeague")]
        public void AddUserToLeague(int userid, int leagueid)
        {
            using (var db = new MyLeaguesEntities())
            {
                if (db.UserLeagues.Where(x => x.UserID == userid && x.LeagueID == leagueid).Count() == 0)
                {
                    UserLeague ul = new UserLeague();
                    ul.UserID = userid;
                    ul.PointsAllowed = 0;
                    ul.PointsScored = 0;
                    ul.Wins = 0;
                    ul.Losses = 0;
                    ul.LeagueID = leagueid;
                    ul.IsDeleted = false;
                    ul.CreatedOn = DateTime.Now;
                    db.UserLeagues.Add(ul);

                    League l = db.Leagues.Where(x => x.ID == leagueid).FirstOrDefault();
                    l.MemberCount++;

                    db.SaveChanges();                    
                }
            }


        }

        [System.Web.Http.Route("api/InviteUser")]
        public void InviteUser(int userid, int inviteeid, int leagueid, string message)
        {
            using (var db = new MyLeaguesEntities())
            {
                var request = db.LeagueRequests.Create();
                request.UserID = userid;
                request.InviteeID = inviteeid;
                request.LeagueID = leagueid;
                request.Message = message;
                request.CreatedOn = DateTime.Now;
                request.IsDecided = false;
                db.LeagueRequests.Add(request);
                db.SaveChanges();
            }

        }

        [System.Web.Http.Route("api/GetRequests")]
        public IEnumerable<LeagueRequest> GetRequests(int userid)
        {
            using (var db = new MyLeaguesEntities())
            {
                return db.LeagueRequests.Where(x => x.UserID == userid).ToList();
            }

        }

        public void AcceptRequest(int requestId)
        {
            using (var db = new MyLeaguesEntities())
            {
                var request = db.LeagueRequests.Where(x => x.ID == requestId).FirstOrDefault();
                request.IsDecided = true;
                AddUserToLeague(request.UserID, request.LeagueID);
            }

        }

        // DELETE: api/Leagues/5
        [ResponseType(typeof(League))]
        public IHttpActionResult DeleteLeague(int id)
        {
            using (var db = new MyLeaguesEntities())
            {
                League league = db.Leagues.Find(id);
                if (league == null)
                {
                    return NotFound();
                }

                db.Leagues.Remove(league);
                db.SaveChanges();

                return Ok(league);
            }

        }

        protected override void Dispose(bool disposing)
        {
            using (var db = new MyLeaguesEntities())
            {
                if (disposing)
                {
                    db.Dispose();
                }
                base.Dispose(disposing);

            }

        }

        private bool LeagueExists(int id)
        {
            using (var db = new MyLeaguesEntities())
            {
                return db.Leagues.Count(e => e.ID == id) > 0;
            }

        }
    }
}