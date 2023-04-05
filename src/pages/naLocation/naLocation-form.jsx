import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'
import {
  DatePicker,TimePicker,
  Form,
  Input, Select
} from 'antd'
import moment from 'moment';
import {count} from "echarts/lib/component/dataZoom/history";

const format = 'HH:mm';
const Item = Form.Item
const Option = Select.Option

/*
添加/修改用户的form组件
 */
class NaLocationForm extends PureComponent {

  static propTypes = {
    setForm: PropTypes.func.isRequired, // 用来传递form对象的函数
      naLocation: PropTypes.object
  }

  componentWillMount () {
    this.props.setForm(this.props.form)
  }

  render() {

    const {naLocation} = this.props
    const { getFieldDecorator } = this.props.form
    const { RangePicker } = DatePicker;
    // 指定Item布局的配置对象
    const formItemLayout = {
      labelCol: { span: 4 },  // 左侧label的宽度
      wrapperCol: { span: 15 }, // 右侧包裹的宽度
    }

    return (
      <Form {...formItemLayout}>
        <Item label='检测点'>
          {
            getFieldDecorator('location', {
                initialValue: naLocation.location,
                rules: [

                    {whitespace: true,message:'不能仅为空格'},
                    {required: true, message: '请输入检测点'}

                ],
            })(
              <Input placeholder='检测点'/>
            )
          }
        </Item>
          <Item label='检测点状态'>
              {
                  getFieldDecorator('status', {
                      initialValue: naLocation.status,
                      rules: [
                          {required: true, message: '请输入检测点状态'}
                      ],
                  })(
                      <Select style={{ width: 200 }}
                              placeholder='检测点状态'>
                        <Option value="使用中">使用中</Option>
                        <Option value="已停用">已停用</Option>
                      </Select>
                  )
              }
          </Item>
          <Item label='开始时间'>
              {
                  getFieldDecorator('startDate', {
                      initialValue: moment(naLocation.startDate),
                      rules: [

                          {required: true, message: '请选择时间'}

                      ],
                  })(
                      // <TimePicker value={momentObj} showTime placeholder="Select Time"/>
                      <TimePicker  minuteStep={15} format={format} placeholder="Select Time"/>

                  )
              }
          </Item>
        <Item label='结束时间'>
          {
            getFieldDecorator('endDate', {
              initialValue: moment(naLocation.endDate),
              rules: [

                {required: true, message: '请选择时间'}

              ],
            })(
                <TimePicker  minuteStep={15} format={format} placeholder="Select Time"/>
                // <Input placeholder='请输入结束时间'/>
            )
          }
        </Item>
      </Form>
    )
  }
}

export default Form.create()(NaLocationForm)