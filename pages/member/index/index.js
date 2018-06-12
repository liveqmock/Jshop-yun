//个人中心首页
var app = getApp(); //全局APP

Page({
  //页面初始数据
  data: {
    nickname: '',
    point: 0, //用户积分
    avatar: '../../image/default_avatar.png',
    bindMobile: false,
    statusData: [], //状态数据
  },

  //加载执行
  onShow: function (options) {
    var page = this;
    app.db.userToken(function (token) {
      app.api.userInfo(function (res) {
        if (res.status) {
          //如果没有头像，设置本地默认头像
          var avatar = '../../image/default_avatar.png';
          if(res.data.avatar){
            avatar = res.data.avatar;
          }
          page.setData({
            nickname: res.data.nickname,
            avatar: avatar,
          });
        }
      });

      app.api.getOrderStatusNum('1,2,3,4', function (res) {
        page.setData({
          statusData: res.data
        })
      });

      page.myPoint();
    });
  },

  //获取我的积分
  myPoint: function () {
      app.db.userToken(function (token) {
          app.api.myPoint(function (res) {
                if (res.status) {
                    page.setData({
                        point: res.data
                    });
                }
          });
      });
  },

  //查看全部订单
  orderAll: function () {
    wx.navigateTo({
      url: '../order/orderList/orderList?type=all',
    });
  },

  //待支付订单
  orderNoPay: function () {
    wx.navigateTo({
      url: '../order/orderList/orderList?type=pendingpayment',
    });
  },

  //待发货订单
  orderNoShip: function () {
    wx.navigateTo({
      url: '../order/orderList/orderList?type=pendingdelivery',
    });
  },

  //待收货订单
  orderNoReceiving: function () {
    wx.navigateTo({
      url: '../order/orderList/orderList?type=goodstobereceived',
    });
  },

  //退换货
  orderAftermarket: function () {
    wx.navigateTo({
      url: '../order/aftersalesList/aftersalesList',
    });
  },

  //积分签到
  sign: function () {
      var page = this;
      app.db.userToken(function (token) {
          app.api.isSign(function (res) {
              if (res.status) {
                  wx.showToast({
                      title: '今日已签到，无需重复签到',
                      icon: 'none',
                      duration: 1000
                  });
              } else {
                  app.api.sign(function (e) {
                        page.myPoint();
                        if (e.status) {
                            wx.showToast({
                                title: '签到成功',
                                icon: 'success',
                                duration: 1000
                            });
                        } else {
                            wx.showToast({
                                title: e.msg,
                                icon: 'none',
                                duration: 1000
                            });
                        }
                  });
              }
          });
      });
    //todo:跳转到对应的积分页面
  },

  //我的优惠券
  coupon: function () {
    wx.navigateTo({
      url: '../coupon/coupon',
    });
  },

  //我的购物车
  cart: function () {
    wx.switchTab({
      url: '/pages/cart/cartNothing/cart'
    });
  },

  //我的关注
  attention: function () {
    wx.navigateTo({
      url: '../collect/collect'
    });
  },

  //前往我的足迹
  browsingHistory: function () {
    wx.navigateTo({
      url: '../browsingHistory/browsingHistory'
    });
  },

  //余额提现
  withdraw: function () {
    wx.showToast({
      title: '开发中...',
      icon: 'loading',
      duration: 1000
    });
  },

  //余额明细
  details: function () {
    wx.showToast({
      title: '开发中...',
      icon: 'loading',
      duration: 1000
    });
  },

  //设置用户信息
  setUserInfo: function () {
    wx.navigateTo({
      url: '../info/info'
    });
  },

  //更换头像
  chooseAvatar: function () {
    var page = this;
    app.api.uploadImage(1,function(res){
      if(res.status){
        app.api.changeAvatar(res.data.url,function(res1){
          if(res1.status){
            app.common.successToShow('更换头像成功',function(){
              page.setData({
                avatar: res.data.url
              });
            });
          }else{
            app.common.errorToBack(res1.msg, 0);
          }
        })
      }else{
        app.common.errorToBack(res.msg,0);
      }
    });
  },

  //收货地址管理
  shipList: function () {
    wx.navigateTo({
      url: '../ship/ship'
    });
  },
});