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
class NarecordForm extends PureComponent {

  static propTypes = {
    setForm: PropTypes.func.isRequired, // 用来传递form对象的函数
      naRecord: PropTypes.object
  }

  componentWillMount () {
    this.props.setForm(this.props.form)
  }

  render() {

    const {naRecord} = this.props
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
            getFieldDecorator('name', {
                initialValue: naRecord.name,
                rules: [

                    {whitespace: true,message:'不能仅为空格'},
                    {required: true, message: '请输入姓名'}

                ],
            })(
              <Input placeholder='姓名'/>
            )
          }
        </Item>
          <Item label='身份证'>
              {
                  getFieldDecorator('idcard', {
                      initialValue: naRecord.idcard,
                      rules: [
                        {
                          pattern: /^([1-6][1-9]|50)\d{4}(18|19|20)\d{2}((0[1-9])|10|11|12)(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
                          message: '请输入正确的身份证信息',
                        },
                          {whitespace: true,message:'不能仅为空格'},
                          {required: true, message: '请输入正确的身份证信息'}

                      ],
                  })(
                      <Input placeholder='请输入身份证号码'/>
                  )
              }
          </Item>
          <Item label='性别'>
              {
                  getFieldDecorator('gender', {
                      initialValue: naRecord.gender,
                      rules: [

                          {required: true, message: '请选择性别'}

                      ],
                  })(
                      <Select style={{ width: 200 }}
                              placeholder='性别'>
                          <Option value="男">男</Option>
                          <Option value="女">女</Option>
                      </Select>
                      // <Input placeholder='请输入性别'/>
                  )
              }
          </Item>
        <Item label='检测结果'>
          {
            getFieldDecorator('naResult', {
                initialValue: naRecord.naResult,
                rules: [

                    {whitespace: true,message:'不能仅为空格'},
                    {required: true, message: '请输入检测结果'}

                ],
            })(<Select  style={{ width: 200 }}
                       placeholder='检测结果'>
                <Option value="阴性">阴性</Option>
                <Option value="阳性">阳性</Option>
            </Select>

            )
          }
        </Item>
        <Item label='检测点'>
          {
            getFieldDecorator('naLocation', {
                initialValue: naRecord.naLocation,
                rules: [
                    {required: true, message: '请选择检测点'}
                ],
            })(
                <Select style={{ width: 200 }}
                        placeholder='检测点'>
                    <Option value="检测点1">检测点1</Option>
                    <Option value="检测点2">检测点2</Option>
                    <Option value="检测点3">检测点3</Option>
                    <Option value="检测点4">检测点4</Option>
                    <Option value="检测点5">检测点5</Option>
                </Select>

            )
          }
        </Item>
      </Form>
    )
  }
}

export default Form.create()(NarecordForm)