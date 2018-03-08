using MyLeague.DataV2.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MyLeague.DataV2.Services
{
    public class LeagueService
    {
        internal static dynamic GetLeagues()
        {
            using (var db = new HoftwareEntities())
            {
                return db.ML_League.Include("ML_User").Select(x => new { x.CreatedBy, x.CreatedOn, x.ID, x.LeagueTypeID, x.Name, x.ML_User }).ToList();
            }
        }

        internal static List<ML_League> GetLeaguesForUser(int UserID)
        {
            using (var db = new HoftwareEntities())
            {
                return db.ML_UserLeague.Include("ML_League").Where(x => x.UserID == UserID).Select(x => x.ML_League).ToList();
            }
        }

        internal static ML_User GetUser(int ID)
        {
            using (var db = new HoftwareEntities())
            {
                return db.ML_User.Include("ML_UserLeague").Where(x => x.ID == ID).FirstOrDefault();
            }
        }

        internal static List<ML_Game> GetGamesForLeague(int LeagueID)
        {
            using (var db = new HoftwareEntities())
            {
                return db.ML_Game.Where(x => x.LeagueID == LeagueID).ToList();
            }
        }

        internal static List<ML_UserLeague> GetUsersForLeague(int LeagueID)
        {
            using (var db = new HoftwareEntities())
            {
                return db.ML_UserLeague.Include("ML_User").Where(x => x.LeagueID == LeagueID).ToList();
            }
        }

        internal static string SaveGame(ML_Game Game)
        {
            try
            {
                using (var db = new HoftwareEntities())
                {
                    if (Game.ID == 0)
                    {
                        db.Entry(Game).State = System.Data.Entity.EntityState.Added;
                    }
                    else
                    {
                        db.Entry(Game).State = System.Data.Entity.EntityState.Modified;
                    }
                    db.SaveChanges();
                }
                return "Successfully Saved";
            }
            catch(Exception e)
            {
                return e.ToString();
            }
            
        }

        internal static string SaveUser(ML_User User)
        {
            try
            {
                using (var db = new HoftwareEntities())
                {
                    if (User.ID == 0)
                    {
                        db.Entry(User).State = System.Data.Entity.EntityState.Added;
                    }
                    else
                    {
                        db.Entry(User).State = System.Data.Entity.EntityState.Modified;
                    }
                    db.SaveChanges();
                }
                return "User successfully saved.";
            }
            catch (Exception e)
            {
                return e.ToString();
            }
        }

        internal static object SaveUserLeague(ML_UserLeague User)
        {
            try
            {
                using (var db = new HoftwareEntities())
                {
                    if (User.ID == 0)
                    {
                        db.Entry(User).State = System.Data.Entity.EntityState.Added;
                    }
                    else
                    {
                        db.Entry(User).State = System.Data.Entity.EntityState.Modified;
                    }
                    db.SaveChanges();
                }
                return "User successfully saved.";
            }
            catch (Exception e)
            {
                return e.ToString();
            }
        }

        internal static string SaveLeague(ML_League League)
        {
            try
            {
                using (var db = new HoftwareEntities())
                {
                    if (League.ID == 0)
                    {
                        db.Entry(League).State = System.Data.Entity.EntityState.Added;
                    }
                    else
                    {
                        db.Entry(League).State = System.Data.Entity.EntityState.Modified;
                    }
                    db.SaveChanges();
                }
                return "League successfully saved.";
            }
            catch(Exception e)
            {
                return e.ToString();
            }
            
        }
    }
}