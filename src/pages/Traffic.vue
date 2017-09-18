<template>
  <div class="traffic-content">
    <div class="container">
      <div class="row">
        <div class="column-5">
          <show-topology></show-topology>
        </div>
        <div class="column-7">
          <show-strategy></show-strategy>
        </div>
      </div>
      <div class="row">
        <div class="column-12">
          <traffic-info></traffic-info>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import Topology from '@/components/Topology'
  import Strategy from '@/components/Strategy'
  import TrafficInfo from '@/components/TrafficInfo'
  export default {
    name: 'traffic',
    components: {
      'show-topology': Topology,
      'show-strategy': Strategy,
      'traffic-info': TrafficInfo
    }
  }
</script>
<style>
  .traffic-content{
    padding: 60px 0;
  }
</style>
