BEGIN;

CREATE OR REPLACE FUNCTION update_session_status_to_filled()
    RETURNS TRIGGER AS
$$
BEGIN
    IF (SELECT COUNT(*) FROM sign_ups WHERE sign_ups.session_id = NEW.session_id) >=
       (get_max_players(NEW.id)) THEN
        UPDATE sessions SET status = 'FILLED' WHERE sessions.id = NEW.session_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER update_session_status_to_filled_trigger
    AFTER INSERT
    ON sign_ups
    FOR EACH ROW
EXECUTE PROCEDURE update_session_status_to_filled();


CREATE OR REPLACE FUNCTION update_session_status_to_active()
    RETURNS TRIGGER AS
$$
BEGIN
    IF (SELECT sessions.status FROM sessions WHERE sessions.id = OLD.session_id) = 'FILLED' THEN
        UPDATE sessions SET status = 'ACTIVE' WHERE sessions.id = OLD.session_id;
    END IF;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_session_status_to_active_trigger
    AFTER DELETE
    ON sign_ups
    FOR EACH ROW
EXECUTE PROCEDURE update_session_status_to_active();


CREATE OR REPLACE FUNCTION update_session_status_to_booked()
    RETURNS TRIGGER AS
$$
BEGIN
    UPDATE sessions SET status = 'BOOKED' WHERE sessions.id = NEW.session_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER update_session_status_to_booked_trigger
    AFTER INSERT
    ON bookings
    FOR EACH ROW
EXECUTE PROCEDURE update_session_status_to_booked();



CREATE OR REPLACE FUNCTION check_booking_conflict_with_signup()
    RETURNS TRIGGER AS
$$
BEGIN
    IF EXISTS (SELECT 1
               FROM sign_ups
               WHERE sign_ups.session_id = NEW.session_id)
    THEN
        RAISE EXCEPTION 'Невозможно забронировать данный сеанс, так как кто-то уже записался на него';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER check_booking_conflict_with_signup_trigger
    BEFORE INSERT
    ON bookings
    FOR EACH ROW
EXECUTE PROCEDURE check_booking_conflict_with_signup();


CREATE OR REPLACE FUNCTION check_session_booked_status_for_booking()
    RETURNS TRIGGER AS
$$
BEGIN
    IF (SELECT sessions.status FROM sessions WHERE sessions.id = NEW.session_id) = 'BOOKED' THEN
        RAISE EXCEPTION 'Невозможно забронировать данный сеанс, так как он уже забронирован';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_session_booked_status_for_booking_trigger
    BEFORE INSERT
    ON bookings
    FOR EACH ROW
EXECUTE PROCEDURE check_session_booked_status_for_booking();



CREATE OR REPLACE FUNCTION check_session_booked_status_for_signup()
    RETURNS TRIGGER AS
$$
BEGIN
    IF (SELECT sessions.status FROM sessions WHERE sessions.id = NEW.session_id) = 'BOOKED' THEN
        RAISE EXCEPTION 'Невозможно записаться на данный сеанс, так как он уже забронирован';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_session_booked_status_for_signup_trigger
    BEFORE INSERT
    ON sign_ups
    FOR EACH ROW
EXECUTE PROCEDURE check_session_booked_status_for_signup();


CREATE OR REPLACE FUNCTION check_session_filled_status_for_signup()
    RETURNS TRIGGER AS
$$
BEGIN
    IF (SELECT sessions.status FROM sessions WHERE sessions.id = NEW.session_id) = 'FILLED' THEN
        RAISE EXCEPTION 'Невозможно записаться на данный сеанс, так как он уже заполнен';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_session_filled_status_for_signup_trigger
    BEFORE INSERT
    ON sign_ups
    FOR EACH ROW
EXECUTE PROCEDURE check_session_filled_status_for_signup();



CREATE OR REPLACE FUNCTION check_session_closed_status_for_signup()
    RETURNS TRIGGER AS
$$
BEGIN
    IF (SELECT sessions.status FROM sessions WHERE sessions.id = NEW.session_id) = 'CLOSED' THEN
        RAISE EXCEPTION 'Невозможно записаться на закрытый сеанс';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_session_closed_status_for_signup_trigger
    BEFORE INSERT
    ON sign_ups
    FOR EACH ROW
EXECUTE PROCEDURE check_session_closed_status_for_signup();


CREATE OR REPLACE FUNCTION check_session_closed_status_for_booking()
    RETURNS TRIGGER AS
$$
BEGIN
    IF (SELECT sessions.status FROM sessions WHERE sessions.id = NEW.session_id) = 'CLOSED' THEN
        RAISE EXCEPTION 'Невозможно забронировать закрытый сеанс';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_session_closed_status_for_booking_trigger
    BEFORE INSERT
    ON bookings
    FOR EACH ROW
EXECUTE PROCEDURE check_session_closed_status_for_booking();


CREATE OR REPLACE FUNCTION check_session_closed_status()
    RETURNS TRIGGER AS
$$
BEGIN
    IF (OLD.status != 'CLOSED' AND NEW.status = 'CLOSED') THEN
        UPDATE companies
        SET balance = balance + (NEW.sign_up_price * get_signup_count(NEW.id))
        WHERE companies.id = (SELECT f.company_id
                              from football_fields f
                                       JOIN sessions s on f.id = s.football_field_id
                              WHERE s.id = NEW.id);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_session_closed_status_trigger
    BEFORE UPDATE
    ON sessions
    FOR EACH ROW
EXECUTE PROCEDURE check_session_closed_status();



CREATE OR REPLACE FUNCTION update_user_role_to_field_admin()
    RETURNS TRIGGER AS
$$
BEGIN
    UPDATE users SET role = 'FIELD_ADMIN' where users.id = NEW.user_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER update_user_role_to_field_admin_trigger
    BEFORE INSERT
    ON field_admins
    FOR EACH ROW
EXECUTE PROCEDURE update_user_role_to_field_admin();


CREATE OR REPLACE FUNCTION deduct_signing_up_price()
    RETURNS TRIGGER AS
$$
BEGIN
    IF (SELECT users.balance FROM users WHERE users.id = NEW.user_id) <
       (SELECT sessions.sign_up_price FROM sessions WHERE sessions.id = NEW.session_id)
    THEN
        RAISE EXCEPTION 'Недостаточно средств для записи';
    ELSE
        UPDATE users
        SET balance = balance - (SELECT sign_up_price FROM sessions WHERE sessions.id = NEW.session_id)
        WHERE users.id = NEW.user_id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER deduct_signing_up_price_trigger
    AFTER INSERT
    ON sign_ups
    FOR EACH ROW
EXECUTE PROCEDURE deduct_signing_up_price();

CREATE OR REPLACE FUNCTION deduct_booking_price()
    RETURNS TRIGGER AS
$$
BEGIN
    IF (SELECT users.balance FROM users WHERE users.id = NEW.user_id) <
       (SELECT sessions.booking_price FROM sessions WHERE sessions.id = NEW.session_id)
    THEN
        RAISE EXCEPTION 'Недостаточно средств для бронирования';
    ELSE
        UPDATE users
        SET balance = balance - (SELECT booking_price FROM sessions WHERE id = NEW.session_id)
        WHERE id = NEW.user_id;
        UPDATE companies
        SET balance = balance + (SELECT booking_price FROM sessions WHERE id = NEW.session_id)
        WHERE id = (SELECT f.company_id
                    from football_fields f
                             JOIN sessions s on f.id = s.football_field_id
                    WHERE s.id = NEW.session_id);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER deduct_booking_price_trigger
    AFTER INSERT
    ON bookings
    FOR EACH ROW
EXECUTE PROCEDURE deduct_booking_price();


CREATE OR REPLACE FUNCTION refund_signing_up_price()
    RETURNS TRIGGER AS
$$
DECLARE
    session_start_time TIMESTAMP WITH TIME ZONE;
    DECLARE deadline   TIMESTAMP WITH TIME ZONE;
BEGIN
    SELECT sessions.starts_at FROM sessions WHERE sessions.id = OLD.session_id INTO session_start_time;
    deadline := session_start_time - INTERVAL '2 hour';
    IF NOW() < deadline THEN
        UPDATE users
        SET balance = balance + (SELECT sessions.sign_up_price FROM sessions WHERE sessions.id = OLD.session_id)
        WHERE users.id = OLD.user_id;
    ELSE
        UPDATE companies
        SET balance = balance + (SELECT sessions.sign_up_price FROM sessions WHERE sessions.id = OLD.session_id)
        WHERE companies.id = (SELECT f.company_id
                              from football_fields f
                                       JOIN sessions s on f.id = s.football_field_id
                              WHERE s.id = OLD.session_id);
    END IF;

    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER refund_signing_up_price_trigger
    AFTER DELETE
    ON sign_ups
    FOR EACH ROW
EXECUTE PROCEDURE refund_signing_up_price();


CREATE OR REPLACE FUNCTION check_session_start()
    RETURNS TRIGGER AS
$$
BEGIN

    IF (EXTRACT(MIN FROM NEW.starts_at) != 0 OR EXTRACT(MILLISECONDS FROM NEW.starts_at) != 0) THEN
        RAISE EXCEPTION 'Время начала сессии должно быть целым часом';
    END IF;
    IF EXISTS (SELECT 1
               FROM sessions AS s
               WHERE s.football_field_id = NEW.football_field_id
                 AND (NEW.starts_at = s.starts_at)
                 AND s.id != NEW.id
                 AND s.status != 'CLOSED') THEN
        RAISE EXCEPTION 'Невозможно создать сеанс, так как время его начала совпадает с другим сеансом.';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER check_session_start_trigger
    BEFORE INSERT
    ON sessions
    FOR EACH ROW
EXECUTE FUNCTION check_session_start();

COMMIT;