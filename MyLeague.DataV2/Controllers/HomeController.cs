using MyLeague.DataV2.Data;
using MyLeague.DataV2.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MyLeague.DataV2.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            ViewBag.Title = "Home Page";

            return View();
        }

        [System.Web.Mvc.Route("/api/GetLeagues")]
        public JsonResult GetLeagues()
        {
            return Json(LeagueService.GetLeagues(), JsonRequestBehavior.AllowGet);
        }

        [System.Web.Mvc.Route("/api/GetUser")]
        public JsonResult GetUser(int ID)
        {
            return Json(LeagueService.GetUser(ID), JsonRequestBehavior.AllowGet);
        }

        [System.Web.Mvc.Route("/api/GetLeaguesForUser")]
        public JsonResult GetLeaguesForUser(int UserID)
        {
            return Json(LeagueService.GetLeaguesForUser(UserID), JsonRequestBehavior.AllowGet);
        }

        [System.Web.Mvc.Route("/api/GetGamesForLeague")]
        public JsonResult GetGamesForLeague(int LeagueID)
        {
            return Json(LeagueService.GetGamesForLeague(LeagueID), JsonRequestBehavior.AllowGet);
        }

        [System.Web.Mvc.Route("/api/GetUsersForLeague")]
        public JsonResult GetUsersForLeague(int LeagueID)
        {
            return Json(LeagueService.GetUsersForLeague(LeagueID), JsonRequestBehavior.AllowGet);
        }

        [System.Web.Mvc.Route("/api/SaveGame")]
        public JsonResult SaveGame(ML_Game Game)
        {
            var Message = LeagueService.SaveGame(Game);
            return Json(Message, JsonRequestBehavior.AllowGet);
        }


        [System.Web.Mvc.Route("/api/SaveUser")]
        public JsonResult SaveGame(ML_User User)
        {
            var Message = LeagueService.SaveUser(User);
            return Json(Message, JsonRequestBehavior.AllowGet);
        }

        [System.Web.Mvc.Route("/api/SaveLeague")]
        public JsonResult SaveLeague(ML_League League)
        {
            var Message = LeagueService.SaveLeague(League);
            return Json(Message, JsonRequestBehavior.AllowGet);
        }

        [System.Web.Mvc.Route("/api/AddUserToLeague")]
        public JsonResult SaveGame(ML_UserLeague User)
        {
            var Message = LeagueService.SaveUserLeague(User);
            return Json(Message, JsonRequestBehavior.AllowGet);
        }
    }
}
