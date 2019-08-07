const app = getApp()
Page({
  data: {
    imageSrc: "",
    showView: false
  },
  chooseImage: function () {
    var that = this;
    wx.chooseImage({
      count: 1,
      success: function (e) {
        console.log(e.tempFilePaths[0])
        that.setData({
          imageSrc: e.tempFilePaths[0]
        })
        wx.showToast({
          title: '数据加载中',
          icon: 'loading',
          duration: 2000
        });
        wx.getFileSystemManager().readFile({
          filePath: e.tempFilePaths[0], //选择图片返回的相对路径
          encoding: 'base64', //编码格式
          success: res => {
            console.log("图片转码回调");
            wx.request({
              url: 'https://dm-57.data.aliyun.com/rest/160601/ocr/ocr_business_card.json',
              data: {
                "image": res.data
              },
              header: {
                "Authorization": "APPCODE e5d382e5d0a4*****0638b1e14a" //阿里云ocr名片识别code
              },
              method: 'POST',
              dataType: 'json',
              responseType: 'text',
              success: function (res) {
                console.log(res);
                if (200 == res.statusCode) {
                  that.setData({
                    showView: true,
                    name: res.data.name,
                    company: res.data.company,
                    department: res.data.department,
                    title: res.data.title,
                    tel_cell: res.data.tel_cell,
                    tel_work: res.data.tel_work,
                    addr: res.data.addr,
                    email: res.data.email
                  })

                } else {
                  wx.showModal({
                    title: '提示信息',
                    content: '你选择的图片不符合规格，请重新上传',
                    showCancel: false,
                    confirmText: '确定',
                    success: function (res) {
                      console.log("点击了确定", res)
                      that.setData({
                        imageSrc: "",
                        showView: false,
                        name: res.data.name,
                        company: res.data.company,
                        department: res.data.department,
                        title: res.data.title,
                        tel_cell: res.data.tel_cell,
                        tel_work: res.data.tel_work,
                        addr: res.data.addr,
                        email: res.data.email
                      })
                    }
                  })
                }
              }
            })
          }
        })
      }
    })
  },
})