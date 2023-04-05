import React, {Component} from 'react';
import './home.less'
import Pie from "../charts/pie";
class Home extends Component {
    render() {
        return (
            <div className="home">
                <Pie/>

            </div>
        );
    }
}

export default Home;