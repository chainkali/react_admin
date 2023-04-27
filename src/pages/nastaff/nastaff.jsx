import React, {Component} from 'react'
import {
    Card,
    Button,
    Table,
    Modal,
    message, Input, Icon, Select
} from 'antd'
import './nastaff.less'
import LinkButton from "../../components/link-button/index"
import {
    reqPersons,
    reqPerson, reqDeletePerson, reqAddOrUpdatePerson, reqLocations
} from "../../api/index";
import * as PropTypes from "prop-types";
import NastaffForm from "./nastaff-form";

function Space(props) {
    return null;
}

Space.propTypes = {children: PropTypes.node};


/*
用户路由
 */
export default class Nastaff extends Component {

    state = {
        loading: false, // 是否正在获取数据中
        records: [], // 所有用户列表
        isShow: false, // 是否显示确认框
        name: '', // 搜索名字
        na_location: '', // 检测点
        locations: [],// 检测点列表
        selectedLocation: null,
        total:0,
        currentPage:1,
        page: 1,
        pageSize: 5,
        isSearch:false
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
                dataIndex: 'sex',
                align: 'center'

            },
            {
                title: '检测点',
                dataIndex: 'naLocation',
                align: 'center'
            },
            {
                title: '工号',
                dataIndex: 'jobCode',
                align: 'center'
            },
            {
                title: '操作',
                align: 'center',
                width:'180px',
                render: (Person) => (
                    <span>
              <LinkButton onClick={() => this.showUpdate(Person)}>
                <Icon type='edit' style={{width:'40px', fontSize: '18px', color: 'rgba(72,114,114,0.65)'}}/>
              </LinkButton>
              <LinkButton onClick={() => this.deletePerson(Person)}>
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
        this.Person = null // 去除前面保存的Person
        this.setState({isShow: true})
    }

    /*
    显示修改界面
     */
    showUpdate = (Person) => {
        this.Person = Person // 保存Person
        console.log(this.Person)
        console.log(Person)
        this.setState({
            isShow: true
        })
    }

    /*
    删除指定用户
     */
    deletePerson = (Person) => {
        Modal.confirm({
            title: `确认删除${Person.name}吗?`,
            onOk: async () => {
                const result = await reqDeletePerson(Person.id)
                if(result.code===200) {
                    message.success('删除记录成功!')
                    this.getPersons(1,5)
                }
            }
        })
    }

    /*
    添加/更新用户
     */
    addOrUpdatePerson = async () => {
        // 1. 收集输入数据
        const Person = this.form.getFieldsValue()
        this.form.resetFields()
        // 如果是更新, 需要给Person指定id属性
        if (this.Person) {
            Person.id = this.Person.id
        }
        console.log(Person)

        if (Person.naLocation === undefined || Person.name === undefined || Person.sex === undefined ){
            message.warning("请填写完整的数据信息")
        }else {
            // 2. 提交添加的请求
            console.log("提交添加的请求")
            const result = await reqAddOrUpdatePerson(Person)
            // 3. 更新列表显示
            if(result.code===200) {
                message.success(Person.id?'更新数据成功':'添加数据成功')
                this.setState({isShow: false})
                this.getPersons(1,5)
            }
        }
    }

    getPersons = async (page,pageSize) => {
        // 在发请求前, 显示loading
        this.setState({loading: true})
        const result = await reqPersons(page,pageSize)
        // 在请求完成后, 隐藏loading
        this.setState({loading: false})
        if (result.code===200) {
            const {records,total,current} = result.data
            this.setState({
                records,total,currentPage:current,isSearch:false
            })
        }
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



    searchPerson = async (page,pageSize) => {
        this.setState({loading: true}) // 显示loading
        if (page===undefined||pageSize===undefined){
            page=this.state.page
            pageSize=this.state.pageSize
        }
        const {name,na_location} = this.state
        // 如果搜索关键字有值, 说明我们要做搜索分页
        let result
        if (name||na_location) {
            result = await reqPerson(name,na_location,page,pageSize)
            this.setState({loading: false}) // 隐藏loading
            if (result && result.code === 200) {
                const {records,total,current} = result.data
                this.setState({
                    records,total,currentPage:current,isSearch:true
                })
            }
        }else {
            this.getPersons(1,5)
            this.setState({isSearch:false}) // 显示loading
            message.warning("请输入查询关键字")
        }

    }


    UNSAFE_componentWillMount () {
        this.initColumns()
        this.getLocations()
    }

    componentDidMount () {
        this.getPersons(1,5)
    }

    render() {
    const {records, isShow,loading,name,locations,total,currentPage,isSearch} = this.state
    const { Option } = Select;
    const Person = this.Person || {}
    const title = (
        <div>
            <Input
                placeholder='名称'
                style={{width: 150, margin: '0 2px'}}
                value={name}
                onChange={event => this.setState({name: event.target.value})}
                allowClear={true}//清楚按钮
                // suffix={<Icon type="close" className="site-form-item-icon" onClick={()=>this.setState({searchName:''})}
                // />}

            />
            <Select
                placeholder='检测点'
                style={{width: 150, margin: '0 2px'}}
                allowClear={true}
                onChange={na_location => this.setState({na_location})}
            >
                {locations.map(({id,location})=>(
                    <Option key={id} value={location}>{location}</Option>
                    ))}
            </Select>
            <Button type='primary' onClick={() => this.searchPerson()}>搜索</Button>
        </div>

    )
    const extra=(
        <Button type='primary' onClick={this.showAdd}>
            <Icon type='plus'/>
            添加医护人员
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
                        this.getPersons(page,pageSize)
                    }else {
                        this.searchPerson(page,pageSize)
                    }
                }}}
            size="middle"
        />

        <Modal
            title={Person.id ? '修改数据' : '添加医护人员'}
            visible={isShow}
            onOk={this.addOrUpdatePerson}
            onCancel={() => {
                this.form.resetFields()
                this.setState({isShow: false})
            }}
        >
            <NastaffForm
                setForm={form => this.form = form}
                Person={Person}
            />
        </Modal>
    </Card>
    )
}
}
