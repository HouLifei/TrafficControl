<template>
  <div>
    <div class="device-content">
      <h4>主机</h4>
      <table class="host-table center">
        <thead>
        <tr>
          <td>主机名称</td>
          <td>MAC地址</td>
          <td>IP地址</td>
          <td>连接交换机</td>
          <td>连接端口</td>
        </tr>
        </thead>
        <tbody>
        <tr v-for="item in items">
          <td>{{ item.hostName }}</td>
          <td>{{ item.mac }}</td>
          <td>{{ item.ip }}</td>
          <td>{{ item.switchName }}</td>
          <td>{{ item.portName }}</td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'host',
    data: function () {
      return {
        items: []
      }
    },
    created: function () {
      this.getHostList()
    },
    methods: {
      getHostList: function () {
        this.$ajax.get('/topology/hosts').then(res => {
          const data = res.data
          for (let key of data) {
            const item = {}
            if (key.ipv4.length > 0) {
              item.mac = key.mac
              item.ip = key.ipv4[0]
              item.hostName = hostMap[item.ip]
              item.switchName = switchMap[key.port.dpid]
              item.portName = key.port.name
              this.items.push(item)
            }
          }
        })
      }
    }
  }
</script>
