/* eslint-disable import/no-extraneous-dependencies */
const stripe = require('stripe')(`${process.env.STRIPE_PRIVATE}`);
const catchAsync = require('../utils/catchAsync');
const Tour = require('../models/tourModel');
const Booking = require('../models/bookingModel');
const AppError = require('../utils/appError');
const User = require('../models/userModel');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1. Find the tour which he/she is trying to buy
  const checkoutTour = await Tour.findById(req.params.tourId);

  // 2. Create Stripe checkout session
  const checkoutSession = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: `${req.protocol}://${req.get('host')}/my-tours`,
    cancel_url: `${req.protocol}://${req.get('host')}/tour/${
      checkoutTour.slug
    }`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `${checkoutTour.name} Tour`,
            description: checkoutTour.summary,
            images: [
              `${req.protocol}://${req.get('host')}/img/tours/${
                checkoutTour.imageCover
              }`
            ]
          },
          unit_amount: checkoutTour.price * 100
        },
        quantity: 1
      }
    ],
    mode: 'payment'
  });

  // 3. Create session as respnse
  return res.status(200).json({
    status: 'success',
    session: checkoutSession
  });
});

// exports.createBookingCheckout = catchAsync(async (req, res, next) => {
//   const { tour, user, price } = req.query;

//   if (!tour && !user && !price) return next();

//   await Booking.create({ tour, user, price });

//   // next(); //not using next because url needs to be back to original.
//   return res.redirect(req.originalUrl.split('?')[0]);
// });

const createBookingCheckout = async session => {
  const tour = session.client_reference_id;
  const price = session.line_items[0].price_data.unit_amount / 100;
  const user = (await User.findOne({ email: session.customer_email })).id;

  await Booking.create({ tour, user, price });
};

exports.webhookCheckout = catchAsync(async (req, res, next) => {
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.WEBHOOK_SECRET
    );
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      // Then define and call a function to handle the event checkout.session.completed
      createBookingCheckout(event.data.object);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
      next(
        new AppError(
          400,
          'Could not create a completed checkout in the database!'
        )
      );
  }

  // Return a 200 res to acknowledge receipt of the event
  res.status(200).json({ received: true });
});
