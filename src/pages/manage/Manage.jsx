import React, {Component} from 'react'
import {
    Card,
    Button,
    Table,
    Modal,
    message, Icon, Input
} from 'antd'
import {reqAddOrUpdateManage, reqDeleteManage, reqManage, reqManages,} from '../../api'
import './manage.less'
import * as PropTypes from "prop-types";
import LinkButton from "../../components/link-button";
import ManegeForm from "./manage-form";


function Space(props) {
    return null;
}

Space.propTypes = {children: PropTypes.node};

/*
管理员路由
 */
export default class Manage extends Component {

    state = {
        loading: false, // 是否正在获取数据中
        records: [], // 所有用户列表
        isShow: false, // 是否显示确认框
        searchName: '', // 搜索的关键字
    }

  initColumns = () => {
    this.columns = [
      {
        title: '姓名',
        dataIndex: 'name',
        align: 'center'
      },
      {
        title: '性别',
        dataIndex: 'gender',
        align: 'center'
      },
      {
        title: '邮箱',
        dataIndex: 'email',
          align: 'center'
      },
      {
        title: '联系方式',
        dataIndex: 'telephone',
          align: 'center'
      },{
            title: '操作',
            align: 'center',
            width:'180px',
            render: (manage) => (
                <span>
            <LinkButton onClick={() => this.showUpdate(manage)}>
              <Icon type='edit' style={{width:'40px', fontSize: '18px', color: 'rgba(72,114,114,0.65)'}}/>
              </LinkButton>
            <LinkButton onClick={() => this.deleteManage(manage)}>
              <Icon type='delete' style={{width:'60px', fontSize: '18px', color: 'rgba(72,114,114,0.65)'}}/>
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
        this.manage = null // 去除前面保存的manege
        this.setState({isShow: true})
    }

    /*
    显示修改界面
     */
    showUpdate = (manage) => {
        this.manage = manage // 保存manege
        this.setState({
            isShow: true
        })
    }

    /*
  删除指定用户
   */
    deleteManage = (manage) => {
        Modal.confirm({
            title: `确认删除${manage.name}吗?`,
            onOk: async () => {
                const result = await reqDeleteManage(manage.id)
                if(result.code===200) {
                    message.success('删除管理员成功!')
                    this.getManages()
                }
            }
        })
    }

    /*
    添加/更新用户
     */
    addOrUpdateManage = async () => {

        // 1. 收集输入数据
        const manage = this.form.getFieldsValue()

        this.form.resetFields()

        // 如果是更新, 需要给user指定id属性
        if (this.manage) {
            manage.id = this.manage.id
            if (manage.email.trim().length === 0 || manage.gender.trim().length === 0 || manage.name.trim().length === 0 || manage.telephone.trim().length === 0) {
                message.warning("请填写完整的数据信息")
            } else {
                // 2. 提交添加的请求
                console.log("提交添加的请求")
                const result = await reqAddOrUpdateManage(manage)
                // 3. 更新列表显示
                if (result.code === 200) {
                    message.success('修改成功')
                    this.setState({isShow: false})
                    this.getManages()
                }
            }
        }else {
            if (manage.email === undefined || manage.gender === undefined || manage.name === undefined || manage.password === undefined || manage.telephone === undefined) {
                message.warning("请填写完整的数据信息")
            } else {
                // 2. 提交添加的请求
                console.log("提交添加的请求")
                const result = await reqAddOrUpdateManage(manage)
                // 3. 更新列表显示
                if (result.code === 200) {
                    message.success('添加管理员成功')
                    this.setState({isShow: false})
                    this.getManages()
                }
            }
        }

    }

    getManages = async () => {
        // 在发请求前, 显示loading
        this.setState({loading: true})
        const result = await reqManages()
        // 在请求完成后, 隐藏loading
        this.setState({loading: false})
        if (result.code===200) {
            const {records} = result.data
            this.setState({
                records
            })
        }
    }

    searchManage = async () => {
        this.setState({loading: true}) // 显示loading

        const {searchName} = this.state
        // 如果搜索关键字有值, 说明我们要做搜索分页
        let result
        if (searchName) {
            result = await reqManage(searchName)
            this.setState({loading: false}) // 隐藏loading
            if (result && result.code === 200) {
                const {records} = result.data
                this.setState({
                    records
                })
            }
        }else {
            this.getManages()
            message.warning("请输入查询名字")
        }

    }

    UNSAFE_componentWillMount () {
        this.initColumns()
    }

    componentDidMount () {
        this.getManages()
    }

  render() {
      const {records, isShow,loading,searchName} = this.state
      const manage = this.manage || {}

      const title = (
          <span>
        <Input

            placeholder='姓名'
            style={{width: 150, margin: '0 15px'}}
            value={searchName}
            onChange={event => this.setState({searchName: event.target.value})}
            allowClear={true}//清楚按钮
            // suffix={<Icon type="close" className="site-form-item-icon" onClick={()=>this.setState({searchName:''})}
            //>}

        />
        <Button type='primary' onClick={() => this.searchManage()}>搜索</Button>
        </span>

      )
      const extra=(
          <Button type='primary' onClick={this.showAdd}>
              <Icon type='plus'/>
              创建管理员
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
                  title={manage.id ? '修改用户' : '添加用户'}
                  visible={isShow}
                  onOk={this.addOrUpdateManage}
                  onCancel={() => {
                      this.form.resetFields()
                      this.setState({isShow: false})
                  }}
              >
                  <ManegeForm
                      setForm={form => this.form = form}
                      manage={manage}
                  />
              </Modal>

          </Card>
      )
  }
}