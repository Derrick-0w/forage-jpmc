import React, { Component } from 'react';
import DataStreamer, { ServerRespond } from './DataStreamer';
import Graph from './Graph';
import './App.css';

/**
 * State declaration for <App />
 */
interface IState {
  data: ServerRespond[],
  // render the graph component only when there is data
  showGraph: boolean, 
}

/**
 * The parent element of the react app.
 * It renders title, button and Graph react element.
 */
class App extends Component<{}, IState> {
   // hold the ID of the interval timer
  private intervalId: NodeJS.Timeout | undefined;
  constructor(props: {}) {
    super(props);

    this.state = {
      // data saves the server responds.
      // We use this state to parse data down to the child element (Graph) as element property
      data: [],
      showGraph: false
    };
  }

  /**
   * Render Graph react component with state.data parse as property data
   */
  renderGraph() {
    if (this.state.showGraph === true)
      return (<Graph data={this.state.data}/>)
  }

  /**
   * Get new data from server and update the state with the new data
   */
  getDataFromServer() {
    // Step 1: Define a function to fetch data from the server
    const fetchData = () => {
      // DataStreamer is used to get data from the server
      DataStreamer.getData((serverResponds: ServerRespond[]) => {
        this.setState({
          // Create a new array combining the existing state data with the new server responses
          data: [...this.state.data, ...serverResponds],
          // since there is data, show graph
          showGraph: true,
        });
      });
    };
    // Step 2: Define the interval duration
  const intervalDuration = 100; // interval duration in milliseconds
  this.intervalId = setInterval(fetchData, intervalDuration);
  }//if component is removed
  unmountComponent(){
    //clear the interval to avoid leaks
    if (this.intervalId){
      clearInterval(this.intervalId);
    }
  }

  /**
   * Render the App react component
   */
  render() {
    return (
      <div className="App">
        <header className="App-header">
          Bank & Merge Co Task 2
        </header>
        <div className="App-content">
          <button className="btn btn-primary Stream-button"
            // when button is click, our react app tries to request
            // new data from the server.
            // As part of your task, update the getDataFromServer() function
            // to keep requesting the data every 100ms until the app is closed
            // or the server does not return anymore data.
            onClick={() => {this.getDataFromServer()}}>
            Start Streaming Data
          </button>
          <div className="Graph">
            {this.renderGraph()}
          </div>
        </div>
      </div>
    )
  }
}

export default App;
