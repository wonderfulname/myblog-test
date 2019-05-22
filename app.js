const querystring = require('querystring')
const { blogRouter } = require('./src/router/blog')
const { handleUserRouter } = require('./src/router/user')

const setCookieExpires = (days = 7) => {
  let nowTimeStamp = new Date().getTime()
  let newDate = new Date(nowTimeStamp + days * 24 * 60 *60 * 1000)
  return newDate.toUTCString()
}

// session 数据
const SESSION_DATA = {}

const getPostData = (req) => {
  return new Promise((resolve, reject) => {
    if (req.method !== 'POST') {
      resolve({})
      return
    }
    if (req.headers['content-type'] !== 'application/json') {
      resolve({})
      return
    }

    let postData = ''
    req.on('data', chunk => {
      postData += chunk.toString()
    })
    req.on('end', () => {
      if (!postData) {
        resolve({})
        return
      }
      resolve(
        JSON.parse(postData)
      )
    })
  })
}

const serverHandle = (req, res) => {

  res.setHeader('Content-type', 'application/json')

  const url = req.url
  const path = url.split('?')[0]
  const query = querystring.parse(url.split('?')[1])
  
  // 解析cookie
  const cookie = req.headers.cookie || ''  
  req.cookie = {}
  let cookieArr = cookie.split(';').forEach(item => {

    if (!item) return;

    const arr = item.split('=')
    let key = arr[0].trim()
    let value = arr[1].trim()
    req.cookie[key] = value

  })
  
  // console.log(req.cookie)
  let needSetSession = false
  // 解析session
  let userId = req.cookie.userid
  if (userId) {
    if (!SESSION_DATA[userId]) {
      SESSION_DATA[userId] = {}
    }
  } else {
    needSetSession = true
    userId = `${Date.now()}_${Math.random()}`
    SESSION_DATA[userId] = {}
  }
  req.session = SESSION_DATA[userId]

  
  req.path = path
  req.query = query

  getPostData(req)
    .then(postData => {
      req.body = postData

      // if (resBlogData) {
      //   res.end(
      //     JSON.stringify(resBlogData)
      //   )
      //   return
      // }
      const blogResult = blogRouter(req, res)
      if (blogResult) {
        blogResult.then(blogData => {

          if (needSetSession) {
            res.setHeader('Set-Cookie', `userid=${userId}; path=/; httpOnly; expires=${setCookieExpires()}`)
          }
          res.end(
            JSON.stringify(blogData)
          )
        })
        return
      }

      const resUserResult = handleUserRouter(req, res)
      if (resUserResult) {
        resUserResult.then(userDate => {
          if (needSetSession) {
            res.setHeader('Set-Cookie', `userid=${userId}; path=/; httpOnly; expires=${setCookieExpires()}`)
          }
          res.end(
            JSON.stringify(userDate)
          )
        })
        return
      }

      res.end('404')
     
    })
}

module.exports = serverHandle