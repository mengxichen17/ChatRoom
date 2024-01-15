CREATE TABLE public.users (
	id serial4 NOT NULL,
	"name" varchar(100) NOT NULL,
	entries int8 NULL DEFAULT 0,
	joined timestamp NOT NULL,
	CONSTRAINT users_name_key UNIQUE (name),
	CONSTRAINT users_pkey PRIMARY KEY (id)
);

CREATE TABLE public.login (
	id serial4 NOT NULL,
	hash varchar(100) NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT login_name_key UNIQUE (name),
	CONSTRAINT login_pkey PRIMARY KEY (id)
);

CREATE TABLE public.chathistory (
	"name" varchar(100) NOT NULL,
	message text NOT NULL,
	"time" timestamptz NOT NULL,
	upvotes int8 NULL DEFAULT 0,
	downvotes int8 NULL DEFAULT 0,
	id serial4 NOT NULL,
	message_id varchar(100) NOT NULL
);
