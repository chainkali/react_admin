import React, {Component} from 'react'
import {
  Card,
  Button,
  Table,
  Modal,
  message, Input, Icon, Select
} from 'antd'
import './naLocation.less'
import { formateDate1} from "../../utils/dateUtils"
import LinkButton from "../../components/link-button/index"
import {
  reqNaLocations,
  reqNaLocation, reqDeleteNaLocation, reqAddOrUpdateNaLocation
} from "../../api/index";
import NaRecordForm from './naLocation-form'
import * as PropTypes from "prop-types";
import memoryUtils from "../../utils/memoryUtils";

function Space(props) {
  return null;
}

Space.propTypes = {children: PropTypes.node};


/*
用户路由
 */
export default class NaLocation extends Component {

  state = {
    loading: false, // 是否正在获取数据中
    records: [], // 所有用户列表
    isShow: false, // 是否显示确认框
    searchName: '', // 搜索名字
    searchStatus: '', // 搜索的状态
  }

  initColumns = () => {
    this.columns = [
      {
        title: '检测点',
        dataIndex: 'location',
        align: 'center'
      },
      {
        title: '使用状态',
        dataIndex: 'status',
        align: 'center'

      },
      {
        title: '开始时间',
        dataIndex: 'startDate',
        align: 'center',
        render: formateDate1
      },
      {
        title: '结束时间',
        dataIndex: 'endDate',
        align: 'center',
        render: formateDate1

      },
      {
        title: '操作',
        align: 'center',
        width: '180px',
        render: (naLocation) => (
            <span>
              <LinkButton onClick={() => this.showUpdate(naLocation)}>
                <Icon type='edit' style={{width: '40px', fontSize: '18px', color: 'rgba(72,114,114,0.65)'}}/>
              </LinkButton>
              <LinkButton onClick={() => this.deleteNaLocation(naLocation)}>
                <Icon type='delete' style={{width: '60px', fontSize: '18px', color: 'rgba(72,114,114,0.65)'}}/>
              </LinkButton>
           </span>
        )
      },
    ]
  }

  /*
  显示添加界面
   */
  showAdd = () => {
    this.naLocation = null // 去除前面保存的naLocation
    this.setState({isShow: true})
  }

  /*
  显示修改界面
   */
  showUpdate = (naLocation) => {
    this.naLocation = naLocation // 保存naLocation
    this.setState({
      isShow: true
    })
  }

  /*
  删除指定用户
   */
  deleteNaLocation = (naLocation) => {
    if (memoryUtils.isAdmin){
    Modal.confirm({
      title: `确认删除${naLocation.location}吗?`,
      onOk: async () => {
        const result = await reqDeleteNaLocation(naLocation.id)
        if (result.code === 200) {
          message.success('删除记录成功!')
          this.getNaRecords()
        }
      }
    })
  }else {
      message.warning("您不是管理员")
    }}

  /*
  添加/更新用户
   */
  addOrUpdateNaLocation = async () => {
    if (memoryUtils.isAdmin) {
    // 1. 收集输入数据
    const naLocation = this.form.getFieldsValue()
    this.form.resetFields()
    // 如果是更新, 需要给naLocation指定id属性
    if (this.naLocation) {
      naLocation.id = this.naLocation.id
    }
    if (naLocation.location === undefined || naLocation.status === undefined || naLocation.startDate === undefined || naLocation.endDate === undefined) {
      message.warning("请填写完整的数据信息")
    } else {

      // 2. 提交添加的请求
      console.log("提交添加的请求")
      const result = await reqAddOrUpdateNaLocation(naLocation)
      // 3. 更新列表显示
      if (result.code === 200) {
        message.success('添加数据成功')
        this.setState({isShow: false})
        this.getNaRecords()
      }
    }
  }else {
      message.warning("您不是管理员")
    }
}

  getNaRecords = async () => {
    // 在发请求前, 显示loading
    this.setState({loading: true})
    const result = await reqNaLocations()
    // 在请求完成后, 隐藏loading
    this.setState({loading: false})
    if (result.code===200) {
      const {records} = result.data
      this.setState({
        records
      })
    }
  }

  searchNaLocation = async () => {
    this.setState({loading: true}) // 显示loading

    const {searchName,searchStatus} = this.state
    // 如果搜索关键字有值, 说明我们要做搜索分页
    let result
    if (searchName||searchStatus) {
      result = await reqNaLocation(searchName,searchStatus)
      this.setState({loading: false}) // 隐藏loading
      if (result && result.code === 200) {
        const {records} = result.data
        this.setState({
          records
        })
      }
    }else {
      this.getNaRecords()
      message.warning("请输入查询关键字")
    }

  }


  UNSAFE_componentWillMount () {
    this.initColumns()
  }

  componentDidMount () {
    this.getNaRecords()
  }

  render() {

    const {records, isShow,loading,searchName,searchStatus} = this.state
    const { Option } = Select;
    const naLocation = this.naLocation || {}
    const title = (
        <div>
        <Input
            placeholder='名称'
            style={{width: 150, margin: '0 2px'}}
            value={searchName}
            onChange={event => this.setState({searchName: event.target.value})}
            allowClear={true}//清楚按钮
            // suffix={<Icon type="close" className="site-form-item-icon" onClick={()=>this.setState({searchName:''})}
            // />}

        />
          <Select
              placeholder='状态'
              style={{width: 150, margin: '0 2px'}}
              allowClear={true}
              onChange={searchStatus => this.setState({searchStatus})}
          >
            <Option value="使用中" >使用中</Option>
            <Option value="已停用" >已停用</Option>
          </Select>
        <Button type='primary' onClick={() => this.searchNaLocation()}>搜索</Button>
        </div>

    )
    const extra=(
        <Button type='primary' onClick={this.showAdd}>
          <Icon type='plus'/>
          添加检测点
        </Button>
    )

    return (
      <Card title={title} extra={extra} >
        <Table
          bordered
          rowKey='id'
          loading={loading}
          dataSource={records}
          columns={this.columns}
          pagination={{defaultPageSize: 5}}
          size="middle"
        />

        <Modal
          title={'添加数据'}
          visible={isShow}
          onOk={this.addOrUpdateNaLocation}
          onCancel={() => {
            this.form.resetFields()
            this.setState({isShow: false})
          }}
        >
          <NaRecordForm
            setForm={form => this.form = form}
            naLocation={naLocation}
          />
        </Modal>

      </Card>
    )
  }
}