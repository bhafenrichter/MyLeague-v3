
-- --------------------------------------------------
-- Entity Designer DDL Script for SQL Server 2005, 2008, 2012 and Azure
-- --------------------------------------------------
-- Date Created: 06/18/2016 13:01:53
-- Generated from EDMX file: C:\Users\Haf\Documents\Visual Studio 2015\Projects\MyLeague\MyLeague.Data\MyLeagueModel.edmx
-- --------------------------------------------------

SET QUOTED_IDENTIFIER OFF;
GO
USE [MyLeagues];
GO
IF SCHEMA_ID(N'dbo') IS NULL EXECUTE(N'CREATE SCHEMA [dbo]');
GO

-- --------------------------------------------------
-- Dropping existing FOREIGN KEY constraints
-- --------------------------------------------------

IF OBJECT_ID(N'[dbo].[FK_Game_User]', 'F') IS NOT NULL
    ALTER TABLE [dbo].[Game] DROP CONSTRAINT [FK_Game_User];
GO
IF OBJECT_ID(N'[dbo].[FK_Game_User1]', 'F') IS NOT NULL
    ALTER TABLE [dbo].[Game] DROP CONSTRAINT [FK_Game_User1];
GO
IF OBJECT_ID(N'[dbo].[FK_UserLeague_League]', 'F') IS NOT NULL
    ALTER TABLE [dbo].[UserLeague] DROP CONSTRAINT [FK_UserLeague_League];
GO
IF OBJECT_ID(N'[dbo].[FK_UserLeague_User]', 'F') IS NOT NULL
    ALTER TABLE [dbo].[UserLeague] DROP CONSTRAINT [FK_UserLeague_User];
GO

-- --------------------------------------------------
-- Dropping existing tables
-- --------------------------------------------------

IF OBJECT_ID(N'[dbo].[Game]', 'U') IS NOT NULL
    DROP TABLE [dbo].[Game];
GO
IF OBJECT_ID(N'[dbo].[League]', 'U') IS NOT NULL
    DROP TABLE [dbo].[League];
GO
IF OBJECT_ID(N'[dbo].[LeagueRequest]', 'U') IS NOT NULL
    DROP TABLE [dbo].[LeagueRequest];
GO
IF OBJECT_ID(N'[dbo].[User]', 'U') IS NOT NULL
    DROP TABLE [dbo].[User];
GO
IF OBJECT_ID(N'[dbo].[UserLeague]', 'U') IS NOT NULL
    DROP TABLE [dbo].[UserLeague];
GO

-- --------------------------------------------------
-- Creating all tables
-- --------------------------------------------------

-- Creating table 'Games'
CREATE TABLE [dbo].[Games] (
    [ID] int IDENTITY(1,1) NOT NULL,
    [UserID] int  NOT NULL,
    [OpponentID] int  NOT NULL,
    [UserScore] float  NOT NULL,
    [OpponentScore] float  NOT NULL,
    [Latitude] float  NULL,
    [Longitude] float  NULL
);
GO

-- Creating table 'Leagues'
CREATE TABLE [dbo].[Leagues] (
    [ID] int IDENTITY(1,1) NOT NULL,
    [LeagueName] nvarchar(100)  NOT NULL,
    [LeagueType] nvarchar(200)  NULL,
    [CreatedOn] datetime  NOT NULL,
    [IsDeleted] bit  NOT NULL
);
GO

-- Creating table 'LeagueRequests'
CREATE TABLE [dbo].[LeagueRequests] (
    [ID] int IDENTITY(1,1) NOT NULL,
    [UserID] int  NOT NULL,
    [InviteeID] int  NOT NULL,
    [LeagueID] int  NOT NULL,
    [Message] nvarchar(500)  NULL,
    [CreatedOn] datetime  NULL,
    [IsDecided] bit  NULL
);
GO

-- Creating table 'Users'
CREATE TABLE [dbo].[Users] (
    [ID] int  NOT NULL,
    [FirstName] nvarchar(50)  NULL,
    [LastName] nvarchar(50)  NULL,
    [Email] nvarchar(100)  NULL,
    [Password] nvarchar(100)  NULL,
    [Salt] nvarchar(100)  NULL,
    [CreatedOn] datetime  NULL
);
GO

-- Creating table 'UserLeagues'
CREATE TABLE [dbo].[UserLeagues] (
    [ID] int IDENTITY(1,1) NOT NULL,
    [UserID] int  NOT NULL,
    [LeagueID] int  NOT NULL,
    [Wins] int  NULL,
    [Losses] int  NULL,
    [PointsScored] float  NULL,
    [PointsAllowed] float  NULL,
    [IsDeleted] bit  NULL,
    [CreatedOn] datetime  NULL
);
GO

-- --------------------------------------------------
-- Creating all PRIMARY KEY constraints
-- --------------------------------------------------

-- Creating primary key on [ID] in table 'Games'
ALTER TABLE [dbo].[Games]
ADD CONSTRAINT [PK_Games]
    PRIMARY KEY CLUSTERED ([ID] ASC);
GO

-- Creating primary key on [ID] in table 'Leagues'
ALTER TABLE [dbo].[Leagues]
ADD CONSTRAINT [PK_Leagues]
    PRIMARY KEY CLUSTERED ([ID] ASC);
GO

-- Creating primary key on [ID] in table 'LeagueRequests'
ALTER TABLE [dbo].[LeagueRequests]
ADD CONSTRAINT [PK_LeagueRequests]
    PRIMARY KEY CLUSTERED ([ID] ASC);
GO

-- Creating primary key on [ID] in table 'Users'
ALTER TABLE [dbo].[Users]
ADD CONSTRAINT [PK_Users]
    PRIMARY KEY CLUSTERED ([ID] ASC);
GO

-- Creating primary key on [ID] in table 'UserLeagues'
ALTER TABLE [dbo].[UserLeagues]
ADD CONSTRAINT [PK_UserLeagues]
    PRIMARY KEY CLUSTERED ([ID] ASC);
GO

-- --------------------------------------------------
-- Creating all FOREIGN KEY constraints
-- --------------------------------------------------

-- Creating foreign key on [UserID] in table 'Games'
ALTER TABLE [dbo].[Games]
ADD CONSTRAINT [FK_Game_User]
    FOREIGN KEY ([UserID])
    REFERENCES [dbo].[Users]
        ([ID])
    ON DELETE NO ACTION ON UPDATE NO ACTION;
GO

-- Creating non-clustered index for FOREIGN KEY 'FK_Game_User'
CREATE INDEX [IX_FK_Game_User]
ON [dbo].[Games]
    ([UserID]);
GO

-- Creating foreign key on [OpponentID] in table 'Games'
ALTER TABLE [dbo].[Games]
ADD CONSTRAINT [FK_Game_User1]
    FOREIGN KEY ([OpponentID])
    REFERENCES [dbo].[Users]
        ([ID])
    ON DELETE NO ACTION ON UPDATE NO ACTION;
GO

-- Creating non-clustered index for FOREIGN KEY 'FK_Game_User1'
CREATE INDEX [IX_FK_Game_User1]
ON [dbo].[Games]
    ([OpponentID]);
GO

-- Creating foreign key on [LeagueID] in table 'UserLeagues'
ALTER TABLE [dbo].[UserLeagues]
ADD CONSTRAINT [FK_UserLeague_League]
    FOREIGN KEY ([LeagueID])
    REFERENCES [dbo].[Leagues]
        ([ID])
    ON DELETE NO ACTION ON UPDATE NO ACTION;
GO

-- Creating non-clustered index for FOREIGN KEY 'FK_UserLeague_League'
CREATE INDEX [IX_FK_UserLeague_League]
ON [dbo].[UserLeagues]
    ([LeagueID]);
GO

-- Creating foreign key on [UserID] in table 'UserLeagues'
ALTER TABLE [dbo].[UserLeagues]
ADD CONSTRAINT [FK_UserLeague_User]
    FOREIGN KEY ([UserID])
    REFERENCES [dbo].[Users]
        ([ID])
    ON DELETE NO ACTION ON UPDATE NO ACTION;
GO

-- Creating non-clustered index for FOREIGN KEY 'FK_UserLeague_User'
CREATE INDEX [IX_FK_UserLeague_User]
ON [dbo].[UserLeagues]
    ([UserID]);
GO

-- Creating foreign key on [UserID] in table 'Games'
ALTER TABLE [dbo].[Games]
ADD CONSTRAINT [FK_Game_User2]
    FOREIGN KEY ([UserID])
    REFERENCES [dbo].[UserLeagues]
        ([ID])
    ON DELETE NO ACTION ON UPDATE NO ACTION;
GO

-- Creating non-clustered index for FOREIGN KEY 'FK_Game_User2'
CREATE INDEX [IX_FK_Game_User2]
ON [dbo].[Games]
    ([UserID]);
GO

-- Creating foreign key on [OpponentID] in table 'Games'
ALTER TABLE [dbo].[Games]
ADD CONSTRAINT [FK_Game_User11]
    FOREIGN KEY ([OpponentID])
    REFERENCES [dbo].[UserLeagues]
        ([ID])
    ON DELETE NO ACTION ON UPDATE NO ACTION;
GO

-- Creating non-clustered index for FOREIGN KEY 'FK_Game_User11'
CREATE INDEX [IX_FK_Game_User11]
ON [dbo].[Games]
    ([OpponentID]);
GO

-- --------------------------------------------------
-- Script has ended
-- --------------------------------------------------