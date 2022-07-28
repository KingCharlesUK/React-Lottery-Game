import { Component } from 'react';

interface rewardsType {
  matches: number;
  rewardedPoints: number;
}

class App extends Component<any, any> {
  constructor(props: any) {
    super(props);
    // initialize the state of the app
    this.state = {
      ballsPicked: false,
      randomDrawnBalls: [],
      playerBalls: [],
      playerEnteredBall: '',
      playerPoints: 0,
      message: ''
    };
  }

  // rewards and the amount of matches needed to win
  rewards: Array<rewardsType> = [
    { matches: 3, rewardedPoints: 50 },
    { matches: 4, rewardedPoints: 100 },
    { matches: 5, rewardedPoints: 200 },
    { matches: 6, rewardedPoints: 500 }
  ];

  // generate balls to match against, and for lucky dip picks
  generateRandomBalls = (type: string) => {
    let balls: any[] = [];
    for (let i = 0; i < 6; i++) {
      let randomNumber = Math.floor(Math.random() * (59 - 1 + 1)) + 1;
      // check if the number is already in the array, if so, generate a new number
      while (balls.includes(randomNumber)) {
        if (balls.includes(randomNumber)) randomNumber = Math.floor(Math.random() * (59 - 1 + 1)) + 1;
        else break;
      }
      balls = [...balls, randomNumber];
    }
    // type deferred to determine if the balls are for the start or lucky dip
    switch(type) {
      case 'start':
        this.setState({ randomDrawnBalls: balls });
        this.checkBalls();
        break;
      case 'lucky':
        this.setState({ ballsPicked: true, playerBalls: balls });
    }
  }

  // check if the balls are matching, and give the player points if they are
  checkBalls = () => {
    let playerBalls = this.state.playerBalls;
    let randomDrawnBalls = this.state.randomDrawnBalls;
    let playerPoints = this.state.playerPoints;
    let message = '';
    let matches = 0;
    let rewardedPoints = 0;

    // check if the player has picked the correct amount of balls
    if (playerBalls.length !== 6) {
      message = 'You must pick 6 balls.';
    } else {
      // check if the player has picked the correct balls
      for (let i = 0; i < randomDrawnBalls.length; i++) {
        if (playerBalls.includes(randomDrawnBalls[i])) {
          matches++;
        }
      }
      
      if (matches >= 3) {
        for (let reward of this.rewards) {
          if (matches === reward.matches) {
            rewardedPoints = reward.rewardedPoints;
          }
        }
        message = 'You won the lottery! You received ' + rewardedPoints + ' points.';
      } else {
        message = 'You lost the lottery :( Maybe try again?';
      }
    }
    // update the state of the app
    this.setState({
      playerPoints: playerPoints + rewardedPoints,
      message: message
    });
  }

  // manual input for the balls
  addBall = (ball: number) => {
    // check if ball already exists in the array
    if (this.state.playerBalls.includes(ball)) {
      this.setState({ message: 'Ball already picked' });
      return;
    }

    // check if the ball is in the range of 1-59
    if (ball < 1 || ball > 59) {
      this.setState({ message: 'Ball is not between 1-59' });
      return;
    }

    // check if the array is < 6, if so, add the ball 
    if (this.state.playerBalls.length < 6) {
      this.setState({ playerBalls: [...this.state.playerBalls, ball] });
    } else {
      this.setState({ message: 'You have already picked 6 balls' });
    }
  }

  render() {
    return (
      <div className="App">
        <button onClick={() => this.generateRandomBalls('start')}>Start Game</button>
        <button onClick={() => this.generateRandomBalls('lucky')}>Lucky Dip</button><br></br>
        <input type="text" onChange={(e) => this.setState({ playerEnteredBall: e.target.value })}></input>
        <button onClick={() => this.addBall(this.state.playerEnteredBall)}>Submit Ball</button><br></br>
        {this.state.message && <p>{this.state.message}</p>}

        <div className="game-info">
          Your Points: {this.state.playerPoints}<br></br>
          Your Balls: {this.state.playerBalls.length > 0 ? this.state.playerBalls.join(', ') : 'None'}<br></br><br></br>

          Lottery Balls: {this.state.randomDrawnBalls.length > 0 && this.state.ballsPicked ? this.state.randomDrawnBalls.join(', ') : 'Pick your balls first, then start the game.'}
        </div>
      </div>
    );
  }
}

export default App;
