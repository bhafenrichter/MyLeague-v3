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
using MyLeague.Data.Services;
using System.Data.Entity;

namespace MyLeague.Data.Controllers
{
    public class UsersController : ApiController
    {
        private MyLeaguesEntities db = new MyLeaguesEntities();

        // GET: api/Users
        public IQueryable<User> GetUsers()
        {
            return db.Users;
        }
        
        [Route("api/Login")]
        public User Login(string username, string password)
        {
            var user = SecurityService.Login(username, password);
            if(user != null)
            {
                return user;
            }else
            {
                return null;
            }
        }

        [Route("api/Create")]
        public void CreateUser(string email, string password, string firstname, string lastname)
        {
            User user = new Data.User();
            user.Email = email;
            user.Password = password;
            user.FirstName = firstname;
            user.LastName = lastname;
            if(user.Email != "" && user.Password != "")
            {
                user.CreatedOn = DateTime.Now;
                user = SecurityService.CreateAccount(user);
            }
        }
        // GET: api/Users/5
        [ResponseType(typeof(User))]
        public IHttpActionResult GetUser(int id)
        {
            User user = db.Users.Find(id);
            if (user == null)
            {
                return NotFound();
            }

            return Ok(user);
        }

        //// POST: api/Users
        //[ResponseType(typeof(User))]
        //public IHttpActionResult PostUser(User user)
        //{
        //    if (!ModelState.IsValid)
        //    {
        //        return BadRequest(ModelState);
        //    }

        //    db.Users.Add(user);

        //    try
        //    {
        //        db.SaveChanges();
        //    }
        //    catch (DbUpdateException)
        //    {
        //        if (UserExists(user.ID))
        //        {
        //            return Conflict();
        //        }
        //        else
        //        {
        //            throw;
        //        }
        //    }

        //    return CreatedAtRoute("DefaultApi", new { id = user.ID }, user);
        //}

        // DELETE: api/Users/5
        //[ResponseType(typeof(User))]
        //public IHttpActionResult DeleteUser(int id)
        //{
        //    User user = db.Users.Find(id);
        //    if (user == null)
        //    {
        //        return NotFound();
        //    }

        //    db.Users.Remove(user);
        //    db.SaveChanges();

        //    return Ok(user);
        //}

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool UserExists(int id)
        {
            return db.Users.Count(e => e.ID == id) > 0;
        }
    }
}