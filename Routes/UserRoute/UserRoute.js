const express = require('express');
const userRouterControls = require('../../Controls/UserControl/UserRouteControls');
const authControl = require('../../Controls/AuthControl/AuthControl');

const userRouter = express.Router();

userRouter.post('/singup', authControl.singUp);
userRouter.post('/login', authControl.login);

userRouter.post('/forgot-password', authControl.forgotPassword);
userRouter.patch('/reset-password/:resetToken', authControl.resetPassword);
userRouter.patch(
    '/update-password',
    authControl.protectRoute,
    authControl.upDatePassword
);
userRouter.patch(
    '/update-current-user',
    authControl.protectRoute,
    userRouterControls.upDateCurrent
);

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
