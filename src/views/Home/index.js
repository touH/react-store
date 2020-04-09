import React from "react";

class Home extends React.Component {

  componentDidMount() {
    console.log('props:', this.props)
  }

  render() {
    return <div>
      Home
    </div>
  }
}


export default Home;
