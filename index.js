const mysql = require('mysql')

//创建连接对象
const con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  port: '3306',
  database: 'myblogs'
})

//开始连接
con.connect()

//执行 sql 语句
const sql = 'select id, author from blogs'
con.query(sql, (err, result) => {
  if (err) {
    console.error(err)
    return
  }
  console.log(result)
})

// 关闭连接
con.end()