const express = require('express');
const userController = require('../../Controls/UserController/UserController');
const authController = require('../../Controls/AuthController/AuthController');

const userRouter = express.Router();
// all the of the route open for every one
userRouter.post('/singup', authController.singUp);
userRouter.post('/login', authController.login);
userRouter.post('/forgot-password', authController.forgotPassword);
userRouter.patch('/reset-password/:resetToken', authController.resetPassword);

// protect all the are now portect
userRouter.use(authController.protectRoute);
userRouter.patch('/update-password', authController.upDatePassword);
userRouter.patch('/update-account', userController.updateMe);
userRouter.delete('/delete-account', userController.deleteMe);
userRouter.get('/me', userController.getMe, userController.getUser);

// all of route restrict to admin
userRouter.use(authController.restrictTo('admin'));
userRouter
    .route('/')
    .get(userController.getAllTheUsers)
    .post(userController.addNewUser);
userRouter
    .route('/:id')
    .get(userController.getUser)
    .patch(userController.upDateUser)
    .delete(userController.deleteUser);

module.exports = userRouter;
