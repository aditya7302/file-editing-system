const express = require('express');
const docValidator = require('../middlewares/doc.middleware');
const { getAllDocs, getUserSpecificDocs, postDoc, updateDoc, deleteDoc } = require('../controllers/document.controller');
const authCheck = require('../middlewares/auth.middleware');
const docsRouter = express.Router();




docsRouter.route('/')
     .get(getAllDocs) 
     .post(authCheck, postDoc); 


docsRouter.use(authCheck) 


docsRouter.route('/:id')
     .patch(docValidator, updateDoc) 
     .delete(docValidator, deleteDoc); 


docsRouter.get('/user', getUserSpecificDocs);


module.exports = docsRouter;
