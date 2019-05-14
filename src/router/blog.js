const { getList, getDetail, newBlog, updateBlog, delBlog } = require('../controller/blog')
const { SuccessModel, ErrorModel } = require('../model/resModel')

const blogRouter = (req) => {
  
  const method = req.method
  // const body = req.body
  // console.log(body)

  if (method === 'GET' && req.path === '/api/blog/list') {
    console.log('blog router is right !')
    const author = req.query.author || ''
    const keyword = req.query.keyword || ''
    const listData = getList(author, keyword)
    return new SuccessModel(listData, 'hello world')
  }

  if (method === 'GET' && req.path === '/api/blog/detail') {
    const id = req.query.id
    const data = getDetail(id)
    return new SuccessModel(data)
  }

  if (method === 'POST' && req.path === '/api/blog/new') {
    const data = newBlog(req.body)
    return new SuccessModel(data)
  }

  if (method === 'POST' && req.path === '/api/blog/del') {
    const data = delBlog(req.query.id)
    if (data) {
      return new SuccessModel(data)
    } else {
      return new ErrorModel('删除失败!')
    }
  } 

  if (method === 'POST' && req.path === '/api/blog/update') {
    const id = req.query.id
    const data = newBlog(req.body)
    const result = updateBlog(id, data)
    if (result) {
      return new SuccessModel(result)
    } else {
      return new ErrorModel('更新失败!')
    }
  }

}

module.exports = {
  blogRouter
}