<template>
  <div class="model-content">
    <div class="model-body">
      <div class="row">
        <div class="column-12">
          <span class="icon-close right" v-on:click="close"></span>
          <h4>添加策略</h4>
        </div>
      </div>
      <div  class="row">
        <div class="column-12">
          <form>
            <fieldset>
              <legend>匹配域</legend>
              <div class="row">
                <div class="column-4 input-group">
                  <label for="srcIP">Src IP</label>
                  <input id="srcIP" v-verify:ip="srcIP"  v-bind:disabled="type === 'edit' ? true: false"   placeholder="0.0.0.0" v-model.lazy="srcIP"/>
                </div>
                <div class="column-4 input-group">
                  <label for="dstIP">Dst IP</label>
                  <input id="dstIP" v-verify:ip="dstIP" v-bind:disabled="type === 'edit' ? true: false"   placeholder="0.0.0.0" v-model.lazy="dstIP"/>
                </div>
                <div class="column-4 input-group">
                  <label for="protocol">Protocol</label>
                  <select id="protocol" v-bind:disabled="type === 'edit' ? true: false">
                    <option value="tcp">TCP</option>
                    <option value="udp">UDP</option>
                  </select>
                </div>
              </div>
              <br>
              <div class="row">
                <div class="column-4 input-group">
                  <label for="srcPort">Src Port</label>
                  <input id="srcPort" v-verify:num="srcPort" v-bind:disabled="type === 'edit' ? true: false" placeholder="0" type="number" v-model.lazy="srcPort"/>
                </div>
                <div class="column-4 input-group">
                  <label for="dstPort">Dst Port</label>
                  <input id="dstPort" v-verify:num="dstPort" v-bind:disabled="type === 'edit' ? true: false"   placeholder="0" type="number" v-model.lazy="dstPort"/>
                </div>
              </div>
            </fieldset>
            <fieldset>
              <legend>策略</legend>
              <div class="row">
                <div class="column-4 input-group">
                  <label for="priority">Priority</label>
                  <select id="priority">
                    <option value="0">0</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                  </select>
                </div>
                <div class="column-4 input-group">
                  <label for="bandwidth">Bandwidth</label>
                  <input id="bandwidth" v-verify:num="bandwidth" v-model.lazy="bandwidth" type="number">
                </div>
              </div>
            </fieldset>
            <div class="prompt" v-bind:class="{error: inputError}">提示：{{ message }}</div>
            <div class="btn-group">
              <button type="button" class="btn edit" v-on:click="addStrategy">{{ type === 'add'? '添加' : '修改'}}</button>
              <button type="button" class="btn" v-on:click="close">取消</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import swal from 'sweetalert'
  const match = {
    'ip': /^(?:(?:2[0-4][0-9]\.)|(?:25[0-5]\.)|(?:1[0-9][0-9]\.)|(?:[1-9][0-9]\.)|(?:[0-9]\.)){3}(?:(?:2[0-5][0-5])|(?:25[0-5])|(?:1[0-9][0-9])|(?:[1-9][0-9])|(?:[0-9]))$/,
    'num': /^[1-9]\d*$/
  }
  export default {
    name: 'model',
    props: ['type', 'info'],
    data: function () {
      return {
        srcIP: this.info['nw_src'],
        dstIP: this.info['nw_dst'],
        srcPort: this.info['tp_src'],
        dstPort: this.info['tp_dst'],
        protocol: this.info['tp_proto'] || 'tcp',
        priority: this.info['priority'] || 0,
        bandwidth: this.info['bandwidth'],
        message: '匹配域为必填项，策略至少填写一个，其中优先级为1-7的整数，端口号和带宽均为整数',
        inputError: false
      }
    },
    methods: {
      close: function () {
        this.$emit('close')
      },
      addStrategy: function () {
        const message = this.verifyInput()
        if (message.length) {
          this.inputError = true
          this.message = message
        } else {
          this.inputError = false
          this.message = '匹配域为必填项，策略至少填写一个，其中优先级为1-7的整数，端口号和带宽均为整数'
          this.$ajax.post('/strategy/add', {
            'nw_src': this.srcIP,
            'nw_dst': this.dstIP,
            'tp_proto': this.protocol,
            'tp_src': this.srcPort,
            'tp_dst': this.dstPort,
            'priority': this.priority,
            'bandwidth': this.bandwidth
          }).then(res => {
            const result = res.data.result
            if (result === 'success') {
              swal({
                title: '策略下发成功',
                icon: 'success'
              })
              this.$emit('close')
              this.$emit('refresh')
            } else {
              swal({
                title: '策略下发失败',
                text: '请稍后重试',
                icon: 'warning'
              })
            }
          }).catch(error => {
            console.log(error)
          })
        }
      },
      verifyInput: function () {
        let message = ''
        if (!match.ip.test(this.srcIP)) {
          message += '源IP地址输入不合法 '
        }
        if (!match.ip.test(this.dstIP)) {
          message += '目的IP地址输入不合法 '
        }
        if (!match.num.test(this.srcPort)) {
          message += '源端口输入不合法 '
        }
        if (!match.num.test(this.dstPort)) {
          message += '目的端口输入不合法 '
        }
        if (!match.num.test(this.bandwidth)) {
          message += '带宽输入不合法 '
        }
        return message
      }
    },
    directives: {
      verify: {
        update: function (el, binding) {
          const reg = match[binding.arg]
          const value = binding.value
          if (value && !reg.test(value)) {
            el.className = 'error'
          } else {
            el.className = ''
          }
        }
      }
    }
  }
</script>

<style lang="less">

  .model-content {
    position: fixed;
    z-index: 20;
    background-color: rgba(150,150,150,0.5);
    width: 100%;
    height: 100%;
    top:0;
    left:0;
    display: block;

    .model-body {
      position: absolute;
      width: 1000px;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: #ffffff;

      h4 {
        text-align: center;
      }

      .icon-close {
        margin-top: 10px;
        font-size: 1.8rem;
        color: #888;
        &::before{
          content: "\f00d";
        }
      }

      legend {
        font-size: 1.4rem;
        margin-bottom: 1rem;
        padding-left: 20px;
      }

      .input-group {

        label {
          display: inline-block;
          box-sizing: border-box;
          width: 35%;
          vertical-align: middle;
          text-align: right;
          font-size: 1.25rem;
          font-weight: normal;
        }

        input, select {
          width: 60%;
          box-sizing: border-box;
          display: inline-block;
          vertical-align: middle;
          padding: 10px 6px;
          font-size: 1.25rem;
          line-height: 1.2;
          color: #555555;
          background-image: none;
          border: 1px solid #ccc;
          border-radius: 0;
          transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out, -webkit-box-shadow 0.15s ease-in-out;
        }

        input.error{
          border-color: #cf2d27;
        }

        select {
          -webkit-appearance: none !important;
          -moz-appearance: none !important;
          -webkit-border-radius: 0;
          background: #fff url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgeD0iMTJweCIgeT0iMHB4IiB3aWR0aD0iMjRweCIgaGVpZ2h0PSIzcHgiIHZpZXdCb3g9IjAgMCA2IDMiIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDYgMyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+PHBvbHlnb24gcG9pbnRzPSI1Ljk5MiwwIDIuOTkyLDMgLTAuMDA4LDAgIi8+PC9zdmc+') no-repeat 100% center;
        }

      }

      .btn-group {
        text-align: center;
        padding: 30px 0;
      }

      .prompt {
        padding: 10px 30px;
        &.error {
          color: #cf2d27;
        }
      }
    }
  }
</style>
