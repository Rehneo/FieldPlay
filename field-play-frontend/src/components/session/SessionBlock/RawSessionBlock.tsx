import "./SessionBlock.css"

const RawSessionBlock = () => {

    return <div className="session-block raw-session-block">
        <label className="sign-up-count-label">Количество мест</label>
        <div className="sign-up-count-container">
            <span>0</span>
            <span>/</span>
            <span>0</span>
        </div>
        <hr className="session-block-divider"/>
        <div className="flex flex-row gap-2 self-center">
            <div className="sign-up-container">
                <button disabled={true} className="sign-up-button">
                    <div>
                        Запись
                    </div>
                    <div className="font-semibold">
                        500 р.
                    </div>
                </button>
            </div>
            <div className="book-container">
                <button disabled={true} className="sign-up-button">
                    <div>
                        Брон.
                    </div>
                    <div className="font-semibold">
                        3500 р.
                    </div>
                </button>
            </div>
        </div>
    </div>
}

export default RawSessionBlock;