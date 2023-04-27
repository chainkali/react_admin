import React, {Component} from 'react';
import './index.less'
import {reqAddOrUpdateManage, reqAddOrUpdateUser, reqWeather} from "../../api";
import {formateDate} from "../../utils/dateUtils";
import menuList from "../../config/menuConfig";
import {withRouter} from "react-router-dom";
import memoryUtils from "../../utils/memoryUtils";
import {Card, Descriptions, Dropdown, Icon, Menu, message, Modal} from "antd";
import storageUtils from "../../utils/storageUtils";
import LoginForm from "../../pages/login/login-form";
import IndexForm from "./index-form";
import * as PropTypes from "prop-types";
import IndexFormAdmin from "./admnindex-form";

/**
async function getCity() {
    let result = await weather();
    if (result.status==="1"){
        console.log('打印res：', result.lives)
        console.log("*******************************")
        console.log('打印res：', result)
    }else {
        console.log("获取天气失败")
    }
}
getCity()
*/
function Space(props) {
    return null;
}

Space.propTypes = {children: PropTypes.node};


class MyHeader extends Component {
    constructor(props) {
        super(props);
        this.state=({
            currentTime: formateDate(Date.now()),
            city:'无锡',
            province:'江苏',
            temperature:'25',
            weather:'晴',
            winddirection:'北',
            windpower:'<=3',
            isShow: false, // 是否显示确认框
        })

        this.getWeather()
        this.getTime()

    }

    getTime = () => {
        // 每隔1s获取当前时间, 并更新状态数据currentTime
        this.intervalId = setInterval(() => {
            const currentTime = formateDate(Date.now())
            this.setState({currentTime})
        }, 1000)
    }

    getWeather=async ()=>{
       const {city, province, temperature, weather, winddirection,windpower }=await reqWeather('320200')
        this.setState({city, province, temperature, weather, winddirection,windpower})
    }

    getTitle = () => {
        // 得到当前请求路径

        const path = this.props.location.pathname
        let title=""
        menuList.forEach(item => {
            if (item.key===path) { // 如果当前item对象的key与path一样,item的title就是需要显示的title
                title = item.title
            } else if (item.children) {
                // 在所有子item中查找匹配的
                // title = item.title
                const cItem = item.children.find(cItem => path.indexOf(cItem.key)===0)
                // 如果有值才说明有匹配的
                if(cItem) {
                    // 取出它的title
                    title =cItem.title
                }
            }
        })
        return title
    }
    logout=()=>{
        Modal.confirm({
            content:'确定退出吗？',
            onOk:()=>{
                console.log('ok',this)
                //删除保存的user数据
                storageUtils.removeUser()
                memoryUtils.user={}

                //跳转到login
                this.props.history.replace('/login')
            }
        })
    }
    showUpdate = () => {
        this.setState({
            isShow: true
        })
    }
    /*
    添加/更新用户
     */
    UpdateAdmin = async () => {
        // 1. 收集输入数据
        const manage = this.form.getFieldsValue()
        this.form.resetFields()
        // 如果是更新, 需要给user指定id属性

            manage.id = memoryUtils.user.id
            if (manage.email.trim().length === 0 || manage.gender.trim().length === 0 || manage.name.trim().length === 0 || manage.telephone.trim().length === 0) {
                message.warning("请填写完整的数据信息")
            } else {
                // 2. 提交添加的请求
                console.log("提交添加的请求")
                const result = await reqAddOrUpdateManage(manage)
                // 3. 更新列表显示
                if (result.code === 200) {
                    message.success('修改成功，请重新登陆')
                    console.log("修改成功，请重新登陆result")
                    console.log(result)
                    this.setState({isShow: false})
                    //删除保存的user数据
                    storageUtils.removeUser()
                    memoryUtils.user={}
                    //跳转到login
                    this.props.history.replace('/login')
                }else {
                    message.warning("操作"+result.message+","+result.data)
                }
            }

    }


    addOrUpdateUser = async () => {
            // 1. 收集输入数据
            const user = this.form.getFieldsValue()
            this.form.resetFields()
            console.log("code2:")
            // 如果是更新, 需要给user指定id属性
                user.id = memoryUtils.user.id
                if (user.username.trim().length === 0 || user.gender.trim().length === 0 || user.phone.trim().length === 0 || user.address.trim().length === 0) {
                    message.warning("请填写完整的数据信息")
                } else {
                    // 2. 提交添加的请求
                    console.log("提交添加的请求1")
                    const result = await reqAddOrUpdateUser(user)
                    // 3. 更新列表显示
                    if (result.code === 200) {
                        message.success('修改个人信息成功，请重新登陆')
                        this.setState({isShow: false})
                        //删除保存的user数据
                        storageUtils.removeUser()
                        memoryUtils.user={}
                        //跳转到login
                        this.props.history.replace('/login')

                    }else {
                        message.warning("操作"+result.message+","+result.data)
                    }
                }
            }


    /*
    当前组件卸载之前调用
    */
    componentWillUnmount () {
        // 清除定时器
        clearInterval(this.intervalId)
    }

    render() {
        const {
            currentTime,
            city,
            province,
            temperature,
            weather,
            winddirection,
            windpower,
            isShow
        } =this.state
        console.log(memoryUtils.user)
        const userName = memoryUtils.user.username
        const adminName = memoryUtils.user.name
        const title = this.getTitle()
        const menu = (
            <Menu style={{ textAlign: 'center' }}>
                <Menu.Item>
                    <a target="_blank" rel="noopener noreferrer" onClick={this.showUpdate}>
                        修改个人信息
                    </a>
                </Menu.Item>
                <Menu.Item>
                <a target="_blank" rel="noopener noreferrer" onClick={this.logout}>
                    退出登录
                </a>
                </Menu.Item>
            </Menu>
        );
        return (
            <div className="MyHeader">
                <div className="MyHeader-top">
                    <div className="MyHeader-top-body-let">
                        {title}
                    </div>
                    <div className="MyHeader-top-body-right">
                        <Dropdown overlay={menu}>
                            <a className="ant-dropdown-link" style={{fontSize: '15px'}}onClick={e => e.preventDefault()}>
                                欢迎您！亲爱的:{userName?userName:adminName}&ensp;<Icon type="smile"   style={{ fontSize: '30px' }} />
                            </a>
                        </Dropdown>
                    </div>

                </div>
                <div className="MyHeader-bottom">
                    <Descriptions  style={{fontSize:'15px',paddingLeft:'170px'}} column={10} >
                        <Descriptions.Item label={province} >省</Descriptions.Item>
                        <Descriptions.Item label={city} >市</Descriptions.Item>
                        <Descriptions.Item label="天气">{weather}</Descriptions.Item>
                        <Descriptions.Item label="温度">{temperature}</Descriptions.Item>
                        <Descriptions.Item label="风向">{winddirection}</Descriptions.Item>
                        <Descriptions.Item label="风力等级">{windpower}</Descriptions.Item>
                        <Descriptions.Item >{currentTime}</Descriptions.Item>
                    </Descriptions>
                </div>
                {
                    memoryUtils.user.isAdmin?
                        (<Card style={{height: 0, width: 0, opacity: 0}}>
                    <Modal
                        title={'修管理员人信息'}
                        visible={isShow}
                        onOk={this.UpdateAdmin}
                        onCancel={() => {
                            this.form.resetFields()
                            this.setState({isShow: false})
                        }}
                    >
                        <IndexFormAdmin
                            setForm={form => this.form = form}
                            user={memoryUtils.user}
                        />
                    </Modal>
                </Card>):(<Card style={{height: 0, width: 0, opacity: 0}}>
                            <Modal
                                title={'修改个人信息'}
                                visible={isShow}
                                onOk={this.addOrUpdateUser}
                                onCancel={() => {
                                    this.form.resetFields()
                                    this.setState({isShow: false})
                                }}
                            >
                                <IndexForm
                                    setForm={form => this.form = form}
                                    user={memoryUtils.user}
                                />
                            </Modal>
                        </Card>)
                }
            </div>
        );
    }
}

export default withRouter(MyHeader)