BEGIN;

CREATE TYPE football_field_type AS ENUM ('OUTDOOR', 'INDOOR');
CREATE TYPE surface_type AS ENUM ('NATURAL', 'ARTIFICIAL', 'PARQUET', 'LINOLEUM');
CREATE TYPE user_role AS ENUM ('USER', 'FIELD_ADMIN', 'ADMIN');
CREATE TYPE session_status AS ENUM ('ACTIVE','FILLED', 'BOOKED','CLOSED');
CREATE TYPE field_admin_request_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED');


CREATE TABLE users
(
    id         SERIAL PRIMARY KEY,
    firstname  VARCHAR(32)  NOT NULL,
    lastname   VARCHAR(32)  NOT NULL,
    birth_date DATE         NOT NULL,
    balance    INTEGER      NOT NULL CHECK (balance >= 0) DEFAULT 0,
    username   VARCHAR(128) NOT NULL UNIQUE,
    password   VARCHAR(128) NOT NULL,
    role       user_role    NOT NULL                      DEFAULT 'USER'
);

CREATE TABLE companies
(
    id       SERIAL PRIMARY KEY,
    name     VARCHAR(32) NOT NULL,
    balance  INTEGER     NOT NULL CHECK (balance >= 0) DEFAULT 0,
    owner_id INTEGER     REFERENCES users (id) ON DELETE SET NULL
);


CREATE TABLE field_admins
(
    id         SERIAL PRIMARY KEY,
    user_id    INTEGER NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    company_id INTEGER NOT NULL REFERENCES companies (id) ON DELETE CASCADE
);

CREATE TABLE cities
(
    id   SERIAL PRIMARY KEY,
    name VARCHAR(32) UNIQUE NOT NULL
);


CREATE TABLE metro_stations
(
    id      SERIAL PRIMARY KEY,
    name    VARCHAR(32) UNIQUE NOT NULL,
    city_id INTEGER            NOT NULL REFERENCES cities (id)
);

CREATE TABLE football_fields
(
    id            SERIAL PRIMARY KEY,
    name          VARCHAR(32)         NOT NULL,
    city_id       INTEGER             NOT NULL REFERENCES cities (id),
    address       VARCHAR(64)         NOT NULL,
    type          football_field_type NOT NULL,
    surface_type  surface_type        NOT NULL,
    max_players   INTEGER             NOT NULL CHECK (max_players > 0) DEFAULT 20,
    length        FLOAT               NOT NULL CHECK (length > 0 ),
    width         FLOAT               NOT NULL CHECK (width > 0),
    height        FLOAT CHECK (height > 0),
    locker_room   BOOLEAN             NOT NULL,
    stands        BOOLEAN             NOT NULL,
    shower        BOOLEAN             NOT NULL,
    lighting      BOOLEAN             NOT NULL,
    parking_space BOOLEAN             NOT NULL,
    company_id    INTEGER             NOT NULL REFERENCES companies (id) ON DELETE CASCADE
);

CREATE TABLE football_fields_metro_stations
(
    id                SERIAL PRIMARY KEY,
    football_field_id INTEGER REFERENCES football_fields (id) ON DELETE CASCADE,
    metro_station_id  INTEGER REFERENCES metro_stations (id) ON DELETE CASCADE
);

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

CREATE TABLE sign_ups
(
    id         SERIAL PRIMARY KEY,
    user_id    INTEGER                  NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    session_id INTEGER                  NOT NULL REFERENCES sessions (id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, session_id)
);

CREATE TABLE bookings
(
    id         SERIAL PRIMARY KEY,
    user_id    INTEGER                  NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    session_id INTEGER                  NOT NULL UNIQUE REFERENCES sessions (id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);


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

CREATE TABLE blacklists
(
    id         SERIAL PRIMARY KEY,
    user_id    INTEGER                  NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    company_id INTEGER                  NOT NULL REFERENCES companies (id) ON DELETE CASCADE,
    reason     TEXT                     NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, company_id)
);

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

COMMIT;



