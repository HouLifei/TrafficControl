<template>
  <div>
    <div class="device-content">
      <h4>主机</h4>
      <table class="host-table center">
        <thead>
        <tr>
          <td>MAC地址</td>
          <td>IP地址</td>
          <td>所属交换机</td>
          <td>连接端口</td>
        </tr>
        </thead>
        <tbody>
        <tr v-for="item in items">
          <td>{{ item.mac }}</td>
          <td>{{ item.ipv4[0] }}</td>
          <td>{{ item.port.dpid }}</td>
          <td>{{ item.port.name }}</td>
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
          this.items = res.data
        })
      }
    }
  }
</script>
