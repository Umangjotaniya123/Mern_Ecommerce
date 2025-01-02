import express from 'express'
import { allCartItems, deleteCartItem, newCartItems, updateCartItemQuantity } from '../controllers/cartItems.js';
import { isUserLogin } from '../middlewares/auth.js';

const app = express.Router();

app.post('/new', isUserLogin, newCartItems);

app.get('/all', allCartItems);

app.route('/:id')
    .put(updateCartItemQuantity)
    .delete(deleteCartItem);

export default app;