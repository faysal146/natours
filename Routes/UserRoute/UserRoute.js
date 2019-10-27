const express = require('express');
const userRouterControls = require('../../Controls/UserControl/UserRouteControls');
const authControl = require('../../Controls/AuthControl/AuthControl');

const userRouter = express.Router();
// all the of the route open for every one
userRouter.post('/singup', authControl.singUp);
userRouter.post('/login', authControl.login);
userRouter.post('/forgot-password', authControl.forgotPassword);
userRouter.patch('/reset-password/:resetToken', authControl.resetPassword);

// protect all the are now portect
userRouter.use(authControl.protectRoute);
userRouter.patch('/update-password', authControl.upDatePassword);
userRouter.patch('/update-account', userRouterControls.updateMe);
userRouter.delete('/delete-account', userRouterControls.deleteMe);
userRouter.get('/me', userRouterControls.getMe, userRouterControls.getUser);

// all of route restrict to admin
userRouter.use(authControl.restrictTo('admin'));
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
