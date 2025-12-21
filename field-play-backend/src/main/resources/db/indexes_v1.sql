BEGIN;

CREATE INDEX sessions_starts_at_idx ON sessions USING btree (starts_at);
CREATE INDEX sessions_football_field_id_idx ON sessions USING hash (football_field_id);


CREATE INDEX bookings_user_id_idx ON bookings USING hash (user_id);
CREATE INDEX bookings_session_id_idx ON bookings USING hash (session_id);

CREATE INDEX signing_ups_user_id_idx ON sign_ups USING hash (user_id);
CREATE INDEX signing_ups_session_id_idx ON sign_ups USING hash (session_id);


CREATE INDEX feedbacks_football_field_id_idx ON feedbacks USING HASH (football_field_id);


CREATE INDEX blacklists_user_id_idx ON blacklists USING HASH (user_id);
CREATE INDEX blacklists_football_field_id_idx ON blacklists USING HASH (company_id);

COMMIT;