--liquibase formatted sql

--changeset rehneo:schema-init
CREATE TABLE companies
(
    id       SERIAL PRIMARY KEY,
    name     VARCHAR(32) NOT NULL,
    balance  INTEGER     NOT NULL CHECK (balance >= 0) DEFAULT 0,
    owner_id INTEGER     REFERENCES users (id) ON DELETE SET NULL
);

CREATE OR REPLACE FUNCTION get_number_of_fields(
    company_id INTEGER
)
    RETURNS INTEGER AS
$_$
BEGIN
    RETURN (SELECT COUNT(*) FROM football_fields WHERE football_fields.company_id = $1);
END
$_$ LANGUAGE plpgsql;