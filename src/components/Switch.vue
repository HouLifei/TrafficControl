<template>
  <div>
    <div class="device-content">
      <h4>交换机</h4>
      <template v-for="item in items">
        <div class="device-item" v-on:click="toggle(item)">{{ item.dpid }} <span v-bind:class="item.show? 'icon-up': 'icon-down'"></span></div>
        <table v-if="item.show" class="switch-table center">
          <thead>
          <tr>
            <td>端口ID</td>
            <td>端口名称</td>
            <td>端口MAC</td>
          </tr>
          </thead>
          <tbody>
          <tr v-for="port in item.ports">
            <td>{{ port.port_no | parseInt }}</td>
            <td>{{ port.name }}</td>
            <td>{{ port.hw_addr }}</td>
          </tr>
          </tbody>
        </table>
      </template>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'switch',
    data: function () {
      return {
        items: []
      }
    },
    created: function () {
      this.getSwitchList()
    },
    methods: {
      getSwitchList: function () {
        this.$ajax.get('/topology/switches').then(res => {
          const data = res.data
          for (let key of data) {
            key.show = false
            this.items.push(key)
          }
        })
      },
      toggle: function (item) {
        item.show = !item.show
      }
    },
    filters: {
      parseInt: function (value) {
        return Number.parseInt(value)
      }
    }
  }
</script>

