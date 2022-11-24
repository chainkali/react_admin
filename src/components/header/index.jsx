import React, {Component} from 'react';
import './index.less'
import  logo from './images/logo.png'
export default class MyHeader extends Component {
    render() {
        return (
            <div className="MyHeader">
                <div className="MyHeader-top">
                    <span>欢迎，admin</span>
                    <a href="/">退出</a>
                    </div>
                <div className="MyHeader-bottom">
                    <div className="MyHeader-bottom-left">
                        首页
                    </div>
                    <div className="MyHeader-bottom-right">
                        <span>时间 </span>
                        <img src={logo} alt="weather"/>
                        <span>天气情况 </span>
                    </div>
                </div>
            </div>
        );
    }
}