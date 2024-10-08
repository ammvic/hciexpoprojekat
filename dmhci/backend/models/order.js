const mongoose = require('mongoose');

// Definisanje šeme za stavke narudžbine (items)
const ItemSchema = new mongoose.Schema({
  productId: {
    type: String,
    ref: 'Product', // Refers to the Product model
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

// Definisanje glavne šeme za narudžbinu (Order)
const OrderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Refers to the User model
    required: true,
  },
  items: [ItemSchema], // Niz stavki sa informacijama o proizvodima
  totalPrice: {
    type: Number,
    required: true,
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'cash'], // Plaćanje karticom ili kešom
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'shipped', 'delivered', 'cancelled'], // Status narudžbine
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Kreiranje modela na osnovu šeme
const Order = mongoose.model('Order', OrderSchema);

module.exports = Order;
