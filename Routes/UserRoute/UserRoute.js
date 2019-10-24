const express = require('express');
const userRouterControls = require('../../Controls/UserControl/UserRouteControls');
const authControl = require('../../Controls/AuthControl/AuthControl');

const userRouter = express.Router();
// auth route
userRouter.post('/singup', authControl.singUp);
userRouter.post('/login', authControl.login);
//
userRouter.post('/forgot-password', authControl.forgotPassword);
userRouter.patch('/reset-password/:resetToken', authControl.resetPassword);

userRouter.patch(
    '/update-password',
    authControl.protectRoute,
    authControl.upDatePassword
);

userRouter.patch(
    '/update-account',
    authControl.protectRoute,
    userRouterControls.updateCurrentUserData
);

userRouter.delete(
    '/delete-account',
    authControl.protectRoute,
    userRouterControls.deleteCurrentUser
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
