<template>
  <div class="topology-content">
    <h4>网络拓扑</h4>
    <div ref="topology" id="topology"></div>
  </div>
</template>
<script>
import d3 from 'd3'
import config from '@/config'
import swal from 'sweetalert'
const width = 470
const height = 600
const force = d3.layout.force().linkDistance(150).charge(-600).size([width, height])
const zoom = d3.behavior.zoom().scaleExtent([1, 3])
export default {
  name: 'topology',
  data: function () {
    return {
    }
  },
  mounted: function () {
    this.initTopology(this.$refs.topology)
    this.getTopology()
    this.updateTopology()
  },
  methods: {
    getTopology: function () {
      Promise.all([this.$ajax.get('/topology/switches'), this.$ajax.get('/topology/hosts'), this.$ajax.get('/topology/links')])
        .then(([switches, hosts, links]) => {
          const data = {nodes: [], links: []}
          const nodeList = []
          for (let key of switches.data) {
            data.nodes.push({dpid: key.dpid, type: 'switch'})
            nodeList.push(key.dpid)
          }
          for (let key of hosts.data) {
            data.nodes.push({mac: key.mac, type: 'host'})
            nodeList.push(key.mac)
            data.links.push({source: nodeList.indexOf(key.port.dpid), target: nodeList.indexOf(key.mac), source_port: parseInt(key.port.port_no)})
          }
          for (let key of links.data) {
            data.links.push({source: nodeList.indexOf(key.src.dpid), target: nodeList.indexOf(key.dst.dpid), 'source_port': parseInt(key.src.port_no)})
          }
          return data
        }).then(data => {
          this.showTopology(data)
        }).catch(function (error) {
          console.log(error)
        })
    },
    initTopology: function (id) {
      const svg = d3.select(id).append('svg')
        .attr('width', width)
        .attr('height', height)
        .attr('viewBox', `0 0 ${width} ${height}`)
        .attr('preserveAspectRatio', 'xMidYMid meet')
        .call(zoom)
      const container = this.container = svg.append('g')
      zoom.on('zoom', function () {
        const e = d3.event
        const tx = Math.min(0, Math.max(e.translate[0], width - width * e.scale))
        const ty = Math.min(0, Math.max(e.translate[1], height - height * e.scale))
        zoom.translate([tx, ty])
        container.attr('transform', `translate( ${tx}, ${ty} ), scale( ${e.scale} )`)
      })
    },
    showTopology: function (data) {
      force.nodes(data.nodes).links(data.links).start()
      this.container.selectAll('*').remove()
      const link = this.container.selectAll('line')
        .data(data.links)
        .enter().append('line')
        .style('stroke', '#000')
        .style('stroke-width', 1)

      const node = this.container.selectAll('.port_name')
        .data(data.nodes)
        .enter().append('g')
        .attr({
          'class': 'port_name',
          'cx': function (d) {
            return d.x
          },
          'cy': function (d) {
            return d.y
          }
        })
        .call(force.drag)
      node.append('image')
        .attr({
          'xlink:href': function (d) {
            if (d.type === 'switch') return require('../assets/img/switch.png')
            else return require('../assets/img/host.png')
          },
          'height': 40,
          'width': 40,
          'x': -20,
          'y': -20
        })
      node.append('text')
        .attr({
          'y': 25,
          'text-anchor': 'middle'
        })
        .text(function (d) {
          if (d.type === 'switch') return d.dpid
          else return d.mac
        })
        .style({
          'fill': '#000',
          'font-size': '10px'
        })
      const port = this.container.selectAll('.port')
        .data(data.links)
        .enter()
        .append('text')
        .style({
          'fill': '#000',
          'font-size': '10px'
        })
        .attr({
          'class': 'port',
          'dx': 0,
          'dy': 0
        })
        .text(function (d) {
          return d.source_port
        })

      force.on('tick', function () {
        node.attr({
          'cx': function (d) {
            return d.x
          },
          'cy': function (d) {
            return d.y
          },
          'transform': function (d) {
            return `translate(${d.x}, ${d.y})`
          }
        })

        link.attr('x1', function (d) {
          return d.source.x
        })
          .attr('y1', function (d) {
            return d.source.y
          })
          .attr('x2', function (d) {
            return d.target.x
          })
          .attr('y2', function (d) {
            return d.target.y
          })

        port.attr('x', function (d) {
          return d.source.x + 15 * (d.target.x - d.source.x) / Math.sqrt(Math.pow((d.target.x - d.source.x), 2) + Math.pow((d.target.y - d.source.y), 2))
        })
          .attr('y', function (d) {
            return d.source.y + 15 * (d.target.y - d.source.y) / Math.sqrt(Math.pow((d.target.x - d.source.x), 2) + Math.pow((d.target.y - d.source.y), 2))
          })
      })
    },
    updateTopology: function () {
      const socket = new WebSocket(config.wsTopoUrl)
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
          swal({
            title: '注意',
            text: '拓扑变更',
            icon: 'warning'
          })
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
  }
</style>
