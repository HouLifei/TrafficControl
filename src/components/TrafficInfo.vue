<template>
  <div class="info-content">
    <h4>流量信息</h4>
    <div class="row">
      <div class="column-12">
        <ul class="switch-ul">
          <li v-for=" item in switchList" v-on:click="changeSwitch(item)">
            <span v-bind:class=" item == select? 'active': ''">s{{ item }}</span>
          </li>
        </ul>
      </div>
    </div>

    <template v-for="item in switchList" v-if=" item == select ">
      <flow-info  v-bind:dpid="select"></flow-info>
      <port-info  v-bind:dpid="select"></port-info>
    </template>
  </div>
</template>
<script>
  import  portInfo from '@/components/PortInfo'
  import flowInfo from '@/components/FlowInfo'
  export default {
    name: 'trafficInfo',
    data: function () {
      return {
        switchList: [],
        select: ''
      }
    },
    components: {
      'port-info': portInfo,
      'flow-info': flowInfo
    },
    created: function () {
      this.getSwitch()
    },
    methods: {
      getSwitch: function () {
        this.$ajax.get('/stats/switches')
          .then(this.assignSwitch)
      },
      assignSwitch: function (switches) {
        this.switchList = switches.data
        if (this.switchList.length !== 0) {
          this.select = this.switchList[0]
        }
      },
      changeSwitch: function (item) {
        this.select = item
      }
    }
  }
</script>
<style lang="less">
  .info-content {
    h4 {
      font-size: 1.5rem;
      margin-bottom: 15px;
      color: #3bb4f2;
    }

    .switch-ul {
      list-style: none;
      border-bottom: 1px solid #ddd ;

      &::after {
        clear: both;
      }

      li {
        float: left;
        margin-bottom: -1px;

        span {
          color: #337ab7;
          background-color: #fff;
          font-size: 1.2rem;
          padding: 10px 15px;
          display: block;
          margin-left: 2px;
          cursor: pointer;

          &:hover{
            background-color: #eee;
          }

          &.active {
            color: #555;
            border: 1px solid #ddd;
            border-radius: 4px 4px 0 0;
            border-bottom-color: transparent;
          }

        }

      }
    }

    .btn-group {
      padding: 10px 15px;

      .btn {
        background-color: #ffffff;
        border-color: #ddd;
        border-radius: 0;
        color: #888;
        padding: 6px 15px;

        &.select {
          color: #fff;
          background-color: #5bc0de;
          border-color: #46b8da;
        }
      }


    }
  }
</style>
