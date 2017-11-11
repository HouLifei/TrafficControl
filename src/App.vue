<template>
  <div id="app">
    <nav class="navbar">
      <div class="container">
        <div class="row">
          <div class="column-12">
            <div class="brand">
              <a href="#">流量控制系统</a>
            </div>
            <ul>
              <li><router-link to="/" exact>首页</router-link></li>
              <li><router-link to="network">网络管理</router-link></li>
              <li><router-link to="traffic">流量管理</router-link></li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
    <router-view></router-view>
    <div class="footer">
      <p>Develop by <a href="http://ants.xjtu.edu.cn" target="_blank">@ANTS Group</a></p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style lang="less">
  @import "assets/css/common.less";
  #app{
    min-height: 100%;
    width: 100%;
    padding-bottom: 80px;
    position: relative;
    margin: 0 auto;
  }
  nav.navbar {
    position: fixed;
    z-index: 100;
    left: 0;
    right: 0;
    top: 0;
    min-height: 50px;
    background-color: #f8f8f8;
    border-bottom: solid #ddd 1px;
    color: #666;

    .brand {
      float: left;
      font-size: 1.8rem;
      height: 50px;
      line-height: 50px;


      a {
        color: #666666;
        font-weight:600;
        :hover {
          color: #4d4d4d;
        }
      }
    }

    ul {
      float: left;
      margin-top: 0;
      margin-bottom: 0;
      padding: 0;
      list-style: none;

      li {
        float: left;
        position: relative;
        display: block;

        a {
          display: block;
          position: relative;
          line-height: 50px;
          padding: 0 10px;
          color: #666666;

          &::after {
            position: absolute;
            left: 50%;
            margin-left: -7px;
            bottom: -1px;
            content: "";
            display: inline-block;
            width: 0;
            height: 0;
            vertical-align: middle;
            border-bottom: 7px solid #f8f8f8;
            border-left: 7px solid transparent;
            border-right: 7px solid transparent;
            border-top: 0 dotted;
            opacity: 0;
            transition: opacity .1s;
          }

          &.router-link-active {
            color: #0e90d2;
            &::after {
              opacity: 1;
              border-bottom-color: #0e90d2;
            }
          }
        }
      }
    }
  }

  .footer {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    p {
      color: #7f8c8d;
      margin: 0;
      padding: 15px 0;
      text-align: center;
      background: #2d3e50;
      a {
        color: #f8f8f8;
      }
    }
  }

</style>
