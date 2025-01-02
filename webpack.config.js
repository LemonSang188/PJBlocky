const path = require('path');

module.exports = {
  entry: './js/buttons_functions.js', // เปลี่ยน path นี้ตามไฟล์ต้นทางของคุณ
  output: {
    filename: 'bundle.js',  // ชื่อไฟล์บันเดิลที่จะสร้าง
    path: path.resolve(__dirname, 'dist'),  // โฟลเดอร์ที่จะเก็บไฟล์บันเดิล
  },
  mode: 'development', // หรือ 'production' หากคุณต้องการทำการ build ในโหมด production
  module: {
    rules: [
      {
        test: /\.js$/,  // กรองไฟล์ .js
        exclude: /node_modules/, // ไม่ให้ประมวลผลไฟล์จาก node_modules
        use: {
          loader: 'babel-loader', // ใช้ babel เพื่อให้สามารถใช้ฟีเจอร์ ES6 ในเบราว์เซอร์ได้
        },
      },
    ],
  },
};
