import React from "react";
import axios from "axios";
import Order from "./Order";
import {Link} from 'react-router-dom'
import UserProfile from "./auth/UserProfile";

class Cart extends React.Component {
  handleFormSubmit = (event) => {
    event.preventDefault();

    if (this.props.user !== null) {
      //const orderedItem = [this.props.productsInCart];
      const userId = this.props.user._id;

      

      return axios
        .post(
          `${process.env.REACT_APP_API_URL}/orders`,
          {
            items: this.props.productsInCart,
            userId,
          },
          {
            withCredentials: true,
          }
        )
        .then((orderFromDB) => {
          return <UserProfile theOrder={orderFromDB} />;
        });
    }
    // if user not login, redirect to profile page to login/signup
    else {
      this.props.history.push("/profile");
    }
  };

  handleChange = (event, productId) => {
    event.preventDefault();
    this.props.handleQtyChange(event, productId);
  };

  getProductDetails = (productId) => {
    const productObj = this.props.listOfProducts.find((product) => {
      return product._id === productId;
    });
    return (
      <div className="cart-list">
        <ul>
          <li key={productObj._id}>
            <Link to={`/products/${productObj._id}`}>
              <img src={productObj.image} />
              <h3>{productObj.name}</h3>
            </Link>

            <label>
              Qty:
              <input
                type="number"
                min="1"
                name="qty"
                value={this.props.productsInCart[productId]}
                onChange={(e) => this.handleChange(e, productId)}
              />
            </label>
            <p>{productObj.price}</p>
          </li>
        </ul>
      </div>
    );
  };

  getTotalPrice = () => {
    const singleProductTotalPricesArr = Object.keys(this.props.productsInCart).map(
      (productId) => {
        const productPrice = this.props.listOfProducts.find(
          (product) => product._id === productId
        ).price;

        const singleProductTotalPrice =
          productPrice * this.props.productsInCart[productId];
        return singleProductTotalPrice;
      }
    );
    return singleProductTotalPricesArr.reduce((accu,cur)=>accu+cur).toFixed(2)
  };

  render() {
    return (
      <>
        {Object.keys(this.props.productsInCart).length !== 0 ? (
          <div className="order-form">
            {Object.keys(this.props.productsInCart).map((productId) => {
              return this.getProductDetails(productId);
            })}
            <label>Total Price: {this.getTotalPrice()}</label>
            <form onSubmit={this.handleFormSubmit}>
              <input type="submit" value="Submit" />
            </form>
          </div>
        ) : (
          <h1>Currently no product in cart </h1>
        )}
      </>
    );
  }
}

export default Cart;
