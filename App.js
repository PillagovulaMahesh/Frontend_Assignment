import React, { Component } from 'react';
import { BrowserRouter as Router, Route, NavLink, Switch } from 'react-router-dom';
import Web3 from 'web3';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

class SideNavBar extends Component {
  render() {
    return (
      <nav className="side-nav">
        <ul>
          <li><NavLink exact to="/" activeClassName="active">Home</NavLink></li>
          <li><NavLink to="/population" activeClassName="active">Population Data</NavLink></li>
          <li><NavLink to="/cryptocurrency" activeClassName="active">Cryptocurrency Prices</NavLink></li>
        </ul>
      </nav>
    );
  }
}

class PopulationGraph extends Component {
  constructor(props) {
    super(props);
    this.state = {
      populationData: []
    };
  }

  async componentDidMount() {
    try {
      const response = await fetch('https://datausa.io/api/data?drilldowns=Nation&measures=Population');
      const data = await response.json();
      this.setState({ populationData: data.data });
    } catch (error) {
      console.error('Error fetching population data:', error);
    }
  }

  render() {
    return (
      <div className="population-graph">
        <h2>Population Data</h2>
        <LineChart width={600} height={300} data={this.state.populationData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="Year" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="Population" stroke="#8884d8" />
        </LineChart>
      </div>
    );
  }
}

class CryptocurrencyPrices extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bitcoinPrice: {},
      ethereumPrice: {}
    };
  }

  async componentDidMount() {
    try {
      const response = await fetch('https://api.coindesk.com/v1/bpi/currentprice.json');
      const data = await response.json();
      this.setState({ bitcoinPrice: data.bpi.USD, ethereumPrice: data.bpi.EUR });
    } catch (error) {
      console.error('Error fetching cryptocurrency prices:', error);
    }
  }

  render() {
    return (
      <div className="cryptocurrency-prices">
        <h2>Cryptocurrency Prices</h2>
        <div className="price-card">
          <h3>Bitcoin (USD)</h3>
          <p>{this.state.bitcoinPrice.rate}</p>
        </div>
        <div className="price-card">
          <h3>Ethereum (EUR)</h3>
          <p>{this.state.ethereumPrice.rate}</p>
        </div>
      </div>
    );
  }
}

class MetaMaskIntegration extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isConnected: false,
      errorMessage: ''
    };
  }

  connectWallet = async () => {
    try {
      if (window.ethereum) {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const web3 = new Web3(window.ethereum);
        const accounts = await web3.eth.getAccounts();
        if (accounts.length > 0) {
          this.setState({ isConnected: true, errorMessage: '' });
        }
      } else {
        this.setState({ isConnected: false, errorMessage: 'MetaMask extension not detected.' });
      }
    } catch (error) {
      this.setState({ isConnected: false, errorMessage: error.message });
    }
  };

  render() {
    const { isConnected, errorMessage } = this.state;
    return (
      <div>
        <button onClick={this.connectWallet}>Connect Wallet</button>
        {isConnected && <p>Wallet connected successfully!</p>}
        {errorMessage && <p>{errorMessage}</p>}
      </div>
    );
  }
}

function App() {
  return (
    <Router>
      <div className="app">
        <SideNavBar />
        <div className="content">
          <Switch>
            <Route exact path="/" component={HomePage} />
            <Route path="/population" component={PopulationGraph} />
            <Route path="/cryptocurrency" component={CryptocurrencyPrices} />
          </Switch>
        </div>
      </div>
    </Router>
  );
}

function HomePage() {
  return (
    <div>
      <h2>Home</h2>
      <MetaMaskIntegration />
    </div>
  );
}

export default App;
