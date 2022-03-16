// import logo from "./logo.svg";
import "./App.css";
import React from "react";
import lottery from './lottery.js';
import web3 from "./web3";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      manager: "",
      players: [],
      balance: 0,
      value: 0
    };
  }
  async componentDidMount() {
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);
    this.setState({ 
      manager: manager,
      players: players,
      balance: balance,
      message: ""
    });  
  }
  onSubmit = async (event) => {
    event.preventDefault();
    const accounts = await web3.eth.getAccounts();
    this.setState({ message: "Waiting for the success of the transation.." });
    await lottery.methods.enter().send({ from: accounts[0], value: web3.utils.toWei(this.state.value, "ether") });
    this.setState({ message: "You have entered the lottery !" })
  };
  onClick = async (event) => {
    event.preventDefault();
    this.setState({message: "Hold on for transaction.."});
    const accounts = await web3.eth.getAccounts();
    await lottery.methods.pickWinner().send({ from: accounts[0] });
    this.setState({message: "Winner has been picked !"});
  };
  render() {
    return (
      <div>
        <h2>
          Lottery contract
        </h2>
        <p>This contract is managed by {this.state.manager}, and there are {this.state.players.length} people who 
        had entered the competition. The price to win is at {web3.utils.fromWei(`${this.state.balance}`, "ether")}. </p>
        <hr></hr>
        <form onSubmit={this.onSubmit}>
          <h4>Want to try your luck?</h4>
          <div>
            <label>
              Amount of ether to enter
            </label>
            <input value={this.state.value} onChange={ event => this.setState({ value: event.target.value })} /> 
          </div>
          <button>Enter</button>
        </form>
        <hr></hr>
        <p>{this.state.message}</p>
        <hr></hr>
        <button onClick={this.onClick} >Pick a winner!</button>
      </div>
    );
  }
}
export default App;
