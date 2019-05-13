const querystring = require('querystring')
const { blogRouter } = require('./src/router/blog')
const { handleUserRouter } = require('./src/router/user')

const getPostData = (req, callback) => {
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
  console.log(path, query)

  req.path = path
  req.query = query

  getPostData(req)
    .then(postData => {
      req.body = postData

      const resBlogData = blogRouter(req)
      const resUserData = handleUserRouter(req)

      if (resBlogData) {
        res.end(
          JSON.stringify(resBlogData)
        )
        return
      }

      if (resUserData) {
        res.end(
          JSON.stringify(resUserData)
        )
        return
      }

      res.end('404')
     
    })
}

module.exports = serverHandle