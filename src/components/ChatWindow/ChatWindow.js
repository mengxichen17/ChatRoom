import React from "react";
import './ChatWindow.css';
import 'react-chat-elements/dist/main.css'
import { MessageBox } from "react-chat-elements";
import { Button } from "react-chat-elements";


//chat-history table: name, message, time, upvote, downvote

const ChatWindow = ({ chatHistory, onInputChange, onButtonSubmit, onButtonUpvote, onButtonDownvote}) =>  {

    
        return (
                // <MessageBox
                // position='left'
                // title={chatHistory[0].name}
                // type='text'
                // text={chatHistory[0].message}
                // date={chatHistory[0].time}
                // replyButton={true}
                // />
                <div>
                    {chatHistory.map((chatItem, index) => (
                        <div className="f3 left container" style={{ display: 'flex', alignItems: 'center', width: '1000px', margin: '0 auto'}}>
                            <MessageBox
                                position='left'
                                title={chatItem.name}
                                type='text'
                                text={chatItem.message}
                                date={chatItem.time}
                            />
                            <Button className='w-5' text={`Upvote (${chatItem.upvotes})`} onClick={onButtonUpvote(chatItem.id)} title="Upvote" float="right" style={{ marginLeft: '20px' }}/>
                            <Button className='w-5' text={`Downvote (${chatItem.downvotes})`} onClick={onButtonDownvote(chatItem.id)} title="Downvote" style={{ marginLeft: '20px' }}/>
                        </div> 
                    ))}

                    <div className='center'>
                        <div className='form center pa4 br3 shadow-5'>
                        <input className='f4 pa2 w-70 center' type='tex' onChange={onInputChange}/>
                        <button
                            className='w-30 grow f4 link ph3 pv2 dib white bg-light-purple'
                            onClick={onButtonSubmit}
                        >Send</button>
                        </div>
                    </div>
                </div>
            
            // <div>
            //     <div>
            //         <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
            //         <title>Chat Window</title>
            //             {chatHistory}
            //     </div>
                
            //     <div>
            //         <ul id="messages"></ul>
            //         <div id="form" action="">
            //         <input 
            //             id="input" 
            //             autocomplete="off" 
            //             value="Type Message Here"
            //             onChange={onInputChange}
            //         />
            //         {/* <input 
            //                 onClick={this.onButtonSend}
            //                 className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" 
            //                 type="submit" 
            //                 value="Send"
            //         /> */}
            //         <button
            //             className='w-10 grow f6 link ph3 pv2 dib white bg-light-purple'
            //             onClick={onButtonSubmit}
            //         >Send</button>
            //         </div>
            //     </div>
            // </div>
        );
    
    
}

export default ChatWindow;