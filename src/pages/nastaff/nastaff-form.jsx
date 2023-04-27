import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'
import {
  Form,
  Select,
  Input
} from 'antd'
import {reqLocations} from "../../api";
const Item = Form.Item
const Option = Select.Option

/*
添加/修改用户的form组件
 */
class NastaffForm extends PureComponent {
    static propTypes = {
        setForm: PropTypes.func.isRequired, // 用来传递form对象的函数
        Person: PropTypes.object
    }
    state = {
        loading: false, // 是否正在获取数据中
        locations: [],// 检测点列表

    }

  componentWillMount () {
      console.log(12345)
      console.log(this.props)
        this.props.setForm(this.props.form)
        this.getLocations()
  }
    getLocations = async () => {
        console.log("获取检测点")
        // 在发请求前, 显示loading
        this.setState({loading: true})
        const result = await reqLocations()
        // 在请求完成后, 隐藏loading
        this.setState({loading: false})
        if (result.code===200) {
            this.setState({
                locations:result.data.records
            })
            console.log(result.data)
        }
    }

  render() {
    const {Person} = this.props
      console.log("Person:")
      console.log(Person)
      console.log(this.props)
    const { getFieldDecorator } = this.props.form
    // 指定Item布局的配置对象
    const formItemLayout = {
      labelCol: { span: 4 },  // 左侧label的宽度
      wrapperCol: { span: 15 }, // 右侧包裹的宽度
    }
    const {locations} = this.state

    return (

      <Form {...formItemLayout}>
        <Item label='用户名'>
          {
            getFieldDecorator('name', {
              initialValue: Person.name,
                rules: [
                    {type: 'string'},
                    {required: true, message: '请输入姓名'},
                    {max: 10, message: '姓名须在10个字以内'},
                    {whitespace: true, message: '用户名不能仅为空格'}
                ]
            })(
              <Input placeholder='请输入姓名'/>
            )
          }
        </Item>
        <Item label='性别'>
          {
            getFieldDecorator('sex', {
                initialValue: Person.sex,
            })(
                <Select style={{ width: 120 }}>
                  <Option value="男">男</Option>
                  <Option value="女">女</Option>
                </Select>
                // <Input placeholder='请输入性别'/>
            )
          }
        </Item>
        <Item label='检测点'>
          {
            getFieldDecorator('naLocation', {
              initialValue: Person.naLocation,
            })(
            <Select
            placeholder='状态'
            style={{width: 120}}
            allowClear={true}
            onChange={na_location => this.setState({na_location})}
            >
          {locations.map(({id,location})=>(
            <Option key={id} value={location}>{location}</Option>
            ))}
            </Select>
                // <Input placeholder='请输入性别'/>
            )
          }
        </Item>
          <Item label='工号'>
              {
                  getFieldDecorator('jobCode', {
                      initialValue: Person.jobCode,
                      rules: [
                          {type: ''},
                          {required: true, message: '请输入工号'},
                          {pattern: /^\d{6,10}$/,message: '工号为6-10个字符以内的数字',},
                          {whitespace: true, message: '工号不能仅为空格'}
                      ]
                  })(
                      <Input placeholder='请输入工号'/>
                  )
              }
          </Item>

      </Form>
    )
  }
}

export default Form.create()(NastaffForm)