CREATE TABLE users (
	id 					VARCHAR(50) PRIMARY KEY,
	name 				VARCHAR(50),
	email 			VARCHAR(100),
	password 		VARCHAR(100)
);

CREATE TABLE transactions (
	id					VARCHAR(50) PRIMARY KEY,
	user_id			VARCHAR(50) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
	description VARCHAR(50),
	value				FLOAT
);