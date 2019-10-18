const express = require('express');
const userRouterControls = require('../../Controls/UserControl/UserRouteControls');
const authControl = require('../../Controls/AuthControl/AuthControl');

const userRouter = express.Router();

userRouter.post('/singup', authControl.singUp);
userRouter.post('/login', authControl.login);

userRouter
    .route('/')
    .get(userRouterControls.getAllTheUsers)
    .post(userRouterControls.addNewUser);

userRouter
    .route('/:id')
    .get(userRouterControls.getUser)
    .patch(userRouterControls.upDateUser)
    .delete(userRouterControls.deleteUser);

module.exports = userRouter;
