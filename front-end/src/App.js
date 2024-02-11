import React, { Component } from 'react';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ChatWindow from './components/ChatWindow/ChatWindow';
import Greeting from './components/Greeting/Greeting';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import './App.css';
import socketIO from 'socket.io-client';
const socket = socketIO.connect('http://localhost:4000');


class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      route: 'signin',
      isSignedIn: false,
      chatHistory: [],
      user: {
        name: '',
        entries: 0,
        joined: ''
      }
    }
  }

  componentDidMount() {
    fetch('http://localhost:4000/chathistory', {
          method: 'get',
          // headers: {'Content-Type': 'application/json'},
        })
      .then(response => response.json())
      .then(chatHistory => {
        const chatHistorySorted = chatHistory.sort((a, b) => {
          // Sort the array of messages (in json) by the message's time
          const timeA = new Date(a.time);
          const timeB = new Date(b.time);
          return timeA - timeB;
        });
        const result = chatHistorySorted.map(({name, message, time, message_id, upvotes, downvotes}) => ({name, message, time, message_id, upvotes, downvotes}));
        console.log(chatHistory, chatHistorySorted, result);
        this.setState({chatHistory: result});
      })
      .catch(err => console.log('Error fetching chat history:', err));
  }  

  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      entries: data.entries,
      joined: data.joined
      }
    })
  }

  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState({isSignedIn: false})
    } else if (route === 'home') {
      this.setState({isSignedIn: true})
    }
    this.setState({route: route});
  }

  render() {
    const { isSignedIn, route } = this.state;
    return (
      <div className="App" >
        <Navigation isSignedin={isSignedIn} onRouteChange={this.onRouteChange}/>
        <Logo />
        { route === 'home'
          ? <div style={{ marginLeft: 'auto' }}>
          <Greeting 
            name={this.state.user.name}
          />
          <ChatWindow
            socket={socket}
            onRouteChange={this.onRouteChange}
            username={this.state.user.name}
            chatHistory={this.state.chatHistory}
          />
        </div>
          : (
            route === 'signin'
            ? <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
            : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
          )
          
        }
      </div>
    );
  }
  
}

export default App;
