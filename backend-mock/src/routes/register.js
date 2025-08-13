const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
    console.log('收到前端注册用户请求:', req.body);
    if(req.body.username !== 'username'){
        setTimeout(() => {
            res.json({
                success: false,
                message: '昵称不对',
            });
        }, 500); // 模拟500毫秒的网络延迟
    } else {
            setTimeout(() => {
            res.json({
                success: true,
                message: 'You got an account successfully!',
            });
        }, 500); // 模拟500毫秒的网络延迟
    }
});

module.exports = router;