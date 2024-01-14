CREATE TABLE public.chathistory (
	name varchar(100) NOT NULL,
	message text NOT NULL,
	"time" timestamp NOT NULL,
	upvotes int8 NULL DEFAULT 0,
	downvotes int8 NULL DEFAULT 0,
	CONSTRAINT chathistory_pk PRIMARY KEY (name)
);
