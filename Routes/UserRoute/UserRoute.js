
const express = require('express');
const userRouter = express.Router();
const userRouterControls = require('../../Controls/UserControl/UserRouteControls');

userRouter.route('/')
     .get(userRouterControls.getAllTheUsers)
     .post(userRouterControls.addNewUser);

userRouter
	.route('/:id')
	.get(userRouterControls.getUser)
	.patch(userRouterControls.upDateUser)
	.delete(userRouterControls.deleteUser);

module.exports = userRouter;
