//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace MyLeague.DataV2.Data
{
    using System;
    using System.Collections.Generic;
    
    public partial class ML_Game
    {
        public int ID { get; set; }
        public Nullable<int> LeagueID { get; set; }
        public Nullable<int> UserID { get; set; }
        public Nullable<int> OpponentID { get; set; }
        public Nullable<int> UserScore { get; set; }
        public Nullable<int> OpponentScore { get; set; }
        public Nullable<System.DateTime> CreatedOn { get; set; }
    
        public virtual ML_League ML_League { get; set; }
        public virtual ML_User ML_User { get; set; }
        public virtual ML_User ML_User1 { get; set; }
    }
}