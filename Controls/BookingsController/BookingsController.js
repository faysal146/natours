const stripe = require('stripe')(process.env.STRIP_SECRET_KEY);
const Tour = require('../../Models/TourModel/TourModel');
const Booking = require('../../Models/BookingModel/BookingModel');
const catchError = require('../../Utils/catchError');
const factoryHandler = require('../FactoryHandler/FactoryHandler');
//const ErrorHandler = require('../../Utils/ErrorHandler');

// api/v1/bookings/checkout-session/:tourId
exports.getCheckoutSession = catchError(async (req, res, next) => {
    // 1) findtour by id
    const tour = await Tour.findById(req.params.tourId);
    // 2) create checkout session
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        // payment is successfull pass tour data using query string for bookings
        success_url: `${req.protocol}://${req.get('host')}/?tour=${tour.id}&user=${req.user.id}&price=${tour.price}`,
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
// confirm booking
exports.confirmBooking = catchError(async (req, res, next) => {
    // checkj
    const { tour, price, user } = req.query;
    if (!tour && !price && !user) return next();

    await Booking.create({ tour, price, user });
    // redirect to the home page
    const redirUrl = req.originalUrl.split('?')[0];
    res.redirect(redirUrl);
});
// below all controller is for admin and lead guid
exports.getAllBookings = factoryHandler.getAll(Booking);
exports.getOneBooking = factoryHandler.getOne(Booking);
exports.createBooking = factoryHandler.createOne(Booking);
exports.updateBooking = factoryHandler.updateOne(Booking);
exports.deleteBooking = factoryHandler.deleteOne(Booking);
