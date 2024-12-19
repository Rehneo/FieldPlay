BEGIN;

CREATE OR REPLACE FUNCTION get_signup_count(
    session_id INTEGER
)
    RETURNS INTEGER AS
$$
BEGIN
    RETURN (SELECT COUNT(*) FROM sign_ups WHERE sign_ups.session_id = $1);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_average_rating(
    field_id INTEGER
)
    RETURNS NUMERIC AS
$$
BEGIN
    RETURN (SELECT AVG(feedbacks.rating) FROM feedbacks WHERE football_field_id = $1);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_max_players(
    session_id INTEGER
)
    RETURNS INTEGER AS
$$
BEGIN
    RETURN (SELECT football_fields.max_players
            FROM football_fields
            WHERE football_fields.id = (SELECT sessions.football_field_id
                                        FROM sessions
                                        WHERE sessions.id = $1));
END;
$$ LANGUAGE plpgsql;

COMMIT;