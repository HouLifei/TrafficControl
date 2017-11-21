<template>
  <div class="strategy-content">
    <show-model v-if="showModel"  v-on:close="close" v-on:refresh="getStrategy"></show-model>
    <h4>流量策略</h4>
    <div class="btn-container">
        <button class="btn add right" v-on:click="addItem"><span class="icon-add"></span>添加</button>
    </div>
    <table class="strategy-table center">
            <thead>
            <tr>
              <td>源IP</td>
              <td>目的IP</td>
              <td>源端口</td>
              <td>目的端口</td>
              <td>协议</td>
              <td>优先级</td>
              <td>带宽</td>
              <td></td>
            </tr>
            </thead>
            <tbody>
            <tr v-for="item in strategyList">
              <td>{{ item.nw_src }}</td>
              <td>{{ item.nw_dst }}</td>
              <td>{{ item.tp_src }}</td>
              <td>{{ item.tp_dst }}</td>
              <td>{{ item.tp_proto }}</td>
              <td>{{ item.priority }}</td>
              <td>{{ item.bandwidth }}</td>
              <td>
                <button class="btn delete small"  v-on:click="deleteItem(item)"><span class="icon-delete"></span></button>
              </td>
            </tr>
            </tbody>
          </table>
  </div>
</template>

<script>
  import swal from 'sweetalert'
  import Model from '@/components/Model'
  export default {
    name: 'strategy',
    data: function () {
      return {
        strategyList: [],
        showModel: false
      }
    },
    created: function () {
      this.getStrategy()
    },
    components: {
      'show-model': Model
    },
    methods: {
      addItem: function () {
        this.showModel = true
      },
      deleteItem: function (item) {
        swal('正在删除，请稍后', {
          closeOnClickOutside: false,
          button: false
        })
        this.$ajax.post('/strategy/delete', item).then(res => {
          const result = res.data.result
          if (result === 'success') {
            swal({
              title: '删除成功',
              icon: 'success'
            })
            this.getStrategy()
          } else {
            swal({
              title: '删除失败',
              text: '请稍后重试',
              icon: 'warning'
            })
          }
        }).catch(error => {
          swal.close()
          console.log(error)
        })
      },
      close: function () {
        this.showModel = false
      },
      getStrategy: function () {
        this.$ajax.get('/strategy/strategies').then(res => {
          this.strategyList = []
          this.strategyList.push(...res.data)
        })
      }
    }
  }
</script>
<style lang="less">

  .strategy-content{
    height: 500px;
    overflow: auto;

    h4 {
      font-size: 1.5rem;
      margin-bottom: 15px;
      color: #0e90d2;
    }

    .btn {
      font-size: 1rem;

      &.small {
        padding: 3px 6px;
      }

      &.add {
        color: #fff;
        background-color: #5bc0de;
        border-color: #46b8da;
      }

      &.edit {
        color: #fff;
        background-color: #337ab7;
        border-color: #2e6da4;
      }

      &.delete {
        color: #fff;
        background-color: #d95347;
        border-color: #d43f3a;
      }
    }

    .icon-add {
      &::before {
        content: "\f067";
      }
    }

    .icon-edit {
      &::before {
        content: "\f044";
      }
    }

    .icon-delete {
      &::before {
        content: "\f00d";
      }
    }

    .btn-container {
      padding-bottom: 40px;
      &::after {
        clear: both;
      }
    }

    table.strategy-table {
      tbody {
        td {
          padding: 5px 10px;
        }
      }
    }
  }
</style>
