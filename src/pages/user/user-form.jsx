import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'
import {
  Form,
  Select,
  Input
} from 'antd'

const Item = Form.Item
const Option = Select.Option

/*
添加/修改用户的form组件
 */
class UserForm extends PureComponent {

  static propTypes = {
    setForm: PropTypes.func.isRequired, // 用来传递form对象的函数
      user: PropTypes.object
  }

  componentWillMount () {
    this.props.setForm(this.props.form)
  }

  render() {
      console.log(this.props)
    const {user} = this.props
      console.log("user:")
      console.log(user)
    const { getFieldDecorator } = this.props.form
    // 指定Item布局的配置对象
    const formItemLayout = {
      labelCol: { span: 4 },  // 左侧label的宽度
      wrapperCol: { span: 15 }, // 右侧包裹的宽度
    }

    return (
      <Form {...formItemLayout}>
        <Item label='用户名'>
          {
            getFieldDecorator('username', {
              initialValue: user.username,
            })(
              <Input placeholder='请输入用户名'/>
            )
          }
        </Item>

        {
            user.id ? null : (
            <Item label='密码'>
              {
                getFieldDecorator('password', {
                  initialValue: user.password,
                    rules: [
                        {
                            required: true, message: '请输入密码'
                        },
                        {
                            visibilityToggle:true,//小眼睛切换
                            // max: 12,
                            pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,12}$/,
                            message: '密码必须由数字、字母两种字符组成，长度在6-12位之间',
                        },
                    ],
                })(
                  <Input.Password  placeholder='请输入密码'/>
                )
              }
            </Item>
          )
        }
          <Item label='性别'>
              {
                  getFieldDecorator('gender', {
                      initialValue: user.gender,
                  })(
                      <Select style={{ width: 120 }}>
                          <Option value="男">男</Option>
                          <Option value="女">女</Option>
                      </Select>
                      // <Input placeholder='请输入性别'/>
                  )
              }
          </Item>
        <Item label='手机号'>
          {
            getFieldDecorator('phone', {
              initialValue: user.phone,
                rules: [
                    {
                        required: true, message: '请输入手机号'
                    },
                    {
                        // max: 10,
                        pattern: /^1(3\d|4[5-9]|5[0-35-9]|6[567]|7[0-8]|8\d|9[0-35-9])\d{8}$/,
                        message: '请输入正确的手机号',
                    },
                ],
            })(
              <Input placeholder='请输入手机号'/>
            )
          }
        </Item>
        <Item label='地址'>
          {
            getFieldDecorator('address', {
              initialValue: user.address,
            })(
              <Input placeholder='请输入地址'/>
            )
          }
        </Item>
      </Form>
    )
  }
}

export default Form.create()(UserForm)