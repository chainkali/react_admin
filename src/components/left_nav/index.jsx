import React, {Component} from 'react';
import './index.less'
import {Link, withRouter} from "react-router-dom";
import {Menu, Icon} from 'antd';
import menuList from "../../config/menuConfig";
import logo from"./index-1.svg"
import memoryUtils from "../../utils/memoryUtils";
import menuListuser from "../../config/menuConfigUser";
const {SubMenu} = Menu;
class LeftNav extends Component {
    // state = {
    //     collapsed: false,
    // };
    // constructor(props) {
    //     super(props);
    //     this.getMenuNodes_map=this.getMenuNodes_map(menuList)
    // }

    /*
  判断当前登陆用户对item是否有权限
   */
    // hasAuth = (item) => {
    //     const {key, isPublic} = item
    //
    //     const menus = memoryUtils.user.role.menus
    //     const username = memoryUtils.user.name
    //     /*
    //     1. 如果当前用户是admin
    //     2. 如果当前item是公开的
    //     3. 当前用户有此item的权限: key有没有menus中
    //      */
    //     if(username==='admin' || isPublic || menus.indexOf(key)!==-1) {
    //         return true
    //     } else if(item.children){ // 4. 如果当前用户有此item的某个子item的权限
    //         return !!item.children.find(child =>  menus.indexOf(child.key)!==-1)
    //     }
    //
    //     return false
    // }

    /*
  根据menu的数据数组生成对应的标签数组
  使用map() + 递归调用
  */
    getMenuNodes_map = (menuList) => {
        return menuList.map(item => {
            /*
              {
                title: '首页', // 菜单标题名称
                key: '/home', // 对应的path
                icon: 'home', // 图标名称
                children: [], // 可能有, 也可能没有
              }

              <Menu.Item key="/home">
                <Link to='/home'>
                  <Icon type="pie-chart"/>
                  <span>首页</span>
                </Link>
              </Menu.Item>

              <SubMenu
                key="sub1"
                title={
                  <span>
                    <Icon type="mail"/>
                    <span>商品</span>
                  </span>
                }
              >
                <Menu.Item/>
                <Menu.Item/>
              </SubMenu>
            */
            if(!item.children) {
                return (
                    <Menu.Item key={item.key}>
                        <Link to={item.key}>
                            <Icon type={item.icon}/>
                            <span>{item.title}</span>
                        </Link>
                    </Menu.Item>
                )
            } else {
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
                        {this.getMenuNodes(item.children)}
                    </SubMenu>
                )
            }

        })
    }

    /*
    根据menu的数据数组生成对应的标签数组
    使用reduce() + 递归调用
    */
    getMenuNodes = (menuList) => {
        // 得到当前请求的路由路径
        const path = this.props.location.pathname

        return menuList.reduce((pre, item) => {

            // 如果当前用户有item对应的权限, 才需要显示对应的菜单项
            // if (this.hasAuth(item)) {
                // 向pre添加<Menu.Item>
                if(!item.children) {
                    pre.push((
                        <Menu.Item key={item.key}>
                            <Link to={item.key}>
                                <Icon type={item.icon}/>
                                <span>{item.title}</span>
                            </Link>
                        </Menu.Item>
                    ))
                } else {

                    // 查找一个与当前请求路径匹配的子Item
                    const cItem = item.children.find(cItem => path.indexOf(cItem.key)===0)
                    // 如果存在, 说明当前item的子列表需要打开
                    if (cItem) {
                        this.openKey = item.key
                    }


                    // 向pre添加<SubMenu>
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
                            {this.getMenuNodes(item.children)}
                        </SubMenu>
                    ))
                }
            // }

            return pre
        }, [])
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
        console.log("memoryUtils.isAdmin"+memoryUtils.isAdmin)
        if ( memoryUtils.isAdmin){
            this.getMenuNodes_map=this.getMenuNodes_map(menuList)
        }else {
            this.getMenuNodes_map=this.getMenuNodes_map(menuListuser)
        }

    }
    // style={{background:"rgba(2, 241, 96, 0.04)"}}
    render() {
        // debugger
        // 得到当前请求的路由路径
        let path = this.props.location.pathname
        console.log('render()', path)
        // 得到需要打开菜单项的key
        const openKey = this.openKey
        return (
            <div className="left-nav">
                <Link to='/' className="left-nav-header">
                    <img src={logo} alt="img"/>
                </Link>
                <div className="left-menu">
                    <Menu style={{background:"transparent",fontSize:40 }} className="left-menu-menu"
                          //选中当前菜单key数组
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