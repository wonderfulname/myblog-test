const { login } = require('../controller/user')
const { SuccessModel, ErrorModel } = require('../model/resModel')

const setCookieExpires = (days = 7) => {
  let nowTimeStamp = new Date().getTime()
  let newDate = new Date(nowTimeStamp + days * 24 * 60 *60 * 1000)
  return newDate.toUTCString()
}

const handleUserRouter = (req, res) => {
  const method = req.method
  // 登录
  if (method === 'GET' && req.path === '/api/user/login') {
    // const { username, password } = req.body
    const { username, password } = req.query
    const result = login(username, password)
    return result.then(data => {
      if (data.username) {
        // 设置session
        req.session.username = data.username
        req.session.realname = data.realname
        
        return new SuccessModel(req.session)
      } else {
        return new ErrorModel('登录失败!')
      }
    })
  }

  // 测试
  if (method === 'GET' && req.path === '/api/user/test') {
    if (req.session.username) {
      return Promise.resolve(
        new SuccessModel(req.session.username)
      )
    }
    return Promise.resolve(
      new ErrorModel('尚未登录')
    )
  }
}

module.exports = {
  handleUserRouter
}