<template>
  <div class="flow-info">
    <div class="row">
      <div class="column-6 chart" ref="flowBar"></div>
      <div class="column-6 chart" ref="flowBroken"></div>
    </div>
    <div class="row">
      <div class="column-12">
        <h5>流表</h5>
        <table class="flow-table">
          <thead>
          <tr>
            <td class="center">ID</td>
            <td class="center">匹配域</td>
            <td class="center">动作</td>
            <td class="center">优先级</td>
            <td class="center">持续时间</td>
            <td class="center">计数</td>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(flow, index) in flowInfo">
            <td class="center">{{ index }}</td>
            <td>
              <template v-if="isEmptyObject(flow.match)">
                通配
              </template>
              <template v-else>
                <p v-if="flow.match.dl_src">源MAC: {{ flow.match.dl_src}}</p>
                <p v-if="flow.match.dl_dst">目的MAC: {{ flow.match.dl_dst}}</p>
                <p v-if="flow.match.nw_src">源IP: {{ flow.match.nw_src}}</p>
                <p v-if="flow.match.nw_src">目的IP: {{ flow.match.nw_dst}}</p>
                <p v-if="flow.match.tp_src">源端口: {{ flow.match.tp_src}}</p>
                <p v-if="flow.match.tp_dst">目的端口: {{ flow.match.tp_dst}}</p>
                <p v-if="flow.match.in_port">入端口: {{ flow.match.in_port}}</p>
              </template>
            </td>
            <td>{{ flow.actions }}</td>
            <td class="center">{{ flow.priority }}</td>
            <td class="center">{{ flow.duration_sec }}</td>
            <td class="center">{{ flow.byte_count }}</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
<script>
  import echarts from 'echarts'
  export default {
    name: 'flowInfo',
    props: ['dpid'],
    data: function () {
      return {
        flowInfo: [],
        flowList: [],
        flowCount: [],
        flowBar: {},
        flowTimer: 0
      }
    },
    mounted: function () {
      this.initChart()
      this.getFlow()
      this.flowTimer = setInterval(() => this.getFlow(), 2000)
    },
    beforeDestroy: function () {
      clearInterval(this.flowTimer)
    },
    methods: {
      getFlow () {
        Promise.all([this.$ajax.get(`/traffic/stats/flow/${this.dpid}`), this.$ajax.get(`/traffic/speed/flow/${this.dpid}`)])
          .then(([flowData, flowSpeedData]) => {
            this.assignFlowInfo(flowData)
            this.drawFlowBroken(flowSpeedData)
          })
      },
      assignFlowInfo: function (flowData) {
        this.flowInfo.splice(0)
        this.flowInfo.push(...flowData.data[this.dpid])
        this.drawFlowBar()
      },
      // 初始化图表，配置基本设置（已完成柱状图初始化，折线图初始化有待完成）
      initChart: function () {
        this.flowBar = echarts.init(this.$refs.flowBar)
        this.flowBroken = echarts.init(this.$refs.flowBroken)
        const optionBar = {
          title: {
            text: '流表匹配数据包数目',
            textStyle: {
              fontSize: 15
            },
            left: 'center',
            top: '10'
          },
          color: ['rgb(25, 183, 207)'],
          tooltip: {},
          legend: {
            top: '35',
            left: 'right',
            data: ['匹配流表数据包']
          },
          yAxis: {},
          xAxis: {
            data: []
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          series: [{
            name: '匹配流表数据包',
            type: 'bar',
            barMaxWidth: 50,
            data: []
          }]
        }
        this.flowBar.setOption(optionBar)
      },
      // 使用数据更新图表（柱状图）
      drawFlowBar: function () {
        this.flowBar.setOption({
          xAxis: {
            data: this.flowInfo.map((item, index) => index)
          },
          series: [{
            name: '匹配流表数据包',
            type: 'bar',
            barMaxWidth: 50,
            data: this.flowInfo.map((item) => item.byte_count)
          }]
        })
      },
      // 使用数据更新图表（折线图）
      drawFlowBroken (flowSpeedData) {
        this.flowBroken.clear()
        // 流表项时刻变化，echart使用内容合并的方式来更新数据，因此需要将原有数据清空后，重新赋值
        const optionBroken = {
          title: {
            text: '流表匹配数据包速率',
            textStyle: {
              fontSize: 15
            },
            left: 'center',
            top: '10'
          },
          legend: {
            top: '35',
            left: 'right'
          },
          xAxis: {
            type: 'category',
            splitLine: {
              show: false
            },
            axisLabel: {
              show: false
            },
            data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
          },
          yAxis: {
            type: 'value'
          },
          animation: false,
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          }
        }
        const flowSpeed = flowSpeedData.data[this.dpid]
        const data = optionBroken.legend.data = []
        const series = optionBroken.series = []
        for (let [key, value] of this.flowInfo.entries()) {
          const match = value.match
          flowSpeed.forEach((item) => {
            data.push('flow' + key)
            const speedMatch = item.match
            if (speedMatch['nw_src'] === match['nw_src'] && speedMatch['nw_dst'] === match['nw_dst'] && speedMatch['nw_proto'] === match['nw_proto'] && speedMatch['tp_src'] === match['tp_src'] && speedMatch['tp_dst'] === item['tp_dst']) {
              series.push({name: 'flow' + key, type: 'line', smooth: true, data: item.speed})
            }
          })
        }
        this.flowBroken.setOption(optionBroken)
      },
      isEmptyObject (obj) {
        return JSON.stringify(obj) === '{}'
      }
    }
  }
</script>

<style scoped lang="less">

  .flow-info {
    h5 {
      font-size: 1.3rem;
      margin:20px;
    }
    .chart {
      min-height: 350px;
    }
    .flow-table td:nth-child(1) {
      width: 5%;
    }
    .flow-table td:nth-child(2) {
      width: 40%;
    }
    .flow-table td:nth-child(3) {
      width: 34%;
    }
    .flow-table td:nth-child(4) {
      width: 5%;
    }
    .flow-table td:nth-child(5) {
      width: 8%;
    }
    .flow-table td:nth-child(6) {
      width: 8%;
    }
  }
</style>
