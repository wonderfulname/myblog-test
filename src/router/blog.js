const { getList, getDetail, newBlog, updateBlog, delBlog } = require('../controller/blog')
const { SuccessModel, ErrorModel } = require('../model/resModel')

const blogRouter = (req) => {
  
  const method = req.method
  // const body = req.body
  // console.log(body)

  // 获取博客列表
  if (method === 'GET' && req.path === '/api/blog/list') {
    console.log('blog router is right !')
    const author = req.query.author || ''
    const keyword = req.query.keyword || ''
    // const listData = getList(author, keyword)
    // return new SuccessModel(listData, 'hello world')
    const result = getList(author, keyword)
    return result.then(listData => {
      return new SuccessModel(listData)
    })
  }

  // 获取博客详情
  if (method === 'GET' && req.path === '/api/blog/detail') {
    const id = req.query.id
    const result = getDetail(id)
    return result.then(data => {
      return new SuccessModel(data)
    })
  }

  // 新建博客
  if (method === 'POST' && req.path === '/api/blog/new') {
    const author = 'zhangsan'
    req.body.author = author
    const result = newBlog(req.body)
    return result.then(data => {
      return new SuccessModel(data)
    })
  }

  // 删除博客
  if (method === 'POST' && req.path === '/api/blog/del') {
    let author = 'zhangsan'
    req.body.author = author
    const result = delBlog(req.query.id, req.body)
    return result.then(data => {
      if (data) {
        return new SuccessModel(data)
      } else {
        return new ErrorModel('删除失败')
      }
    })
    // if (data) {
    //   return new SuccessModel(data)
    // } else {
    //   return new ErrorModel('删除失败!')
    // }
  } 

  // 更新博客
  if (method === 'POST' && req.path === '/api/blog/update') {
    const id = req.query.id
    const result = updateBlog(id, req.body)
    return result.then(data => {
      if (data) {
        return new SuccessModel(data)
      } else {
        return new ErrorModel('更新失败!')
      }
    })
  }

}

module.exports = {
  blogRouter
}