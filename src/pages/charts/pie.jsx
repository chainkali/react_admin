import React, {Component} from 'react'
import {Card, message} from 'antd'
import ReactEcharts from 'echarts-for-react'
import {reqNaRecord} from "../../api";

/*
后台管理的饼图路由组件
 */
export default class Pie extends Component {
  state = {
    loading: false, // 是否正在获取数据中
    isShow: false, // 是否显示确认框
    searchResult:'',
    total:0,
    negative:0,
    positive:0,
    searchName:'',
    searchSex:'',
    positiveResult:"阳性",
    negativeResult:"阴性",

  }

  getnaResultpositive = async () => {
    console.log("图表初始化")
    // 在发请求前, 显示loading
    this.setState({loading: true})
    const {positiveResult,searchName,searchSex} = this.state
    let result
    if (positiveResult) {
      result = await reqNaRecord(searchName,positiveResult,searchSex,null,1,999999)
      this.setState({loading: false}) // 隐藏loading
      // console.log("result:")
      // console.log(result)
      if (result && result.code === 200) {
        const {total} = result.data
        this.setState({
          positive:total
        })
      }
    }else {
      message.warning("图表加载失败")
    }
  }
 getnaResultnegative = async () => {
    console.log("图表初始化")
    // 在发请求前, 显示loading
    this.setState({loading: true})
    const {negativeResult,searchName,searchSex} = this.state
    let result
    console.log("negativeResult"+negativeResult)
    if (negativeResult) {
      result = await reqNaRecord(searchName,negativeResult,searchSex,null,1,999999)
      this.setState({loading: false}) // 隐藏loading
      console.log("result:")
      console.log(result)
      if (result && result.code === 200) {
        const {total} = result.data
        // console.log("total")
        // console.log(total)
          this.setState({
            negative:total
          })
      }
    }else {
      message.warning("图表加载失败")
    }
  }

  UNSAFE_componentWillMount () {
    this.getnaResultnegative()
    this.getnaResultpositive()
  }


// 如果搜索关键字有值, 说明我们要做搜索分页




  getOption = () => {
    const {positive,negative}=this.state
    return {
      title : {
        text: '核酸检测结果',
        subtext: '纯属虚构',
        x:'center'
      },
      tooltip : {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        data: ['阳性','阴性',"总计"]
      },
      series : [
        {
          name: '访问来源',
          type: 'pie',
          radius : '55%',
          center: ['50%', '60%'],
          data:[
            {value: positive, name:'阳性'},
            {value: negative, name:'阴性'},
            {value: negative+positive, name:'总计'},
            // {value:1548, name:'搜索引擎'}
          ],
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };

  }

  getOption2 = () => {
    return {
      backgroundColor: '#2c343c',

      title: {
        text: 'Customized Pie',
        left: 'center',
        top: 20,
        textStyle: {
          color: '#ccc'
        }
      },

      tooltip : {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
      },

      visualMap: {
        show: false,
        min: 80,
        max: 600,
        inRange: {
          colorLightness: [0, 1]
        }
      },
      series : [
        {
          name:'访问来源',
          type:'pie',
          radius : '55%',
          center: ['50%', '50%'],
          data:[
            // {value:335, name:'直接访问'},
            // {value:310, name:'邮件营销'},
            // {value:274, name:'联盟广告'},
            // {value:235, name:'视频广告'},
            // {value:400, name:'搜索引擎'}
          ].sort(function (a, b) { return a.value - b.value; }),
          roseType: 'radius',
          label: {
            normal: {
              textStyle: {
                color: 'rgba(255, 255, 255, 0.3)'
              }
            }
          },
          labelLine: {
            normal: {
              lineStyle: {
                color: 'rgba(255, 255, 255, 0.3)'
              },
              smooth: 0.2,
              length: 10,
              length2: 20
            }
          },
          itemStyle: {
            normal: {
              color: '#c23531',
              shadowBlur: 200,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },

          animationType: 'scale',
          animationEasing: 'elasticOut',
          animationDelay: function (idx) {
            return Math.random() * 200;
          }
        }
      ]
    };
  }

  render() {
    return (
      <div>
        <Card title='核酸检测视图'>
          <ReactEcharts option={this.getOption()} style={{height: 300}}/>
        </Card>
        {/*<Card title='饼图二'>*/}
        {/*  <ReactEcharts option={this.getOption2()} style={{height: 300}}/>*/}
        {/*</Card>*/}
      </div>
    )
  }
}
