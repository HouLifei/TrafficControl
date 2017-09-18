<template>
  <div class="network-content">
    <div class="container">
      <div class="row">
        <div class="column-7">
          <show-switch></show-switch>
          <show-host></show-host>
        </div>
        <div class="column-5">
          <show-topology></show-topology>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Topology from '@/components/Topology'
import Switch from '@/components/Switch'
import Host from '@/components/Host'
export default {
  name: 'network',
  components: {
    'show-topology': Topology,
    'show-switch': Switch,
    'show-host': Host
  }
}
</script>
<style lang="less">

  .network-content{
    padding: 60px 0;

    .device-content {

      h4 {
        font-size: 1.5rem;
        margin-bottom: 15px;
        color: #0e90d2;
      }

      .device-item {
        background-color: #f5f5f5;
        border: 1px solid #dddddd;
        border-top: 1px solid transparent;
        padding: 9px 18px;
        font-size: 1.4rem;
        color: #444;

        &:first-of-type {
          border-top: 1px solid #dddddd;
        }

        .icon-up {
          float: right;
          &::before {
            content: "\f077";
          }
        }

        .icon-down {
          float: right;
          &::before{
            content: "\f078";
          }
        }
      }

      .switch-table {
        thead {
          background-color: #ffffff;
        }
        tr {
          border-top: 1px solid transparent;
        }
      }
    }
  }



</style>
