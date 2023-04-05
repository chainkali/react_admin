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
class ManageForm extends PureComponent {

  static propTypes = {
    setForm: PropTypes.func.isRequired, // 用来传递form对象的函数
      manege: PropTypes.object
  }

  componentWillMount () {
    this.props.setForm(this.props.form)
  }

  render() {

    const {manage} = this.props
    const { getFieldDecorator } = this.props.form
    // 指定Item布局的配置对象
    const formItemLayout = {
      labelCol: { span: 4 },  // 左侧label的宽度
      wrapperCol: { span: 15 }, // 右侧包裹的宽度
    }

    return (
      <Form {...formItemLayout}>
        <Item label='管理员名'>
          {
            getFieldDecorator('name', {
              initialValue: manage.name,
                rules: [
                    {
                        required: true, message: '请输入管理员'
                    }
                ],
            })(
              <Input placeholder='请输入管理员名'/>
            )
          }
        </Item>

        {
            manage.id ? null : (
            <Item label='密码'>
              {
                getFieldDecorator('password', {
                  initialValue: manage.password,
                    rules: [
                        {

                            required: true, message: '请输入密码'
                        },
                        {
                            visibilityToggle:true,
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
                      initialValue: manage.gender,
                  })(
                      <Select  style={{ width: 120 }}>
                          <Option value="男">男</Option>
                          <Option value="女">女</Option>
                      </Select>
                      // <Input placeholder='请输入性别'/>
                  )
              }
          </Item>
        <Item label='邮箱'>
          {
            getFieldDecorator('email', {
              initialValue: manage.email,
                rules: [
                    {
                        required: true, message: '请输入邮箱'
                    },
                    {
                         pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
                        message: '请输入正确的邮箱',
                    },
                ],
            })(
              <Input placeholder='请输入邮箱'/>
            )
          }
        </Item>
        <Item label='联系方式'>
          {
            getFieldDecorator('telephone', {
              initialValue: manage.telephone,
                rules: [
                    {
                        required: true, message: '请输入联系方式'
                    },
                    {
                        // max: 10,
                        pattern: /^1(3\d|4[5-9]|5[0-35-9]|6[567]|7[0-8]|8\d|9[0-35-9])\d{8}$/,
                        message: '请输入正确的联系方式',
                    },
                ],
            })(
              <Input placeholder='请输入联系方式'/>
            )
          }
        </Item>
      </Form>
    )
  }
}

export default Form.create()(ManageForm)