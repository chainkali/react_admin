import React, {Component} from 'react'
import {Form, Icon, Input, Button, message, Checkbox} from 'antd'
import './login.less'
import logo from './images/logo.png'
import {reqLogin} from '../../api'
import memoryUtils from "../../utils/memoryUtils";
import storageUtils from "../../utils/storageUtils";
import {Redirect} from "react-router-dom";


const Item = Form.Item // 不能写在import之前
/*
登陆的路由组件
 */
class Login extends Component {

    handleSubmit = (event) => {

        // 阻止事件的默认行为
        event.preventDefault()

        // 对所有表单字段进行检验
        this.props.form.validateFields(async (err, values) => {
            // 检验成功
            if (!err) {
                // console.log('提交登陆的ajax请求', values)
                // 请求登陆
                const {username, password} = values
                const result = await reqLogin(username, password) // {status: 0, data: user}  {status: 1, msg: 'xxx'}
                // console.log('请求成功', result)
                if (result.status === 0) { // 登陆成功
                    // 提示登陆成功
                    message.success('登陆成功')
                    const user = result.data;
                    memoryUtils.user=user
                    console.log(user)
                    storageUtils.saveUser(user)
                    // 跳转到管理界面 (不需要再回退回到登陆)
                    this.props.history.replace('/')

                } else { // 登陆失败
                    // 提示错误信息
                    message.error(result.msg)
                }

            } else {
                console.log('检验失败!')
            }
        });


    }

    render() {
        //判断用户是否已经登录
        const user = memoryUtils.user;
        if (user && user._id){
            return <Redirect to='/'/>
        }

        // 得到具强大功能的form对象
        const form = this.props.form
        const {getFieldDecorator} = form;
        return (
            <div className="login">
                <header className="login-header">
                    <div className="login-header-imgh1">
                        <img src={logo} alt='logo'/>
                        <h1>核&ensp;酸&ensp;检&ensp;测&ensp;管&ensp;理&ensp;系&ensp;统</h1>
                    </div>

                </header>
                <section className="login-content">
                    <h2>用&ensp; 户&ensp; 登&ensp; 录</h2>
                    <Form onSubmit={this.handleSubmit} className="login-form">
                        <Item>
                            {getFieldDecorator('username', {
                                initialValue:'admin',
                                rules: [
                                    {type: 'string'},
                                    {required: true, message: '请输入用户名'},
                                    {max: 10, message: '用户名10个字以内'},
                                    {whitespace: true, message: '用户名不能仅为空格'}
                                ],
                            })(
                                <Input prefix={<Icon type="user" className="site-form-item-icon"/>}
                                       placeholder="账号"/>,
                            )}
                        </Item>
                        <Item>
                            {getFieldDecorator('password', {
                                initialValue:'admin',
                                rules: [
                                    {
                                        required: true, message: '请输入密码'
                                    },
                                    {
                                        max: 10,
                                        // pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,12}$/,
                                        message: '密码必须由数字、字母两种字符组成，长度在6-12位之间',
                                    },
                                ],
                            })(
                                <Input prefix={<Icon type="lock" className="site-form-item-icon"/>} type="password"
                                       placeholder="密码" />,
                            )}
                        </Item>
                        <Item>
                            {getFieldDecorator('remember', {
                                valuePropName: 'checked',
                                initialValue: true,
                            })(<Checkbox className="login-form-checkbox">
                                Remember me</Checkbox>
                            )}
                            <a className="login-form-forgot" href="/login">没有账号？点我注册</a>

                            <Button type="primary" htmlType="submit" className="login-form-button">
                                登录
                            </Button>
                        </Item>
                    </Form>
                </section>
            </div>
        )
    }
}

/*
1. 高阶函数
    1). 一类特别的函数
        a. 接受函数类型的参数
        b. 返回值是函数
    2). 常见
        a. 定时器: setTimeout()/setInterval()
        b. Promise: Promise(() => {}) then(value => {}, reason => {})
        c. 数组遍历相关的方法: forEach()/filter()/map()/reduce()/find()/findIndex()
        d. 函数对象的bind()
        e. Form.create()() / getFieldDecorator()()
    3). 高阶函数更新动态, 更加具有扩展性

2. 高阶组件
    1). 本质就是一个函数
    2). 接收一个组件(被包装组件), 返回一个新的组件(包装组件), 包装组件会向被包装组件传入特定属性
    3). 作用: 扩展组件的功能
    4). 高阶组件也是高阶函数: 接收一个组件函数, 返回是一个新的组件函数
 */
/*
包装Form组件生成一个新的组件: Form(Login)
新组件会向Form组件传递一个强大的对象属性: form
 */
const WrapLogin = Form.create()(Login)
export default WrapLogin
/*
1. 前台表单验证
2. 收集表单输入数据
 */

/*
async和await
1. 作用?
   简化promise对象的使用: 不用再使用then()来指定成功/失败的回调函数
   以同步编码(没有回调函数了)方式实现异步流程
2. 哪里写await?
    在返回promise的表达式左侧写await: 不想要promise, 想要promise异步执行的成功的value数据
3. 哪里写async?
    await所在函数(最近的)定义的左侧写async
 */