const express = require('express');
const router = express.Router();

// bp-relation/register
router.post('/bp-relationship/register', (req, res) => {
  // 直接返回成功
  console.log('创建BP关系:', req.body);
  const relationCategoty = req.body.relation.relationShipCategory
  let formStruct = {
  }
  if(relationCategoty === 'test') {
    formStruct = {
      nodeType: 'dict',
      varType: 'dict',
      name: 'generalData',
      nameDisplay: 'General Data',
      children:[
        {
          nodeType: 'leaf',
          varType: 'string',
          name: 'testField',
          nameDisplay: 'Test Field: ',
        }
      ]
    }
  }
  res.json({
    success: true,
    message: '创建BP关系成功',
    data: {
      formStruct
    }
  })
})

// bp-relation/create
router.post('/bp-relationship/create', (req, res) => {
  // 直接返回成功
  console.log('创建BP关系:', req.body);
  const relationId = "33"
  res.json({
    success: true,
    message: '创建BP关系成功',
    data: {
      message: `BP realtion ${relationId} has been created successfully`
    }
  })
})

module.exports = router;