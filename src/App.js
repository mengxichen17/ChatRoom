import React, { Component } from 'react';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ChatWindow from './components/ChatWindow/ChatWindow';
import Greeting from './components/Greeting/Greeting';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import './App.css';

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

  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      entries: data.entries,
      joined: data.joined
      }
    })
  }

  loadHistory = () => {
    fetch('http://localhost:3000/chathistory', {
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
              // console.log(chatHistory);              
              this.setState({chatHistory: chatHistorySorted})
            })
            .catch(console.log)
  }

  onButtonUpvote = (message_id) => {
    fetch('http://localhost:3000/chathistory/upvote', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              id: message_id
            })
          })
    
  }

  onButtonDownvote = (message_id) => {
    fetch('http://localhost:3000/chathistory/downvote', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              id: message_id
            })
          })
  }

  // componentDidMount() {
  //   fetch('http://localhost:3000/')
  //     .then(response => response.json())
  //     .then(console.log)
  // }

  onInputChange = (event) => {
    console.log(event.target.value);
  }

  onButtonSubmit = () => {
    // Receive the sent message
    
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
      <div className="App">
        <Navigation isSignedin={isSignedIn} onRouteChange={this.onRouteChange}/>
        <Logo />
        { route === 'home'
          ? <div>
          <Greeting 
            name={this.state.user.name}
          />
          <ChatWindow
            chatHistory={this.state.chatHistory}
            onInputChange={this.onInputChange} 
            onButtonSubmit={this.onButtonSubmit}
            onButtonUpvote={this.onButtonUpvote}
            onButtonDownvote={this.onButtonDownvote}
          />
          <FaceRecognition />
        </div>
          : (
            route === 'signin'
            ? <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange} loadHistory={this.loadHistory}/>
            : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} loadHistory={this.loadHistory}/>
          )
          
        }
      </div>
    );
  }
  
}

export default App;
