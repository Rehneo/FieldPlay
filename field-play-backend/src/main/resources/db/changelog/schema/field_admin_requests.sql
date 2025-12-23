--liquibase formatted sql

--changeset rehneo:schema-init
CREATE TYPE field_admin_request_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
CREATE TABLE field_admin_requests
(
    id          SERIAL PRIMARY KEY,
    user_id     INTEGER                    NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    company_id  INTEGER                    NOT NULL REFERENCES companies (id) ON DELETE CASCADE,
    created_at  TIMESTAMP WITH TIME ZONE   NOT NULL DEFAULT NOW(),
    approved_by INTEGER REFERENCES users (id),
    approved_at TIMESTAMP WITH TIME ZONE,
    status      field_admin_request_status NOT NULL DEFAULT 'PENDING',
    UNIQUE (user_id, company_id)
);