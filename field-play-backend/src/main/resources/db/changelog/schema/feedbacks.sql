--liquibase formatted sql

--changeset rehneo:schema-init
CREATE TABLE feedbacks
(
    id                SERIAL PRIMARY KEY,
    user_id           INTEGER                  REFERENCES users (id) ON DELETE SET NULL,
    football_field_id INTEGER                  NOT NULL REFERENCES football_fields (id) ON DELETE CASCADE,
    message           TEXT                     NOT NULL,
    rating            INTEGER                  NOT NULL CHECK (rating > 0 AND rating < 6) DEFAULT 5,
    created_at        TIMESTAMP WITH TIME ZONE NOT NULL                                   DEFAULT now(),
    UNIQUE (user_id, football_field_id)
);
CREATE INDEX feedbacks_football_field_id_idx ON feedbacks USING btree (football_field_id);

CREATE OR REPLACE FUNCTION get_average_rating(
    field_id INTEGER
)
    RETURNS NUMERIC AS
$_$
BEGIN
    RETURN (SELECT AVG(feedbacks.rating) FROM feedbacks WHERE football_field_id = $1);
END
$_$ LANGUAGE plpgsql;