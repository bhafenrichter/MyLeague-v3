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

        [Route("api/GetLeaguesForUser")]
        public IEnumerable<League> GetLeaguesForUser(int id)
        {
            var query = db.Leagues
                            .Join(db.UserLeagues, league => league.ID, userleague => userleague.LeagueID, (league,userleague) => new { League = league, UserLeague = userleague })
                            .Where(x => x.UserLeague.UserID == id)
                            .Select(x => x.League)
                            .ToList();
            return query;
        }

        [Route("api/CreateLeague")]
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