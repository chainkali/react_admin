import React, {Component} from 'react';
import './index.less'
import {reqWeather} from "../../api";
import {formateDate} from "../../utils/dateUtils";
import menuList from "../../config/menuConfig";
import {withRouter} from "react-router-dom";
import memoryUtils from "../../utils/memoryUtils";
import local from "./images/local.svg"
import {Avatar, Modal} from "antd";
import LinkButton from "../link-button";
import storageUtils from "../../utils/storageUtils";

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
            windpower:'<=3'
        })

        // this.getWeather()
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
        console.log(this.state)
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
            windpower
        } =this.state
        const username = memoryUtils.user.username
        const title = this.getTitle()
        return (
            <div className="MyHeader">
                <div className="MyHeader-top">
                    <div className="MyHeader-top-body-let">
                        {title}
                    </div>
                    <div className="MyHeader-top-body-right">
                        <Avatar style={{marginTop:-8, backgroundColor: 'rgba(110,189,70,0.76)'}} size={50}>{username}</Avatar>
                       <LinkButton onClick={this.logout}>退出</LinkButton>
                    </div>
                </div>
                <div className="MyHeader-bottom">
                    <div className="MyHeader-bottom-right">
                        <img src={local} alt="local"/>
                        <span>{province}省</span>
                        <span>{city}</span>
                        <span>天气:{weather}</span>
                        <span>温度:{temperature}</span>
                        <span>风向:{winddirection}</span>
                        <span>风力等级{windpower}</span>
                        <span>{currentTime} </span>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(MyHeader)