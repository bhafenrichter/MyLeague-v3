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

namespace MyLeague.Data.Controllers
{
    public class LeaguesController : ApiController
    {
        private MyLeaguesEntities db = new MyLeaguesEntities();

        // GET: api/Leagues
        public IQueryable<League> GetLeagues()
        {
            return db.Leagues;
        }

        // GET: api/Leagues/5
        [ResponseType(typeof(League))]
        public IHttpActionResult GetLeague(int id)
        {
            League league = db.Leagues.Find(id);
            if (league == null)
            {
                return NotFound();
            }

            return Ok(league);
        }

        [System.Web.Http.Route("api/Upload")]
        public HttpPostedFile Upload()
        {
            var httpPostedFile = HttpContext.Current.Request.Files["file"];
            return httpPostedFile;
        }

        [System.Web.Http.Route("api/GetLeaguesForUser")]
        public IEnumerable<League> GetLeaguesForUser(int id)
        {
            var query = db.Leagues
                            .Join(db.UserLeagues, league => league.ID, userleague => userleague.LeagueID, (league,userleague) => new { League = league, UserLeague = userleague })
                            .Where(x => x.UserLeague.UserID == id && x.UserLeague.IsDeleted == false)
                            .Select(x => x.League)
                            .ToList();
            return query;
        }

        [System.Web.Http.Route("api/CreateLeague")]
        public void CreateLeague(string name, string type, int userid)
        {
            League l = new League();
            l.LeagueName = name;
            l.LeagueType = type;
            l.CreatedOn = DateTime.Now;
            l.IsDeleted = false;
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

        [System.Web.Http.Route("api/GetGamesForLeague")]
        public IEnumerable<Game> GetGamesForLeague(int id)
        {
            var query = db.Games
                .Where(x => x.LeagueID == id).OrderByDescending(x => x.CreatedOn).ToList();
            return query;
        }

        [System.Web.Http.Route("api/GetUserLeaguesForLeague")]
        public IEnumerable<UserLeague> GetUserLeaguesForLeague(int id)
        {
            var query = db.UserLeagues
                .Where(x => x.LeagueID == id && x.IsDeleted == false)
                .ToList();

            return query;
        }

        [System.Web.Http.Route("api/LeaveLeague")]
        public void LeaveLeague(int userleagueid)
        {
            var userleague = db.UserLeagues.Where(x => x.ID == userleagueid).FirstOrDefault();
            userleague.IsDeleted = true;
            db.SaveChanges();
        }

        [System.Web.Http.Route("api/CreateGame")]
        public void CreateGame(int userid, int opponentid, int userscore, int opponentscore, int lat, int lng, int leagueid)
        {
            if(userid != opponentid)
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
                } else if (userscore == opponentscore) {
                    user.Ties++;
                    opponent.Ties++;
                } else
                {
                    user.Losses++;
                    opponent.Wins++;
                }
                db.SaveChanges();
            }
        }

        [System.Web.Http.Route("api/GetGamesPlayedCountForUser")]
        public int GetGamesPlayedCountForUser(int id)
        {
            return db.Games.Where(x => x.UserID == id || x.OpponentID == id).Count();
        }

        [System.Web.Http.Route("api/GetGamesForUserLeague")]
        public IEnumerable<Game> GetGamesForUserLeague(int id)
        {
            return db.Games.Where(x => x.UserID == id || x.OpponentID == id).ToList();
        }

        [System.Web.Http.HttpGet]
        [System.Web.Http.Route("api/SearchUsers")]
        public IEnumerable<User> SearchUsers(string searchtext)
        {
            return db.Users.Where(x => x.FirstName.Contains(searchtext)
                || x.LastName.Contains(searchtext)
                || x.Email.Contains(searchtext))
                .Take(10)
                .ToList();
        }

        [System.Web.Http.Route("api/AddUserToLeague")]
        public void AddUserToLeague(int userid, int leagueid)
        {
            if(db.UserLeagues.Where(x => x.UserID == userid && x.LeagueID == leagueid).Count() == 0)
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
                db.SaveChanges();
            }
            
        }

        [System.Web.Http.Route("api/InviteUser")]
        public void InviteUser(int userid, int inviteeid, int leagueid, string message)
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

        [System.Web.Http.Route("api/GetRequests")]
        public IEnumerable<LeagueRequest> GetRequests(int userid)
        {
            return db.LeagueRequests.Where(x => x.UserID == userid).ToList();
        }

        public void AcceptRequest(int requestId)
        {
            var request = db.LeagueRequests.Where(x => x.ID == requestId).FirstOrDefault();
            request.IsDecided = true;
            AddUserToLeague(request.UserID, request.LeagueID);
        }

        // DELETE: api/Leagues/5
        [ResponseType(typeof(League))]
        public IHttpActionResult DeleteLeague(int id)
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

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool LeagueExists(int id)
        {
            return db.Leagues.Count(e => e.ID == id) > 0;
        }
    }
}