CREATE TABLE users (
	id 					VARCHAR(50) PRIMARY KEY,
	name 				VARCHAR(50),
	email 			VARCHAR(100),
	password 		VARCHAR(100),
	balance			FLOAT DEFAULT 0
);

CREATE TABLE transactions (
	id						VARCHAR(50) PRIMARY KEY,
	user_id				VARCHAR(50) NOT NULL
														REFERENCES users(id) 
														ON UPDATE CASCADE 
														ON DELETE CASCADE,
	description 	VARCHAR(50),
	value					FLOAT NOT NULL,
	created_at 		TIMESTAMP NOT NULL DEFAULT NOW(),
	processed_at 	TIMESTAMP
);

-- Query processing time for version 3
-- SELECT AVG(EXTRACT(EPOCH FROM (processed_at - created_at))) AS difference FROM transactions;