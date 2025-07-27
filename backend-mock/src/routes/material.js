const express = require('express');
const router = express.Router();

// Mock Material Document Data
const mockMaterialDocumentsData = [
  {
    meta: { id: 'MD001' },
    materialDocument: 'MD001',
    plant: '1000',
    postingDate: '2024-07-10',
    documentDate: '2024-07-09',
    materialDocumentYear: '2024',
    items: [
      {
        item: '10',
        material: 'MAT-001',
        orderQuantity: '100',
        orderQuantityUnit: 'EA',
        description: 'Electronic Component A',
        netValue: '1000.00',
        netValueUnit: 'USD',
        pricingDate: '2024-07-09',
        orderProbability: '100',
        reqDelivDate: '2024-07-15',
        taxValue: '150.00',
        taxValueUnit: 'USD',
        pricingElements: [] // Placeholder
      },
      {
        item: '20',
        material: 'MAT-002',
        orderQuantity: '50',
        orderQuantityUnit: 'KG',
        description: 'Raw Material B',
        netValue: '500.00',
        netValueUnit: 'USD',
        pricingDate: '2024-07-09',
        orderProbability: '100',
        reqDelivDate: '2024-07-16',
        taxValue: '75.00',
        taxValueUnit: 'USD',
        pricingElements: [] // Placeholder
      }
    ],
    processFlow: [
      { dlvId: 'DLV001', materialDocument: 'MD001', billId: '' }
    ]
  },
  {
    meta: { id: 'MD002' },
    materialDocument: 'MD002',
    plant: '2000',
    postingDate: '2024-06-25',
    documentDate: '2024-06-24',
    materialDocumentYear: '2024',
    items: [
      {
        item: '10',
        material: 'MAT-003',
        orderQuantity: '200',
        orderQuantityUnit: 'M',
        description: 'Cable',
        netValue: '2000.00',
        netValueUnit: 'EUR',
        pricingDate: '2024-06-24',
        orderProbability: '100',
        reqDelivDate: '2024-07-01',
        taxValue: '300.00',
        taxValueUnit: 'EUR',
        pricingElements: []
      }
    ],
    processFlow: [
      { dlvId: '', materialDocument: 'MD002', billId: 'BILL001' }
    ]
  },
  {
    meta: { id: 'MD003' },
    materialDocument: 'MD003',
    plant: '1000',
    postingDate: '2023-11-15',
    documentDate: '2023-11-14',
    materialDocumentYear: '2023',
    items: [
      {
        item: '10',
        material: 'MAT-001',
        orderQuantity: '50',
        orderQuantityUnit: 'EA',
        description: 'Electronic Component A',
        netValue: '500.00',
        netValueUnit: 'USD',
        pricingDate: '2023-11-14',
        orderProbability: '100',
        reqDelivDate: '2023-11-20',
        taxValue: '75.00',
        taxValueUnit: 'USD',
        pricingElements: []
      }
    ],
    processFlow: [
      { dlvId: 'DLV002', materialDocument: 'MD003', billId: 'BILL002' }
    ]
  }
];

// Helper function: Transforms mock data for search results
const transformMaterialDocumentDataForSearch = (data) => {
  return {
    materialDocument: data.materialDocument,
    plant: data.plant,
    materialDocumentYear: data.materialDocumentYear,
    material: data.items[0]?.material || '', // Assuming first item's material for search display
    postingDate: data.postingDate,
    documentDate: data.documentDate,
    id: data.meta.id, // For VarBox result item 'id'
    result: data.meta.id, // For VarBox result item 'result'
    description: `MD: ${data.materialDocument} | Plant: ${data.plant} | Date: ${data.documentDate}`
  };
};

// Helper function: Transforms mock data for detail page
const transformMaterialDocumentDataForGet = (data) => {
  // Directly map the top-level fields for material document details
  return {
    materialDocument: data.materialDocument,
    plant: data.plant,
    materialDocumentYear: data.materialDocumentYear,
    postingDate: data.postingDate,
    documentDate: data.documentDate,
    items: data.items, // Items array as is
    processFlow: data.processFlow // Process flow array as is
  };
};

// Material Document Search - Mock API
router.post('/search', (req, res) => {
  try {
    const { materialDocument, plant, materialDocumentYear, material, postingDate, documentDate } = req.body;

    console.log('Material Document Search Params:', req.body);

    let results = [...mockMaterialDocumentsData];

    if (materialDocument && materialDocument.trim()) {
      results = results.filter(doc =>
        doc.materialDocument.toLowerCase().includes(materialDocument.toLowerCase())
      );
    }
    if (plant && plant.trim()) {
      results = results.filter(doc =>
        doc.plant.toLowerCase().includes(plant.toLowerCase())
      );
    }
    if (materialDocumentYear && materialDocumentYear.trim()) {
      results = results.filter(doc =>
        doc.materialDocumentYear.includes(materialDocumentYear)
      );
    }
    if (material && material.trim()) {
      results = results.filter(doc =>
        doc.items.some(item => item.material.toLowerCase().includes(material.toLowerCase()))
      );
    }
    if (postingDate && postingDate.trim()) {
      results = results.filter(doc =>
        doc.postingDate === postingDate
      );
    }
    if (documentDate && documentDate.trim()) {
      results = results.filter(doc =>
        doc.documentDate === documentDate
      );
    }

    const formattedResults = results.map(transformMaterialDocumentDataForSearch);

    res.json({
      success: true,
      data: formattedResults,
      message: 'Material documents found successfully.'
    });

  } catch (error) {
    console.error('Error during material document search:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search material documents.',
      error: error.message
    });
  }
});

// Material Document Detail Fetch - Mock API
router.get('/get/:materialDocumentId', (req, res) => {
  try {
    const { materialDocumentId } = req.params;
    console.log('Fetching Material Document by ID:', materialDocumentId);

    const foundDocument = mockMaterialDocumentsData.find(doc =>
      doc.materialDocument.toLowerCase() === materialDocumentId.toLowerCase()
    );

    if (foundDocument) {
      const transformedData = transformMaterialDocumentDataForGet(foundDocument);
      res.json({
        success: true,
        data: transformedData,
        message: `Material document ${materialDocumentId} found successfully.`
      });
    } else {
      res.status(404).json({
        success: false,
        message: `Material document ${materialDocumentId} not found.`
      });
    }
  } catch (error) {
    console.error('Error fetching material document by ID:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch material document details.',
      error: error.message
    });
  }
});

// Material Document Creation - Mock API
router.post('/create', (req, res) => {
  try {
    const newDocumentData = req.body;
    console.log('Creating Material Document with data:', newDocumentData);

    const newMdId = `MD${(mockMaterialDocumentsData.length + 1).toString().padStart(3, '0')}`;
    const createdDocument = {
      meta: { id: newMdId },
      materialDocument: newMdId,
      ...newDocumentData, // Merge incoming data
      // Add any default values not provided in the request body
      items: newDocumentData.items || [],
      processFlow: newDocumentData.processFlow || []
    };
    mockMaterialDocumentsData.push(createdDocument);

    res.json({
      success: true,
      data: { materialDocument: newMdId },
      message: `Material Document ${newMdId} created successfully.`
    });
  } catch (error) {
    console.error('Error creating material document:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create material document.',
      error: error.message
    });
  }
});

// Material Document Edit - Mock API
router.post('/edit', (req, res) => {
  try {
    const updatedDocumentData = req.body;
    // Prioritize materialDocument from the body for update, then meta.id if available
    const mdIdToUpdate = updatedDocumentData.materialDocument || updatedDocumentData?.meta?.id;
    console.log('Editing Material Document with ID:', mdIdToUpdate, 'Data:', updatedDocumentData);

    const index = mockMaterialDocumentsData.findIndex(doc =>
      String(doc.materialDocument).toLowerCase() === String(mdIdToUpdate).toLowerCase()
    );

    if (index !== -1) {
      // Update existing document, merging new data while preserving existing structure
      // Ensure specific fields that are typically top-level in the mock data are handled
      mockMaterialDocumentsData[index] = {
        ...mockMaterialDocumentsData[index],
        ...updatedDocumentData,
        meta: { id: mdIdToUpdate }, // Ensure meta.id remains
        materialDocument: mdIdToUpdate // Ensure materialDocument ID remains consistent
      };

      res.json({
        success: true,
        data: { materialDocument: mdIdToUpdate },
        message: `Material Document ${mdIdToUpdate} updated successfully.`
      });
    } else {
      res.status(404).json({
        success: false,
        message: `Material Document ${mdIdToUpdate} not found for update.`
      });
    }
  } catch (error) {
    console.error('Error editing material document:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to edit material document.',
      error: error.message
    });
  }
});

module.exports = router;