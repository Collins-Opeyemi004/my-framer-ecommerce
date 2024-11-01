const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const Stripe = require('stripe');
require('dotenv').config();

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const app = express();

app.use(cors()); // Allow cross-origin requests
app.use(bodyParser.json()); // To handle JSON payloads

// Create Stripe Checkout session
app.post('/create-checkout-session', async (req, res) => {
  const { items } = req.body;  // Expecting cart items in the request body

  // Create line items from the cart items sent from frontend
  const lineItems = items.map(item => ({
    price_data: {
      currency: 'usd',
      product_data: {
        name: item.name,
      },
      unit_amount: item.price * 100,  // price in cents
    },
    quantity: item.quantity,
  }));

  try {
    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: 'https://incredible-function-851124.framer.app/form', // URL after successful payment
      cancel_url: 'https://incredible-function-851124.framer.app/cart',  // URL if payment is cancelled
    });

    res.json({ id: session.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start the server
app.listen(3000, () => console.log('Server running on port 3000'));
