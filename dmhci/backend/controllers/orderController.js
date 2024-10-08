const Order = require('../models/order');
const Stripe = require('stripe');
const stripe = Stripe('sk_test_51Pp5fTDfpvSdJqdzBvBTrcr6tybsN1E0u3Nk6jvTCgaEV6laeZ0Gjazs10LlALHQqUqiGPkSFOCqmr0ksPPQAreY00QiXLWod1'); 

const mongoose = require('mongoose');

const getUserOrders = async (req, res) => {
  const userId = req.params.userId;
  console.log(`ID korisnika: ${userId}`);

  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Neispravan korisnički ID.' });
    }

    const orders = await Order.find({ user: new mongoose.Types.ObjectId(userId) });

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: 'Narudžbina nije pronađena.' });
    }

    // Ovde možeš obraditi ili formatirati narudžbine prema potrebama
    const formattedOrders = orders.map(order => ({
      id: order._id,
      userId: order.user,
      items: order.items,
      totalPrice: order.totalPrice,
      paymentMethod: order.paymentMethod,
      status: order.status,
      createdAt: order.createdAt,
    }));

    return res.json(formattedOrders);
  } catch (error) {
    console.error('Greška pri preuzimanju narudžbina:', error);
    return res.status(500).json({ message: 'Greška servera.' });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Attempting to delete order with ID: ${id}`); // Dodaj log

    const deletedOrder = await Order.findByIdAndDelete(id);

    if (!deletedOrder) {
      return res.status(404).json({ message: 'Narudžbina nije pronađena' });
    }

    res.status(200).json({ message: 'Narudžbina je uspešno otkazana', deletedOrder });
  } catch (error) {
    console.error('Error while deleting order:', error); // Detaljniji log
    res.status(500).json({ message: 'Greška pri otkazivanju narudžbine' });
  }
};


const createOrder = async (req, res) => {
  try {
     console.log(req.body);
    const { user, items, totalPrice, paymentMethod } = req.body;

    if (paymentMethod === 'card') {
      // Ako je plaćanje karticom, pozovite funkciju za kreiranje Stripe Payment Intent-a
      const paymentIntent = await stripe.paymentIntents.create({
        amount: totalPrice * 100, // Amount in the smallest currency unit
        currency: 'INR',
        payment_method_types: ['card'],
      });

      // Vratite client secret koji će se koristiti na klijentskoj strani za plaćanje
      return res.status(200).json({
        clientSecret: paymentIntent.client_secret,
      });
    } else if (paymentMethod === 'cash') {
      // Ako je plaćanje kešom, samo sačuvajte narudžbinu
      const order = new Order({ user, items, totalPrice, paymentMethod });
      await order.save();

      return res.status(201).json({ success: true, order });
    } else {
      return res.status(400).json({ message: 'Invalid payment method' });
    }
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};


const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user').populate('items.product');
    if (!order) return res.status(404).json({ message: 'Order not found' });

    res.status(200).json({ success: true, order });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });

    if (!order) return res.status(404).json({ message: 'Order not found' });

    res.status(200).json({ success: true, order });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

const createStripePaymentIntent = async (req, res) => {
  try {
    const { amount, currency = 'INR' } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Amount in the smallest currency unit
      currency,
      payment_method_types: ['card'],
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Error creating Stripe Payment Intent:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};


module.exports = {
  createOrder,
  getOrderById,
  updateOrderStatus,
  createStripePaymentIntent,
  getUserOrders,
  deleteOrder,
};
