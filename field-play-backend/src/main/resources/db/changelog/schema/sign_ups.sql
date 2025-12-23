--liquibase formatted sql

--changeset rehneo:schema-init
CREATE TABLE sign_ups
(
    id         SERIAL PRIMARY KEY,
    user_id    INTEGER                  NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    session_id INTEGER                  NOT NULL REFERENCES sessions (id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, session_id)
);

CREATE INDEX signing_ups_user_id_idx ON sign_ups USING btree (user_id);
CREATE INDEX signing_ups_session_id_idx ON sign_ups USING btree (session_id);


CREATE OR REPLACE FUNCTION get_signup_count(
    session_id INTEGER
)
    RETURNS INTEGER AS
$_$
BEGIN
    RETURN (SELECT COUNT(*) FROM sign_ups WHERE sign_ups.session_id = $1);
END
$_$ LANGUAGE plpgsql;