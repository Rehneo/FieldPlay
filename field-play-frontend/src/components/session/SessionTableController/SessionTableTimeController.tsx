import {DateTime} from "luxon";
import React from "react";
import {DAYS_IN_WEEK} from "../../../config/constants.tsx";
import arrowLeftIcon from "../../../assets/arrow-left.svg";
import arrowRightIcon from "../../../assets/arrow-right.svg";

interface SessionTableTimeControllerProps {
    startTime: DateTime;
    setStartTime: (startTime: DateTime) => void;
}

const SessionTableWeekController: React.FC<SessionTableTimeControllerProps> = ({startTime, setStartTime}) => {
    return <div className="session-table-week-container">
        <div className="session-table-left-button">
            {!startTime.hasSame(DateTime.now(), 'day')
                ? <button className="filter-button"
                          onClick={() => setStartTime(startTime.minus({weeks: 1}))}>
                    <img src={arrowLeftIcon} className="filter-icon" alt="Arrow Left Icon"/>
                </button>
                : ''
            }
        </div>
        {Array.from({length: DAYS_IN_WEEK}, (_, day) => (
            <div key={day} className="session-table-day-container">
                {startTime.plus({days: day}).setLocale("ru").toFormat("d LLL '\n' ccc")}
            </div>
        ))}
        <div className="session-table-right-button">
            <button className="filter-button"
                    onClick={() => setStartTime(startTime.plus({weeks: 1}))}>
                <img src={arrowRightIcon} className="filter-icon" alt="Arrow Right Icon"/>
            </button>
        </div>
    </div>
}

export default SessionTableWeekController;