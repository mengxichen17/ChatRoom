import React from "react";

const Greeting = ({ name }) => {
    return (
        <div>
            <div className="white f3" style={{display: 'flex', justifyContent: 'center'}}>
                {`Hello ${name}, Welcome to Nimble Chat Room!`}
            </div>
            
        </div>
    )
}

export default Greeting;