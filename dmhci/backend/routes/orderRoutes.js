const express = require('express');
const { createOrder, getOrderById, updateOrderStatus, createStripePaymentIntent, getUserOrders, deleteOrder } = require('../controllers/orderController');
const router = express.Router();

router.post('/orders', createOrder);
router.get('/orders/:userId', getUserOrders);
router.put('/orders/:id/status', updateOrderStatus);
router.post('/create-stripe-order', createStripePaymentIntent); 
router.delete('/orders/:id', deleteOrder);
module.exports = router;
