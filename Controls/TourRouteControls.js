const fs = require('fs');
const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);
const PATH = {
	createPost: `${__dirname}/../dev-data/data/test/create_post.json`,
	upDateTour: `${__dirname}/../dev-data/data/test/up_date_tour.json`,
	deleteTour: `${__dirname}/../dev-data/data/test/delete_tour.json`
};

exports.checkBody = (req, res, next) => {
	if (!req.body.price || !req.body.name) {
		return res.status(400).json({
			status: 'fail',
			message: 'bad request'
		})
	}
	next();
}

exports.checkId = (req,res,next,id) => {
	const tour = tours.find((tr) => tr.id === (+id));
	if (!tour) {
		res.status(404).json({
			status: 'fail',
			message: 'Tour Not Found'
		});
	} else {
		next()
	}
}


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
	const tour = tours.find((tr) => tr.id === (+req.params.id));
	res.status(200).json({
		status: 'success',
		data: {
			tour
		}
	});
}
exports.upDateTour = (req, res) => {
	const tour = tours.find((tr) => tr.id === (+req.params.id));
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

exports.deleteTour = (req, res) => {
	const afterRemoveTour = tours.filter((dl) => dl.id !== (+req.params.id));
	fs.writeFile(PATH.deleteTour, JSON.stringify(afterRemoveTour), () => {
		res.status(204).json({
			status: 'success',
			data: null
		});
	});
}
