import React, {Component} from 'react';
import memoryUtils from "../../utils/memoryUtils";
import {Redirect, Route,Switch} from "react-router-dom";
import {Layout} from "antd";
import LeftNav from "../../components/left_nav";
import MyHeader from "../../components/header";
import './admin.less'
import Manage from "../manage/Manage";
import User from "../user/user";
import Home from "../home/home";
import Goods from "../goods/goods";
import Narecord from "../narecord/narecord";
import NaLocation from "../naLocation/naLocation";
import Nastaff from "../nastaff/nastaff";
const { Header, Footer, Sider, Content } = Layout;

export default class Admin extends Component {

    render() {
        const user = memoryUtils.user
        //如果当前内存没有user==>未登录
        if(!user||!user.id){
            //重定向
            return <Redirect to='/login'/>
        }

        return (
            <div className="admin">
                <Layout className="admin-layout-left">
                    <Sider className="admin-layout-sider">
                        <LeftNav/>
                    </Sider>
                    <Layout className="admin-layout-right">
                        <Header className="admin-layout-Header">
                            <MyHeader/>
                        </Header>
                        <Content className="admin-layout-Content">
                            <Switch>
                                <Route path='/home' component={Home}/>
                                <Route path='/manage' component={Manage}/>
                                <Route path='/user' component={User}/>
                                <Route path='/narecord' component={Narecord}/>
                                <Route path='/naLocation' component={NaLocation}/>
                                <Route path='/goods' component={Goods}/>
                                <Route path='/nastaff' component={Nastaff}/>
                                <Redirect to="/home"/>
                            </Switch>
                        </Content>
                        <Footer className="admin-layout-Footer">
                            今天天气不错适合做核酸
                        </Footer>
                    </Layout>
                </Layout>

            </div>


        );
    }
}

