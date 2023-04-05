import React, {Component, memo} from 'react'
import {
  Card,
  Button,
  Table,
  Modal,
  message, Input, Icon
} from 'antd'
import './user.less'
import {formateDate} from "../../utils/dateUtils"
import LinkButton from "../../components/link-button/index"
import {reqDeleteUser, reqUsers, reqAddOrUpdateUser, reqUser} from "../../api/index";
import UserForm from './user-form'
import * as PropTypes from "prop-types";
import memoryUtils from "../../utils/memoryUtils";

function Space(props) {
  return null;
}

Space.propTypes = {children: PropTypes.node};



/*
用户路由
 */
export default class User extends Component {

  state = {
    loading: false, // 是否正在获取数据中
    records: [], // 所有用户列表
    isShow: false, // 是否显示确认框
    searchName: '', // 搜索的关键字
  }

  initColumns = () => {
    this.columns = [
      {
        title: '用户名',
        dataIndex: 'username',
        align: 'center'
      },
      {
        title: '性别',
        dataIndex: 'gender',
        align: 'center'

      },
      {
        title: '电话',
        dataIndex: 'phone'
        ,
        align: 'center'
      },
      {
        title: '创建时间',
        dataIndex: 'creatTime',
        align: 'center',
        render: formateDate
      },
      {
        title: '地址',
        dataIndex: 'address',
        align: 'center'
      },
      {
        title: '操作',
        align: 'center',
        width: '180px',
        render: (user) => (
            <span>
            <LinkButton onClick={() => this.showUpdate(user)}>
              <Icon type='edit' style={{width: '40px', fontSize: '18px', color: 'rgba(72,114,114,0.65)'}}/>
              </LinkButton>
            <LinkButton onClick={() => this.deleteUser(user)}>
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
    this.user = null // 去除前面保存的user
    this.setState({isShow: true})
  }

  /*
  显示修改界面
   */
  showUpdate = (user) => {
    this.user = user // 保存user
    this.setState({
      isShow: true
    })
  }

  /*
  删除指定用户
   */
  deleteUser = (user) => {
    if (memoryUtils.isAdmin) {
      Modal.confirm({
        title: `确认删除${user.username}吗?`,
        onOk: async () => {
          const result = await reqDeleteUser(user.id)
          if (result.code === 200) {
            message.success('删除用户成功!')
            this.getUsers()
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
  addOrUpdateUser = async () => {
    if (memoryUtils.isAdmin) {
    // 1. 收集输入数据
    const user = this.form.getFieldsValue()
    this.form.resetFields()
    // 如果是更新, 需要给user指定id属性
    if (this.user) {
      user.id = this.user.id
      if (user.username.trim().length === 0 || user.gender.trim().length === 0 || user.phone.trim().length === 0 || user.address.trim().length === 0) {
        message.warning("请填写完整的数据信息")
      } else {
        // 2. 提交添加的请求
        console.log("提交添加的请求")
        const result = await reqAddOrUpdateUser(user)
        // 3. 更新列表显示
        if (result.code === 200) {
          message.success(`${this.user ? '修改' : '添加'}用户成功`)
          this.setState({isShow: false})

          this.getUsers()
        }
      }
    } else {
      if (user.password === undefined || user.username === undefined || user.gender === undefined || user.phone === undefined || user.address === undefined) {
        message.warning("请填写完整的数据信息")
      } else {
        // 2. 提交添加的请求
        console.log("提交添加的请求")
        const result = await reqAddOrUpdateUser(user)
        // 3. 更新列表显示
        if (result.code === 200) {
          message.success(`${this.user ? '修改' : '添加'}用户成功`)
          this.setState({isShow: false})

          this.getUsers()
        }
      }
    }
  }else {
      message.warning("您不是管理员")
    }

}

  getUsers = async () => {
    // 在发请求前, 显示loading
    this.setState({loading: true})
    const result = await reqUsers()
    // 在请求完成后, 隐藏loading
    this.setState({loading: false})
    if (result.code===200) {
      const {records} = result.data
      this.setState({
        records
      })
    }
  }

  searchUser = async () => {
    this.setState({loading: true}) // 显示loading

    const {searchName} = this.state
    // 如果搜索关键字有值, 说明我们要做搜索分页
    let result
    if (searchName) {
      result = await reqUser(searchName)
      this.setState({loading: false}) // 隐藏loading
      if (result && result.code === 200) {
        const {records} = result.data
        this.setState({
          records
        })
      }
    }else {
      this.getUsers()
      message.warning("请输入查询名字")
    }

  }


  UNSAFE_componentWillMount () {
    this.initColumns()
  }

  componentDidMount () {
    this.getUsers()
  }


  render() {

    const {records, isShow,loading,searchName} = this.state
    const user = this.user || {}

    const title = (
        <span>
        <Input

            placeholder='用户名'
            style={{width: 150, margin: '0 15px'}}
            value={searchName}
            onChange={event => this.setState({searchName: event.target.value})}
            allowClear={true}//清楚按钮
            // suffix={<Icon type="close" className="site-form-item-icon" onClick={()=>this.setState({searchName:''})}
            // />}

        />
        <Button type='primary' onClick={() => this.searchUser()}>搜索</Button>
        </span>

    )
    const extra=(
        <Button type='primary' onClick={this.showAdd}>
          <Icon type='plus'/>
          创建用户
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
          title={user.id ? '修改用户' : '添加用户'}
          visible={isShow}
          onOk={this.addOrUpdateUser}
          onCancel={() => {
            this.form.resetFields()
            this.setState({isShow: false})
          }}
        >
          <UserForm
            setForm={form => this.form = form}
            user={user}
          />
        </Modal>

      </Card>
    )
  }
}