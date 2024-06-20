import React from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import Transactions from './components/Transactions';
import Statistics from './components/Statistics';
import Total from './components/Total';

function App() {
  return (
    <Router>
      <div className="App">
        <nav>
          <ul>
            <li><Link to="/transactions">Transactions</Link></li>
            <li><Link to="/statistics">Statistics</Link></li>
            <li><Link to="/total">Total Transactions</Link></li>
          </ul>
        </nav>
        <Switch>
          <Route path="/transactions" component={Transactions} />
          <Route path="/statistics" component={Statistics} />
          <Route path="/total" component={Total} />
          <Route path="/" exact component={Transactions} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
