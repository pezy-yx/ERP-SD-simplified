const express = require('express');
const router = express.Router();

const existingUser ={
    username:'pezy',
    password:'123456'
}

router.post('/', (req, res) => {
    console.log('收到前端用户登录请求:', req.body);

    var success = true;
    if(success){
        setTimeout(() => {
            res.json({
                success: true,
                message: 'login successfully',
                token:'fake-token',
                user:{
                    username:'pezy',
                }
            });
        }, 500); // 模拟500毫秒的网络延迟
    } else {
            setTimeout(() => {
            res.json({
                success: false,
                message: 'failed',
            });
        }, 500); // 模拟500毫秒的网络延迟
    }
});

module.exports = router;