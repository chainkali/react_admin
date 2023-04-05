import React, {Component} from 'react'
import {
  Card,
  Button,
  Table,
  Modal,
  message, Input, Icon, Select
} from 'antd'
import './narecord.less'
import {formateDate} from "../../utils/dateUtils"
import LinkButton from "../../components/link-button/index"
import {reqDeleteNaRecord, reqNaRecords, reqAddOrUpdateNaRecord, reqNaRecord} from "../../api/index";
import NaRecordForm from './narecord-form'
import * as PropTypes from "prop-types";
import memoryUtils from "../../utils/memoryUtils";

function Space(props) {
  return null;
}

Space.propTypes = {children: PropTypes.node};


/*
用户路由
 */
export default class Narecord extends Component {

  state = {
    loading: false, // 是否正在获取数据中
    records: [], // 所有用户列表
    isShow: false, // 是否显示确认框
    searchName: '', // 搜索的关键字
    searchResult: '',
    searchSex: '',
  }

  initColumns = () => {
    this.columns = [
      {
        title: '用户名',
        dataIndex: 'name',
        align: 'center'
      },
      {
        title: '性别',
        dataIndex: 'gender',
        align: 'center'

      },
      {
        title: '身份证号',
        dataIndex: 'idcard',
        align: 'center'
      },
      {
        title: '检测时间',
        dataIndex: 'checkTime',
        align: 'center',
        render: formateDate

      },
      {
        title: '检测地点',
        dataIndex: 'naLocation',
        align: 'center',
      },
      {
        title: '检测结果',
        dataIndex: 'naResult',
        align: 'center'
      },
      {
        title: '状态',
        align: 'center',
        render: (naRecord, flag) => (
            this.MyState(naRecord)
            // {isok === '已失效' && <p>This is a p element.</p>}
            // {'p' === 'div' && <div>This is a div element.</div>}

        )
      },
      {
        title: '操作',
        align: 'center',
        width: '180px',
        render: (naRecord) => (
            <span>
            <LinkButton onClick={() => this.deleteNaRecord(naRecord)}>
              <Icon type='delete' style={{width: '60px', fontSize: '18px', color: 'rgba(72,114,114,0.65)'}}/>
            </LinkButton>
          </span>
        )
      },
    ]
  }

  MyState = (naRecord) => {
    const milliseconds = new Date(naRecord.checkTime)
    const time = new Date(Date.now() - milliseconds.getTime())
    let time1 = time / 3600000
    return (
        <div>
          {time1 > 48 && <span>已失效</span>}
          {time1 < 48 && <span>生效中(48小时内)</span>}
        </div>
    )
  }

  /*
  显示添加界面
   */
  showAdd = () => {
    this.naRecord = null // 去除前面保存的naRecord
    this.setState({isShow: true})
  }

  /*
  显示修改界面
   */
  showUpdate = (naRecord) => {
    this.naRecord = naRecord // 保存naRecord
    this.setState({
      isShow: true
    })
  }

  /*
  删除指定用户
   */
  deleteNaRecord = (naRecord) => {
    if (memoryUtils.isAdmin) {
      Modal.confirm({
        title: `确认删除${naRecord.naRecordname}吗?`,
        onOk: async () => {
          const result = await reqDeleteNaRecord(naRecord.id)
          if (result.code === 200) {
            message.success('删除记录成功!')
            this.getNaRecords()
          }
        }
      })
    } else {
      message.warning("您不是管理员")
    }
  }

  /*
  添加/更新用户
   */
  addOrUpdateNaRecord = async () => {
    if (memoryUtils.isAdmin) {


    // 1. 收集输入数据
    const naRecord = this.form.getFieldsValue()
    this.form.resetFields()
    // 如果是更新, 需要给naRecord指定id属性
    if (this.naRecord) {
      naRecord.id = this.naRecord.id
    }
    if (naRecord.name === undefined || naRecord.naResult === undefined || naRecord.naLocation === undefined || naRecord.idcard === undefined || naRecord.gender === undefined) {
      message.warning("请填写完整的数据信息")
    } else {
      // 2. 提交添加的请求
      console.log("提交添加的请求")
      const result = await reqAddOrUpdateNaRecord(naRecord)
      // 3. 更新列表显示
      if (result.code === 200) {
        message.success('添加数据成功')
        this.setState({isShow: false})
        this.getNaRecords()
      }
    }
  }else {message.warning("您不是管理员")}
}
  getNaRecords = async () => {
    // 在发请求前, 显示loading
    this.setState({loading: true})
    const result = await reqNaRecords()
    // 在请求完成后, 隐藏loading
    this.setState({loading: false})
    if (result.code===200) {
      const {records} = result.data
      this.setState({
        records
      })
    }
  }

  searchNaRecord = async () => {

    this.setState({loading: true}) // 显示loading

    const {searchName,searchResult,searchSex} = this.state
    // 如果搜索关键字有值, 说明我们要做搜索分页
    let result
    if (searchName||searchResult||searchSex) {
      result = await reqNaRecord(searchName,searchResult,searchSex)
      this.setState({loading: false}) // 隐藏loading
      if (result && result.code === 200) {
        const {records} = result.data
        this.setState({
          records
        })
      }
    }else {
      this.getNaRecords()
      message.warning("请输入查询名字")
    }

  }


  UNSAFE_componentWillMount () {
    this.initColumns()
  }

  componentDidMount () {
    this.getNaRecords()
  }

  render() {

    const {records, isShow,loading,searchName} = this.state
    const naRecord = this.naRecord || {}

    const { Option } = Select;
    const title = (
        <div>
        <Input
            placeholder='姓名'
            style={{width: 150, margin: '0 2px'}}
            value={searchName}
            onChange={event => this.setState({searchName: event.target.value})}
            allowClear={true}//清楚按钮
            // suffix={<Icon type="close" className="site-form-item-icon" onClick={()=>this.setState({searchName:''})}
            // />}

        />
          <Select
              placeholder='性别'
              // defaultValue="性别"
              style={{width: 150, margin: '0 2px'}}
              allowClear={true}
              onChange={searchSex => this.setState({searchSex})}
          >
              <Option value="男" >男</Option>
              <Option value="女" >女</Option>
         </Select>
          <Select
              placeholder='状态'
              style={{width: 150, margin: '0 2px'}}
              allowClear={true}
              onChange={searchResult => this.setState({searchResult})}
          >
            <Option value="阳性" >阳性</Option>
            <Option value="阴性" >阴性</Option>
          </Select>
        <Button type='primary' onClick={() => this.searchNaRecord()}>搜索</Button>
        </div>

    )
    const extra=(
        <Button type='primary' onClick={this.showAdd}>
          <Icon type='plus'/>
          上传记录
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
          onOk={this.addOrUpdateNaRecord}
          onCancel={() => {
            this.form.resetFields()
            this.setState({isShow: false})
          }}
        >
          <NaRecordForm
            setForm={form => this.form = form}
            naRecord={naRecord}
          />
        </Modal>

      </Card>
    )
  }
}