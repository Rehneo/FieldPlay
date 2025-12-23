--liquibase formatted sql

--changeset rehneo:schema-init-1
CREATE TABLE blacklists
(
    id         SERIAL PRIMARY KEY,
    user_id    INTEGER                  NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    company_id INTEGER                  NOT NULL REFERENCES companies (id) ON DELETE CASCADE,
    reason     TEXT                     NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, company_id)
);
CREATE INDEX blacklists_user_id_idx ON blacklists USING btree (user_id);
CREATE INDEX blacklists_football_field_id_idx ON blacklists USING btree (company_id);