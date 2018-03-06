using MyLeague.DataV2.Data;
using MyLeague.DataV2.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Mvc;

namespace MyLeague.DataV2.Controllers
{
    public class LeagueController : ApiController
    {
        [System.Web.Mvc.Route("/api/GetLeagues")]
        public IHttpActionResult GetLeagues()
        {
            return Ok(LeagueService.GetLeagues());
        }

        [System.Web.Mvc.Route("/api/GetLeaguesForUser")]
        public IHttpActionResult GetLeaguesForUser(int UserID)
        {
            return Ok(LeagueService.GetLeaguesForUser(UserID));
        }

        [System.Web.Mvc.Route("/api/GetGamesForLeague")]
        public IHttpActionResult GetGamesForLeague(int LeagueID)
        {
            return Ok(LeagueService.GetGamesForLeague(LeagueID));
        }

        [System.Web.Mvc.Route("/api/GetUsersForLeague")]
        public IHttpActionResult GetUsersForLeague(int LeagueID)
        {
            return Ok(LeagueService.GetUsersForLeague(LeagueID));
        }

        [System.Web.Mvc.Route("/api/SaveGame")]
        public IHttpActionResult SaveGame(ML_Game Game)
        {
            var Message = LeagueService.SaveGame(Game);
            return Ok(Message);
        }

        [System.Web.Mvc.Route("/api/SaveLeague")]
        public IHttpActionResult SaveLeague(ML_League League)
        {
            var Message = LeagueService.SaveLeague(League);
            return Ok(Message);
        }

        [System.Web.Mvc.Route("/api/AddUserToLeague")]
        public IHttpActionResult SaveGame(ML_UserLeague User)
        {
            var Message = LeagueService.SaveUserLeague(User);
            return Ok(Message);
        }
    }
}
