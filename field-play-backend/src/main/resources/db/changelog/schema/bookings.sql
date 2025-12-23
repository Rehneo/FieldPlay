--liquibase formatted sql

--changeset rehneo:schema-init
CREATE TABLE bookings
(
    id         SERIAL PRIMARY KEY,
    user_id    INTEGER                  NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    session_id INTEGER                  NOT NULL UNIQUE REFERENCES sessions (id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
CREATE INDEX bookings_user_id_idx ON bookings USING btree (user_id);
CREATE INDEX bookings_session_id_idx ON bookings USING btree (session_id);