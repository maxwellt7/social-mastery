import { Router } from 'express'
import * as templateController from '../controllers/templateController'

const router = Router()

router.post('/from-ig-post', templateController.createFromIGPost)
router.get('/', templateController.getTemplates)
router.get('/:id', templateController.getTemplate)
router.patch('/:id', templateController.updateTemplate)
router.delete('/:id', templateController.deleteTemplate)
router.post('/variable-mapping', templateController.saveVariableMapping)
router.get('/:id/variable-mappings', templateController.getVariableMappings)

export default router

