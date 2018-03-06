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
        public JsonResult GetLeagues()
        {
            return Json(LeagueService.GetLeagues(), JsonRequestBehavior.AllowGet);
        }
    }
}
