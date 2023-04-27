import React, {Component} from 'react'
import {
  Card,
  Button,
  Table,
  Modal,
  message, Input, Icon
} from 'antd'
import './goods.less'
import LinkButton from "../../components/link-button/index"
import {reqDeleteGood, reqGoods, reqAddOrUpdateGood, reqGood} from "../../api/index";
import GoodForm from './goods-form'
import * as PropTypes from "prop-types";

function Space(props) {
  return null;
}

Space.propTypes = {children: PropTypes.node};



/*
用户路由
 */
export default class Goods extends Component {

  state = {
    loading: false, // 是否正在获取数据中
    records: [], // 所有物品列表
    isShow: false, // 是否显示确认框
    searchName: '', // 搜索的关键字
    page: 1,
    pageSize: 5,
    total:0,
    currentPage:1,
    isSearch:false
  }

  initColumns = () => {
    this.columns = [
      {
        title: '物资',
        dataIndex: 'name',
        align: 'center',
      },
      {
        title: '数量',
        dataIndex: 'number',
        align: 'center'

      },
      {
        title: '检测点',
        dataIndex: 'location',
        align: 'center'

      },
      {
        title: '备注',
        dataIndex: 'note',
        align: 'center'
      },
      {
        title: '操作',
        align: 'center',
        width:'400px',
        render: (good,flag) => (
          <span>
            <LinkButton onClick={() => this.showUpdate(good)}>
              <Icon type='edit' style={{width:'40px', fontSize: '18px', color: 'rgba(72,114,114,0.65)'}}/>
              </LinkButton>
            <LinkButton onClick={() => this.deleteGood(good)}>
              <Icon type='delete' style={{width:'60px', fontSize: '18px', color: 'rgba(72,114,114,0.65)'}}/>
            </LinkButton>
            <LinkButton onClick={() => this.UpdateGoodNumber(good,flag=true)}>
              <Icon type='plus-circle' style={{width:'60px', fontSize: '18px', color: 'rgba(72,114,114,0.65)'}}/>
            </LinkButton>
            <LinkButton onClick={() => this.UpdateGoodNumber(good,flag=false)}>
              <Icon type='minus-circle' style={{width:'60px', fontSize: '18px', color: 'rgba(72,114,114,0.65)'}}/>
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
    this.good = null // 去除前面保存的good
    this.setState({isShow: true})
  }

  /*
  显示修改界面
   */
  showUpdate = (good) => {
    this.good = good // 保存good
    this.setState({
      isShow: true
    })
  }

  /*
  删除指定用户
   */
  deleteGood = (good) => {
    console.log(good)
    Modal.confirm({

      title: `确认删除${good.name}吗?`,
      onOk: async () => {
        const result = await reqDeleteGood(good.id)
        if(result.code===200) {
          message.success('删除物资成功!')
          this.getGoods(1,5)
        }
      }
    })
  }

  /*
  添加/更新物资
   */
  UpdateGoodNumber = async (good,flag) => {
    const {isSearch}=this.state
    if (flag===true){
      good.number=good.number+1
    }if (flag===false){
      if (good.number>0){
        good.number=good.number-1
      }else {
        message.warning("没啦没啦！")
        return
      }

    }
    // 如果是更新, 需要给good指定id属性
    if (this.good) {
      good.id = this.good.id
    }
    // 2. 提交添加的请求
    const result = await reqAddOrUpdateGood(good)
    // 3. 更新列表显示
    if(result.code===200) {
      message.success(`${flag ? '增加' : '减少'}物资`)
      if (!isSearch){
        this.getGoods(this.state.currentPage,5)
      }
    }
  }


  /*
  添加/更新物资
   */
  addOrUpdateGood = async () => {


    // 1. 收集输入数据
    const good = this.form.getFieldsValue()
    this.form.resetFields()
    // 如果是更新, 需要给good指定id属性
    if (this.good) {
      good.id = this.good.id
      if (good.name.trim().length === 0 || good.number.trim().length === 0 || good.note.trim().length === 0) {
        message.warning("请填写完整的数据信息")
      } else {
        // 2. 提交添加的请求
        console.log("提交添加的请求")
        const result = await reqAddOrUpdateGood(good)
        // 3. 更新列表显示
        if(result.code===200) {
          message.success(`${this.good ? '修改' : '添加'}物资成功`)
          this.setState({isShow: false})
          this.getGoods(1,5)
        }
      }
    }else {
      if (good.name === undefined || good.number === undefined || good.note === undefined) {
        message.warning("请填写完整的数据信息")
      } else {
        // 2. 提交添加的请求
        console.log("提交添加的请求")
        const result = await reqAddOrUpdateGood(good)
        // 3. 更新列表显示
        if(result.code===200) {
          message.success(`${this.good ? '修改' : '添加'}物资成功`)
          this.setState({isShow: false})
          this.getGoods(1,5)
        }
      }
    }
  }

  getGoods = async (page,pageSize) => {
    // 在发请求前, 显示loading
    this.setState({loading: true})
    const result = await reqGoods(page,pageSize)
    // 在请求完成后, 隐藏loading
    this.setState({loading: false})
    if (result.code===200) {
      const {records,total,current} = result.data
      this.setState({
        records,total,currentPage:current,isSearch:false
      })
    }
  }

  searchGood = async (page,pageSize) => {
    this.setState({loading: true}) // 显示loading
    if (page===undefined||pageSize===undefined){
      page=this.state.page
      pageSize=this.state.pageSize
    }
    const {searchName} = this.state
    // 如果搜索关键字有值, 说明我们要做搜索分页
    let result
    if (searchName) {
      result = await reqGood(searchName,page,pageSize)
      this.setState({loading: false}) // 隐藏loading
      if (result && result.code === 200) {
        const {records,total,current} = result.data
        this.setState({
          records,total,currentPage:current,isSearch:true
        })
      }
    }else {
      this.getGoods(1,5)
      message.warning("请输入查询名称")
    }

  }


  UNSAFE_componentWillMount () {
    this.initColumns()
  }

  componentDidMount () {
    this.getGoods(1,5)
  }


  render() {

    const {records, isShow,loading,searchName,total,currentPage,isSearch} = this.state
    const good = this.good || {}

    const title = (
        <span>
        <Input

            placeholder='名称'
            style={{width: 150, margin: '0 15px'}}
            value={searchName}
            allowClear={true}//清楚按钮
            onChange={event => this.setState({searchName: event.target.value})}
            // suffix={<Icon type="close" className="site-form-item-icon" onClick={()=>this.setState({searchName:''})}
            // />}

        />
        <Button type='primary' onClick={() => this.searchGood()}>搜索</Button>
        </span>

    )
    const extra=(
        <Button type='primary' onClick={this.showAdd}>
          <Icon type='plus'/>
          添加物资
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
          pagination={{defaultPageSize: 5,
            total:total,
            showTotal:(total) => `总共${total}条记录`,
            current:currentPage,
            onChange: (page, pageSize) => {
              if (!isSearch){
                this.getGoods(page,pageSize)
              }else {
                this.searchGood(page,pageSize)
              }
            }}}
          size="middle"
        />

        <Modal
          title={good.id ? '修改物资' : '添加物资'}
          visible={isShow}
          onOk={this.addOrUpdateGood}
          onCancel={() => {
            this.form.resetFields()
            this.setState({isShow: false})
          }}
        >
          <GoodForm
            setForm={form => this.form = form}
            good={good}
          />
        </Modal>

      </Card>
    )
  }
}