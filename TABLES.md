// Create Playlist

CREATE TABLE IF NOT EXISTS playlist (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  image TEXT,
  userId UUID NOT NULL,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
)

// Create Songs

CREATE TABLE IF NOT EXISTS songs (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  artist VARCHAR(255) NOT NULL,
  featurings TEXT,
  userid UUID NOT NULL,
  imageurl TEXT,
  trackurl TEXT,
  playlistid UUID,
  FOREIGN KEY (userid) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (playlistid) REFERENCES playlists(id) ON DELETE CASCADE
)

// Create Users

CREATE TABLE IF NOT EXISTS users {
  id: UUID PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  image VARCHAR(100) NOT NULL
}