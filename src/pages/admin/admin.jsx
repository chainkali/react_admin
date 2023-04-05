import React, {Component} from 'react';
import memoryUtils from "../../utils/memoryUtils";
import {Redirect, Route,Switch} from "react-router-dom";
import {Layout} from "antd";
import LeftNav from "../../components/left_nav";
import MyHeader from "../../components/header";
import './admin.less'
import Manage from "../manage/Manage";
import User from "../user/user";
import Bar from "../charts/bar";
import Pie from "../charts/pie";
import Home from "../home/home";
import Goods from "../goods/goods";
// import Category from "../category/category";
// import Product from "../product/product";
import Lines from "../charts/lines";
import Narecord from "../narecord/narecord";
import NaLocation from "../naLocation/naLocation";
import Person from "../person/person";
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
                                {/*<Route path='/category' component={Category}/>*/}
                                {/*<Route path='/product' component={Product}/>*/}
                                <Route path='/manage' component={Manage}/>
                                <Route path='/user' component={User}/>
                                <Route path='/narecord' component={Narecord}/>
                                <Route path='/naLocation' component={NaLocation}/>
                                <Route path='/goods' component={Goods}/>
                                <Route path='/person' component={Person}/>
                                {/*<Route path='/charts/bar' component={Bar}/>*/}
                                {/*<Route path='/charts/line' component={Lines}/>*/}
                                {/*<Route path='/charts/pie' component={Pie}/>*/}
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

