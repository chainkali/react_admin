import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'
import {
  Form, Input
} from 'antd'

const Item = Form.Item

/*
添加/修改用户的form组件
 */
class GoodsForm extends PureComponent {

  static propTypes = {
    setForm: PropTypes.func.isRequired, // 用来传递form对象的函数
      good: PropTypes.object
  }

  componentWillMount () {
    this.props.setForm(this.props.form)
  }

  render() {
    const { TextArea } = Input;
    const {good} = this.props
    const { getFieldDecorator } = this.props.form
    // 指定Item布局的配置对象
    const formItemLayout = {
      labelCol: { span: 4 },  // 左侧label的宽度
      wrapperCol: { span: 15 }, // 右侧包裹的宽度
    }

    return (
      <Form {...formItemLayout}>
        <Item label='物资'>
          {
            getFieldDecorator('name', {
              initialValue: good.name,
                rules: [
                    {
                        required: true, message: '请输入名称'
                    },
                ],
            })(
              <Input placeholder='请输入物资名'/>
            )
          }
        </Item>
          <Item label='数量'>
              {
                  getFieldDecorator('number', {
                      initialValue: good.number,
                      rules: [
                          {
                              required: true,
                              pattern: /^(0|[1-9][0-9]*|-[1-9][0-9]*)$/,
                              message: '请输入数量，且填写正确的数字',
                          },
                      ],
                  })(
                      <Input placeholder='请输入数量'/>
                  )
              }
          </Item>
        <Item label='备注'>
          {
            getFieldDecorator('note', {
              initialValue: good.note,
                rules: [
                    {
                        required: true, message: '请输入备注'
                    },
                ],
            })(
                <TextArea rows={4} placeholder='请输入备注'/>
            )
          }
        </Item>
      </Form>
    )
  }
}

export default Form.create()(GoodsForm)