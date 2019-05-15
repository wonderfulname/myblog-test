const querystring = require('querystring')
const { blogRouter } = require('./src/router/blog')
const { handleUserRouter } = require('./src/router/user')

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
  console.log(path, query)

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
      const blogResult = blogRouter(req)
      if (blogResult) {
        blogResult.then(blogData => {
          res.end(
            JSON.stringify(blogData)
          )
        })
        return
      }

      const resUserResult = handleUserRouter(req)
      if (resUserResult) {
        resUserResult.then(userDate => {
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