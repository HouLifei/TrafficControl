<template>
  <div class="topology-content">
    <h4>网络拓扑</h4>
    <div ref="topology" id="topology"></div>
  </div>
</template>
<script>
import swal from 'sweetalert'
import echarts from 'echarts'
export default {
  name: 'topology',
  data: function () {
    return {
      topoChart: {}
    }
  },
  mounted: function () {
    this.initTopology()
    this.getTopology()
    this.updateTopology()
  },
  methods: {
    getTopology: function () {
      Promise.all([this.$ajax.get('/topology/switches'), this.$ajax.get('/topology/hosts'), this.$ajax.get('/topology/links')])
        .then(([switches, hosts, links]) => {
          const data = {nodes: [], edges: []}
          const nodeLink = {}
          for (let key of switches.data) {
            data.nodes.push({id: key.dpid, type: 'switch', name: switchMap[key.dpid]})
          }
          for (let key of hosts.data) {
            if (key.ipv4.length > 0) {
              const switchName = switchMap[key.port.dpid]
              const hostName = hostMap[key.ipv4[0]]
              data.nodes.push({id: key.ipv4[0], type: 'host', name: hostName})
              data.edges.push({source: key.port.dpid, target: key.ipv4[0]})
              if (nodeLink[switchName]) {
                nodeLink[switchName].push(`${switchName}-${parseInt(key.port.port_no)}--${hostName}-0`)
              } else {
                nodeLink[switchName] = [`${switchName}-${parseInt(key.port.port_no)}--${hostName}-0`]
              }
            }
          }
          for (let key of links.data) {
            const switchName = switchMap[key.src.dpid]
            data.edges.push({source: key.src.dpid, target: key.dst.dpid})
            if (nodeLink[switchName]) {
              nodeLink[switchName].push(`${switchName}-${parseInt(key.src.port_no)}--${switchMap[key.dst.dpid]}-${parseInt(key.dst.port_no)}`)
            } else {
              nodeLink[switchName] = [`${switchName}-${parseInt(key.src.port_no)}--${switchMap[key.dst.dpid]}-${parseInt(key.dst.port_no)}`]
            }
          }
          return [data, nodeLink]
        }).then(result => {
          this.showTopology(...result)
        }).catch(function (error) {
          console.log(error)
        })
    },
    initTopology: function () {
      this.topoChart = echarts.init(this.$refs.topology)
      const options = {
        animation: false,
        tooltip: {},
        series: [
          {
            type: 'graph',
            layout: 'force',
            force: {
              layoutAnimation: false,
              repulsion: 100,
              edgeLength: 100
            },
            hoverAnimation: false,
            focusNodeAdjacency: true,
            draggable: true,
            nodeScaleRatio: 0,
            roam: true,
            lineStyle: {
              normal: {
                width: 1,
                smooth: true,
                opacity: 0.7
              }
            },
            label: {
              normal: {
                position: 'bottom',
                show: true,
                color: '#000',
                distance: 2
              }
            },
            tooltip: {
              position: 'right'
            }
          }
        ]
      }
      this.topoChart.setOption(options)
    },
    showTopology: function (data, nodeLink) {
      const options = {
        series: [
          {
            type: 'graph',
            data: data.nodes.map(function (node) {
              const imgUrl = 'image://' + (node.type === 'switch' ? require('../assets/img/switch.png') : require('../assets/img/host.png'))
              const size = node.type === 'switch' ? [50, 25] : [50, 50]
              return {
                id: node.id,
                name: node.name,
                symbol: imgUrl,
                symbolSize: size,
                itemStyle: {
                  normal: {
                    opacity: 0.7,
                    color: '#000'
                  }
                }
              }
            }),
            edges: data.edges.map(function (edge) {
              return {
                source: edge.source,
                target: edge.target,
                lineStyle: {
                  normal: {
                    color: '#000'
                  }
                }
              }
            }),
            tooltip: {
              formatter: function (params) {
                const name = params.data.name
                const links = nodeLink[name]
                if (links) {
                  return `${name}<br>dpid: ${params.data.id}<br>连接关系<br>${links.join('<br>')}`
                } else {
                  return `${name}<br>ip: ${params.data.id}`
                }
              }
            }
          }
        ]
      }
      this.topoChart.setOption(options)
    },
    updateTopology: function () {
      const socket = new WebSocket(wsTopoUrl)
      console.log('test')
      let timer = 0
      socket.onopen = () => {
        console.log('socket open')
      }
      socket.onmessage = (e) => {
        const data = JSON.parse(e.data)
        if (timer !== 0) {
          clearTimeout(timer)
        }
        timer = setTimeout(() => {
          this.getTopology()
          if (data.method === 'event_link_delete') {
            swal({
              title: '注意',
              text: '链路发生故障',
              icon: 'warning'
            })
          }
        }, 1000)
        socket.send(JSON.stringify({
          'id': data.id,
          'jsonrpc': data.jsonrpc,
          'result': ''
        }))
      }
      socket.onclose = () => {
        console.log('socket close')
      }
      socket.onerror = () => {
        console.log('error')
      }
    }
  }
}
</script>
<style lang="less">
  .topology-content {
    h4 {
      font-size: 1.5rem;
      margin-bottom: 15px;
      color: #5eb95e;
    }
    #topology {
      width: 400px;
      height: 600px;
    }
  }
</style>
