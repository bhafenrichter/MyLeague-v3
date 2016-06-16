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
    public class UserLeaguesController : ApiController
    {
        private MyLeaguesEntities db = new MyLeaguesEntities();

        // GET: api/UserLeagues
        public IQueryable<UserLeague> GetUserLeagues()
        {
            return db.UserLeagues;
        }

        // GET: api/UserLeagues/5
        [ResponseType(typeof(UserLeague))]
        public IHttpActionResult GetUserLeague(int id)
        {
            UserLeague userLeague = db.UserLeagues.Find(id);
            if (userLeague == null)
            {
                return NotFound();
            }

            return Ok(userLeague);
        }


        // POST: api/UserLeagues
        [ResponseType(typeof(UserLeague))]
        public IHttpActionResult PostUserLeague(UserLeague userLeague)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.UserLeagues.Add(userLeague);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = userLeague.ID }, userLeague);
        }

        // DELETE: api/UserLeagues/5
        [ResponseType(typeof(UserLeague))]
        public IHttpActionResult DeleteUserLeague(int id)
        {
            UserLeague userLeague = db.UserLeagues.Find(id);
            if (userLeague == null)
            {
                return NotFound();
            }

            userLeague.IsDeleted = true;
            db.SaveChanges();

            return Ok(userLeague);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool UserLeagueExists(int id)
        {
            return db.UserLeagues.Count(e => e.ID == id) > 0;
        }
    }
}