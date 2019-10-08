const fs = require('fs');
const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);
const PATH = {
	createPost: `${__dirname}/../dev-data/data/test/create_post.json`,
	upDateTour: `${__dirname}/../dev-data/data/test/up_date_tour.json`,
	deleteTour: `${__dirname}/../dev-data/data/test/delete_tour.json`
};
exports.getAllPost = (req, res) => {
	res.status(200).send({
		status: 'success',
		result: tours.length,
		data: {
			tours
		}
	});
};
exports.createPost = (req, res) => {
	const id = tours[tours.length - 1].id + 1;
	const newTour = { ...req.body, id };
	const upDateTours = tours.concat(newTour);
	fs.writeFile(PATH.createPost, JSON.stringify(upDateTours), () => {
		res.status(201).json({
			status: 'success',
			data: {
				tour: newTour
			}
		});
	});
};

exports.getTour = (req, res) => {
	const tourId = +req.params.id;
	const tour = tours.find((tr) => tr.id === tourId);
	if (!tour) {
		res.status(404).json({
			status: 'fail',
			message: 'Tour Not Found'
		});
	} else {
		res.status(200).json({
			status: 'success',
			data: {
				tour
			}
		});
	}
};
exports.upDateTour = (req, res) => {
	const tourId = +req.params.id;
	const tour = tours.find((tr) => tr.id === tourId);
	if (!tour) {
		res.status(404).json({
			status: 'fail',
			message: 'Tour Not Found'
		});
	} else {
		const upDateTour = {
			...tour,
			...req.body
		};
		fs.writeFile(PATH.upDateTour, JSON.stringify(upDateTour), () => {
			res.status(200).json({
				status: 'success',
				data: {
					tour: upDateTour
				}
			});
		});
	}
};
exports.deleteTour = (req, res) => {
	const tourId = +req.params.id;
	const tour = tours.find((tr) => tr.id === tourId);
	if (!tour) {
		res.status(404).json({
			status: 'fail',
			message: 'Tour Not Found'
		});
	} else {
		const afterRemoveTour = tours.filter((dl) => dl.id !== tourId);
		fs.writeFile(PATH.deleteTour, JSON.stringify(afterRemoveTour), () => {
			res.status(204).json({
				status: 'success',
				data: null
			});
		});
	}
};
