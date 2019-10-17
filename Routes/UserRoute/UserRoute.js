const express = require('express');
const userRouterControls = require('../../Controls/UserControl/UserRouteControls');
const auth = require('../../Controls/AuthControl/AuthControl');

const userRouter = express.Router();

userRouter.post('/singup', auth.singUp);
userRouter.post('/login', auth.login);

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
