import express from 'express'
import { verifyWebhook, handleWebhook } from '../controllers/webhookController.js'

const webhookRouter = express.Router();

// Meta WhatsApp Cloud API webhook
webhookRouter.get('/', verifyWebhook);
webhookRouter.post('/', handleWebhook);

export default webhookRouter;