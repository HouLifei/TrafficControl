<template>
  <div class="index-content">
    <div class="container-fluid header">
      <div class="row">
        <div class="column-12">
          <h1>云架构网络高确定性流量控制系统</h1>
          <p>精细化SDN网络流量控制</p>
        </div>
      </div>
    </div>
    <div class="container content">
      <div class="row">
        <div class="column-12">
          <h2>系统功能</h2>
          <div class="row">
            <div class="column-4">
              <h3>网络态势感知</h3>
              <p>基于SDN控制器收集网络资源信息和网络流量信息，感知整个网络的状态，并予以呈现</p>
            </div>
            <div class="column-4">
              <h3>网络流量配置</h3>
              <p>结合网络状态和用户策略管理网络，实现不同数据流的精细化管理，保证不同业务流的不同服务质量，并实现网络负载均衡</p>
            </div>
            <div class="column-4">
              <h3>网络故障管理</h3>
              <p>及时发现网络中的故障，通知用户，并重定向故障链路上数据流，保证正常通信</p>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="column-12">
          <h2>系统组成</h2>
          <div class="row">
            <div class="column-3">
              <h3>SDN交换机</h3>
              <p>ONetSwitch可以使用大量开源的FPGA工程，同时可以容易的定义自己的数据通道处理逻辑，软件方面容易开发移植</p>
            </div>
            <div class="column-3">
              <h3>SDN控制器</h3>
              <p>使用Ryu控制器，控制整个SDN网络</p>
            </div>
            <div class="column-3">
              <h3>智能流量控制软件</h3>
              <p>控制网络流量，由网络态势感知模块、网络流量配置模块和网络故障管理模块组成</p>
            </div>
            <div class="column-3">
              <h3>虚拟交换机配置软件</h3>
              <p>调用Mininet仿真软件，生成对应数量、拓扑连接的虚拟SDN交换机</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'index'
}
</script>
<style lang="less">
  .index-content {
    .header {
      background: #1E5B94;
      color: #fff;
      text-align: center;
      padding: 150px 0 100px 0;

      h1 {
        font-size: 2rem;
        border: 2px solid #fff;
        padding: 10px 20px;
        display: inline-block;
      }
    }
    .content {
      h2 {
        text-align: center;
        font-size: 1.5rem;
        margin: 30px 0 15px 0;
      }

      h3 {
        color: #1f8dd6;
        font-size: 1.5rem;
      }

      p {
        color: #7f8c8d;
        font-size: 1.25rem;
      }
    }
  }


</style>
