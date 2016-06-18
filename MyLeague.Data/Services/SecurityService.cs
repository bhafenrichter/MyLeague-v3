using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Web;

namespace MyLeague.Data.Services
{
    public class SecurityService
    {

        public static User Login(string email, string password)
        {
            using (var db = new MyLeaguesEntities())
            {
                var unverifiedUser = db.Users.Where(x => x.Email == email).FirstOrDefault();
                if(unverifiedUser == null) { return null; }

                string salt = db.Users.Where(x => x.Email == email).FirstOrDefault().Salt;
                if (salt == "") { return null; }
                db.Configuration.LazyLoadingEnabled = false;
                string hash = sha256_hash(password + salt);
                User user = db.Users
                    .Include("UserLeagues")
                    .Where(x => x.Email == email && x.Password == hash)
                    .FirstOrDefault();
                return user;
            }
            
        }

        public static User CreateAccount(User user)
        {
            using (var db = new MyLeaguesEntities())
            {
                user.Salt = GetRandomSalt(20);
                user.Password = sha256_hash(user.Password + user.Salt);
                db.Users.Add(user);
                db.SaveChanges();
                return db.Users.Where(x => x.Email == user.Email).FirstOrDefault();
            }
        }

        public static string GetRandomSalt(Int32 size = 12)
        {
            var random = new RNGCryptoServiceProvider();
            var salt = new Byte[size];
            random.GetBytes(salt);
            return Convert.ToBase64String(salt);
        }

        private static String sha256_hash(String value)
        {
            using (SHA256 hash = SHA256Managed.Create())
            {
                return String.Join("", hash
                  .ComputeHash(Encoding.UTF8.GetBytes(value))
                  .Select(item => item.ToString("x2")));
            }
        }
    }

    
}