import React from "react";

const Rank = ({ chatHistory }) => {
    return (
        <div>
            <div className="white f3">
                {'Chat History'}
            </div>
            <div className="white f1">
                {
                    `Chat Box Here: ${chatHistory}`
                }
            </div>
        </div>
    )
}

export default Rank;