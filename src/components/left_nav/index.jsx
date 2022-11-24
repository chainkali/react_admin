import React, {Component} from 'react';
import './index.less'
import {Link, withRouter} from "react-router-dom";
import img from './background.jpg'
import {Menu, Icon} from 'antd';
import menuList from "../../config/menuConfig";
const {SubMenu} = Menu;
class LeftNav extends Component {
    // state = {
    //     collapsed: false,
    // };

    /**
     * 根据menu的数据数组生产对应的标签数组
     * */
    getMenuNodes_map = (menuList) => {
        const path=this.props.location.pathname
        return menuList.map(item => {
            /*
            * {
                title: '首页', // 菜单标题名称
                key: '/home', // 对应的path
                icon: 'home', // 图标名称
                children: [],
                 }
            * */
            if (!item.children) {
                return (
                    <Menu.Item key={item.key}>
                        <Link to={item.key}>
                            <Icon type={item.icon}/>
                            <span>{item.title}</span>
                        </Link>
                    </Menu.Item>
                )
            } else {
                //子节点的路径与当前路由path相等则展开当前item
                const cItem = item.children.find(cItem=>cItem.key===path)
                //当前需要展开的key
                if (cItem){
                    this.openkey=item.key
                }

                return (
                    <SubMenu
                        key={item.key}
                        title={
                            <span>
                                <Icon type={item.icon}/>
                                <span>{item.title}</span>
                            </span>
                        }
                    >
                        {/*递归调用生成children*/}
                        {this.getMenuNodes_map(item.children)}
                    </SubMenu>
                )
            }
        })
    }

    /*
  根据menu的数据数组生成对应的标签数组
  使用reduce() + 递归调用
  */
    getMenuNodes=(menuList)=>{
// menuList.reduce((上一次统计的结果,item)=>{},[]初始化一个空数组 )
        return menuList.reduce((pre,item)=>{
            if (!item.chilend){
                pre.push((
                    <Menu.Item key={item.key}>
                        <Link to={item.key}>
                            <Icon type={item.icon}/>
                            <span>{item.title}</span>
                        </Link>
                    </Menu.Item>
                ))
            }else {
                pre.push((
                    <SubMenu
                        key={item.key}
                        title={
                            <span>
                                <Icon type={item.icon}/>
                                <span>{item.title}</span>
                            </span>
                        }
                    >
                        {/*递归调用生成children*/}
                        {this.getMenuNodes(item.children)}
                    </SubMenu>
                ))
            }

        return pre
    },[])
    }

    // constructor() {
    //     super();
    //     this.getMenuNodes_map=this.getMenuNodes_map(menuList)
    // }
    //第一次render（）之前执行一次
    // 为第一个render（）准备数据
    // getDerivedStateFromProps(){
    //     this.getMenuNodes_map=this.getMenuNodes_map(menuList)
    // }
    UNSAFE_componentWillMount() {
        this.getMenuNodes_map=this.getMenuNodes_map(menuList)
    }

    render() {
        // debugger
        //得到当前路由请求路径
        const path=this.props.location.pathname
        ////当前需要展开的key
        const openKey=this.openkey
        return (
            <div className="left-nav">
                <Link to='/' className="left-nav-header">
                    <img src={img} alt="img"/>
                    <h1>核酸检测管理系统</h1>
                </Link>
                <div className="left-menu">
                    <Menu className="left-menu-menu"
                          //选中当前菜单key数组
                        selectedKeys={[path]}
                        defaultOpenKeys={[openKey]}
                          mode="inline"
                        // theme="dark"
                    >
                        {
                            this.getMenuNodes_map
                        }
                        {/*
                        <Menu.Item key="1">
                            <Link to='/home'>
                                <Icon type="pie-chart" />
                                <span>首页</span>
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="2">
                            <Link to='/product'>
                                <Icon type="pie-chart" />
                                <span>product</span>
                            </Link>
                        </Menu.Item>

                        <SubMenu
                            key="sub1"
                            title={
                                <span>
                                    <Icon type="mail" />
                                    <span>看看里面是啥</span>
                                </span>
                            }
                        >

                            <Menu.Item key="5">
                                <Link to='/goods'>
                                    <Icon type="mail" />
                                    <span>goods</span>
                                </Link>
                            </Menu.Item>

                            <Menu.Item key="6">Option 6</Menu.Item>
                            <Menu.Item key="7">Option 7</Menu.Item>
                            <Menu.Item key="8">Option 8</Menu.Item>
                        </SubMenu>
                        <SubMenu
                            key="sub2"
                            title={
                                <span>
                <Icon type="appstore" />
                <span>Navigation Two</span>
              </span>
                            }
                        >
                            <Menu.Item key="9">Option 9</Menu.Item>
                            <Menu.Item key="10">Option 10</Menu.Item>
                            <SubMenu key="sub3" title="Submenu">
                                <Menu.Item key="11">Option 11</Menu.Item>
                                <Menu.Item key="12">Option 12</Menu.Item>
                            </SubMenu>
                        </SubMenu>
                        */}
                    </Menu>
                </div>
            </div>
        );
    }
}

export default withRouter(LeftNav)