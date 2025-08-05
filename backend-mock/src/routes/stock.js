const express = require('express');
const router = express.Router();

const stockStages = ['stage name 0','stage name 1','stage name 2']
const stockLevels = ['Client','Company code','Plant']
router.post('/getStockStages', (req, res) => {
  res.json({
    success: true,
    data: stockStages,
    message: 'success'
  });
})

router.post('/getStockLevels', (req, res) => {
  res.json({
    success: true,
    data: stockLevels,
    message: 'success'
  });
})

router.post('/searchStock', (req, res) => {
  res.json({
    success: true,
    data: {
      content:[
        {data:{level:'Full',      stage0:'130',stage1:'230',stage2:'0'},depth:0},
          {data:{level:'CN00',    stage0:'50',stage1:'100',stage2:'0'},depth:1},
            {data:{level:'PLT0',  stage0:'35',stage1:'70',stage2:'0'},depth:2},
            {data:{level:'PLT1',  stage0:'15',stage1:'30',stage2:'0'},depth:2},
          {data:{level:'CN01',    stage0:'10',stage1:'20',stage2:'0'},depth:1},
            {data:{level:'PLT0',  stage0:'5',stage1:'10',stage2:'0'},depth:2},
            {data:{level:'PLT1',  stage0:'1',stage1:'2',stage2:'0'},depth:2},
            {data:{level:'PLT2',  stage0:'4',stage1:'8',stage2:'0'},depth:2},
          {data:{level:'CN02',    stage0:'20',stage1:'40',stage2:'0'},depth:1},
            {data:{level:'PLT0',  stage0:'20',stage1:'40',stage2:'0'},depth:2},
          {data:{level:'US00',    stage0:'20',stage1:'40',stage2:'0'},depth:1},
            {data:{level:'PLT0',  stage0:'20',stage1:'40',stage2:'0'},depth:2},
          {data:{level:'US01',    stage0:'30',stage1:'30',stage2:'0'},depth:1},
            {data:{level:'PLT0',  stage0:'30',stage1:'30',stage2:'0'},depth:2},
      ]
    },
    message: 'success'
  });
})

router.post('/materialInfo', (req, res) => {
  res.json({
    success: true,
    data:{ 
      name: "Deluxe Touring Bike (black)",
      materialType: "FERT",
      unit: "EA"
    },
    message: 'success'
  });
})

module.exports = router;
