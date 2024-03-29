const CartServices = require("../services/cart");

const addToCart = async (req, res, next) => {
  try {
    const { productId } = req.body;
    const { _id: userId } = req.user;

    const productInCart = await CartServices.inCart(userId, productId);
    if (productInCart) {
      await CartServices.incrementQuantity(userId, productId, 1);

      return res.status(202).json({
        success: true,
        message: "Product already in cart, quantity incremented.",
      });
    }

    const product = await CartServices.addToCart(userId, productId, 1);

    return res
      .status(202)
      .json({ success: true, message: "Product Added to cart" });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong." });
  }
};

const deleteFromCart = async (req, res, next) => {
  try {
    const productId = req.params.productId;
    const { _id: userId } = req.user;

    const result = await CartServices.deleteFromCart(userId, productId);
    return res
      .status(200)
      .json({ success: true, message: "Product deleted from cart." });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong." });
  }
};

const getCartProducts = async (req, res, next) => {
  try {
    const { _id: userId } = req.user;

    const products = await CartServices.getCartProducts(userId);
    return res.status(200).json({ success: true, products });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong." });
  }
};

module.exports = { addToCart, deleteFromCart, getCartProducts };
