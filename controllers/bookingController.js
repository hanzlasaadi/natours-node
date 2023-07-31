/* eslint-disable import/no-extraneous-dependencies */
const stripe = require('stripe')(`${process.env.STRIPE_PRIVATE}`);
const catchAsync = require('../utils/catchAsync');
const Tour = require('../models/tourModel');
const Booking = require('../models/bookingModel');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1. Find the tour which he/she is trying to buy
  const checkoutTour = await Tour.findById(req.params.tourId);

  // 2. Create Stripe checkout session
  const checkoutSession = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: `${req.protocol}://${req.get('host')}/?tour=${
      checkoutTour.id
    }&user=${req.user.id}&price=${checkoutTour.price}`,
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
            description: checkoutTour.summary
          },
          unit_amount: checkoutTour.price * 100
        },
        quantity: 1
        // images: [`https://____/img/tours/${checkoutTour.imageCover}`],
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

exports.createBookingCheckout = catchAsync(async (req, res, next) => {
  const { tour, user, price } = req.query;

  if (!tour && !user && !price) return next();

  await Booking.create({ tour, user, price });

  // next(); //not using next because url needs to be back to original.
  return res.redirect(req.originalUrl.split('?')[0]);
});
