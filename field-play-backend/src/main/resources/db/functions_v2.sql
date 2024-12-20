BEGIN;

CREATE OR REPLACE FUNCTION get_number_of_fields(
    company_id INTEGER
)
    RETURNS INTEGER AS
$$
BEGIN
    RETURN (SELECT COUNT(*) FROM football_fields WHERE football_fields.company_id = $1);
END;
$$ LANGUAGE plpgsql;

COMMIT;