<template>
  <div class="port-content">
    <div class="row">
      <div class="column-7">
        <h5 class="port-title">端口带宽</h5>
        <table class="port-table">
          <thead>
          <tr>
            <td class="am-text-center">端口ID</td>
            <td>接收数据包</td>
            <td>发送数据包</td>
            <td>接收字节数</td>
            <td>发送字节数</td>
            <td>接收丢包数</td>
            <td>发送丢包数</td>
          </tr>
          </thead>
          <tbody>
          <tr v-for="port in portInfo">
            <td class="center">{{ port.port_no }}</td>
            <td>{{ port.rx_packets }}</td>
            <td>{{ port.tx_packets }}</td>
            <td>{{ port.rx_bytes }}</td>
            <td>{{ port.tx_bytes }}</td>
            <td>{{ port.rx_dropped }}</td>
            <td>{{ port.tx_dropped }}</td>
          </tr>
          </tbody>
        </table>
      </div>
      <div class="column-5">
        <div ref="portBroken" class="broken"></div>
      </div>
    </div>
  </div>

</template>

<script>
  import echarts from 'echarts'
  export default {
    name: 'portInfo',
    props: ['dpid'],
    data: function () {
      return {
        myChart: {},
        portInfo: [],
        portTimer: 0
      }
    },
    mounted: function () {
      this.initPortBroken()
      this.getPort()
      this.portTimer = setInterval(this.getPort, 1000)
    },
    beforeDestroy: function () {
      clearInterval(this.portTimer)
    },
    methods: {
      getPort () {
//        获取端口传输的字节数和带宽信息
        Promise.all([this.$ajax.get(`/traffic/stats/port/${this.dpid}`), this.$ajax.get(`/traffic/speed/port/${this.dpid}`)])
          .then(([portData, portSpeedData]) => {
            this.assignPortInfo(portData)
            this.drawPortBroken(portSpeedData)
          }).catch((e) => {
            console.log(e)
          })
      },
//     处理端口传输字节数信息
      assignPortInfo (portData) {
        this.portInfo.splice(0)
        const portInfo = portData.data[this.dpid].filter(item => item.port_no !== 'LOCAL')
        portInfo.sort((a, b) => a.port_no - b.port_no)
        this.portInfo.push(...portInfo)
      },
      // 初始化图表
      initPortBroken () {
        this.myChart = echarts.init(this.$refs.portBroken)
        const option = {
          title: {
            text: '端口带宽变化图',
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
        this.myChart.setOption(option)
      },
      drawPortBroken (portSpeedData) {
        const portSpeed = portSpeedData.data[this.dpid]
        const series = []
        const data = []
        for (let key of Object.keys(portSpeed)) {
          data.push('eth' + key)
          series.push({name: 'eth' + key, type: 'line', smooth: true, data: portSpeed[key]})
        }
        this.myChart.setOption({
          legend: {data},
          series
        })
      }
    }
  }
</script>

<style scoped lang="less">
  .port-content {
    h5 {
      font-size: 1.3rem;
      margin:20px;
    }

    .broken{
      height:400px;
    }

    .port-table {
      max-height: 290px;
      overflow: auto;
    }
  }

</style>
