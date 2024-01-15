import React, { useEffect, useState, useRef }  from 'react';

const Message = ({message, username, socket}) => {
    console.log("The data type of votes: ", typeof(message.upvotes), typeof(message.downvotes));
    const [currUpvotes, setCurrUpvotes] = useState(parseInt(message.upvotes));
    const [currDownvotes, setCurrDownvotes] = useState(parseInt(message.downvotes));
    console.log("current upvotes: ", currUpvotes, " current downvotes: ", currDownvotes);

    useEffect(() => {
        socket.on('message_upvote_updated', (data) => {
            console.log("received signal that one message upvoted: ", data);
            console.log("voted by: ", data.sender, " username: ", username);
            if (data.sender !== username && data.message_id === message.message_id) {
                // only need to update when it's voted by other senders
                setCurrUpvotes(currUpvotes + 1);
                message.upvotes = currUpvotes.toString();
            // console.log("after message_upvote_updated: ", messages)
            }
        });
    }, [socket, currUpvotes, username]);

    useEffect(() => {
        socket.on('message_downvote_updated', (data) => {
            console.log("received signal that one message downvoted: ", data);
            console.log("voted by: ", data.sender, " username: ", username);
            if (data.sender !== username && data.message_id === message.message_id) {
                // only need to update when it's voted by other senders
                setCurrDownvotes(currDownvotes + 1);
                message.downvotes = currDownvotes.toString();
            // console.log("after message_upvote_updated: ", messages)
            }
        });
    }, [socket, currDownvotes, username]);

    const formatTime = (time) => {
        let date = time.split(/[T.]+/g);
        date = date.slice(0, -1);
        return date.join(' ');
    }
    
    const handleUpvote = (e) => {
        e.preventDefault();
        // if (message.trim() && localStorage.getItem('userName')) {
        if (message.message_id) {
            socket.emit('message_upvote', {
              message_id: message.message_id,
              sender: username
            });
        }
        setCurrUpvotes(currUpvotes + 1);
        message.upvotes = currUpvotes.toString();
    }

    const handleDownvote = (e) => {
        e.preventDefault();
        if (message.message_id) {
            socket.emit('message_downvote', {
                message_id: message.message_id,
                sender: username
            })
        }
        setCurrDownvotes(currDownvotes + 1);
        message.downvotes = currDownvotes.toString();
    }

    return (
        message.name === username ? (
            <div className="message__chats" key={message.id}>
                <p className="sender__name">{`You ${formatTime(message.time)}`}</p>
                <div className="message__sender">
                    <p>{message.message}</p>
                    <div className="vote__buttons pointer inline-flex right">
                        <button className="vote__button" onClick={handleUpvote}> &#8679; (<a>{currUpvotes}</a>)</button> 
                        <button className="vote__button" onClick={handleDownvote}> &#8681; (<a>{currDownvotes}</a>)</button>
                    </div>
                </div>
            </div>
            
        ) : (
            <div className="message__chats" key={message.id}>
                <p className="sender__other_name">{`${message.name} ${formatTime(message.time)}`}</p>
                <div className="message__recipient">
                    <p>{message.message}</p>
                    <div className="vote__buttons pointer inline-flex left">
                        <button className="vote__other_button" onClick={handleUpvote}> &#8679; (<a>{currUpvotes}</a>)</button> 
                        <button className="vote__other_button" onClick={handleDownvote}> &#8681; (<a>{currDownvotes}</a>)</button>
                    </div>
                </div>
            </div>
        )
    )
};

export default Message;