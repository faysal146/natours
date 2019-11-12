const stripe = require('stripe')(process.env.STRIP_SECRET_KEY);
const Tour = require('../../Models/TourModel/TourModel');
const catchError = require('../../Utils/catchError');
//const ErrorHandler = require('../../Utils/ErrorHandler');

// api/v1/bookings/checkout-session/:tourId
exports.getBookings = catchError(async (req, res, next) => {
    // 1) findtour by id
    const tour = await Tour.findById(req.params.tourId);
    // 2) create checkout session
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        success_url: `${req.protocol}://${req.get('host')}/`,
        cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
        customer_email: req.user.email,
        client_reference_id: req.params.tourId,
        line_items: [
            {
                name: tour.name,
                description: tour.description,
                images: [`https://www.natours.dev/img/tours/${tour.imageCover}`],
                amount: tour.price * 100, // in stripe amount count as (cent) not (doller)
                currency: 'usd',
                quantity: 1
            }
        ]
    });
    res.status(200).json({
        status: 'success',
        session
    });
});
