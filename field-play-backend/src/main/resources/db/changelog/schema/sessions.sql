--liquibase formatted sql

--changeset rehneo:schema-init
CREATE TYPE session_status AS ENUM ('ACTIVE','FILLED', 'BOOKED','CLOSED');
CREATE TABLE sessions
(
    id                SERIAL PRIMARY KEY,
    starts_at         TIMESTAMP WITH TIME ZONE NOT NULL,
    status            session_status           NOT NULL DEFAULT 'ACTIVE',
    min_players       INTEGER                  NOT NULL DEFAULT 1 CHECK (min_players > 0),
    sign_up_price     INTEGER                  NOT NULL CHECK (sign_up_price > 0),
    booking_price     INTEGER                  NOT NULL CHECK (booking_price > 0),
    football_field_id INTEGER                  NOT NULL REFERENCES football_fields (id) ON DELETE RESTRICT
);
CREATE INDEX sessions_starts_at_idx ON sessions USING btree (starts_at);
CREATE INDEX sessions_football_field_id_idx ON sessions USING btree (football_field_id);

CREATE OR REPLACE FUNCTION get_max_players(
    session_id INTEGER
)
    RETURNS INTEGER AS
$_$
BEGIN
    RETURN (SELECT football_fields.max_players
            FROM football_fields
            WHERE football_fields.id = (SELECT sessions.football_field_id
                                        FROM sessions
                                        WHERE sessions.id = $1));
END
$_$ LANGUAGE plpgsql;