import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { AdminHeader } from "./AdminHeader";
import { Button } from "./Button";
import { toastNotifyError, toastNotifySuccess } from "../utils/toast-notify";

const BACKEND_API = process.env.REACT_APP_BACKEND_API;

export const AdminUpdateProduct = () => {
  let navigate = useNavigate();
  const ref = useRef();
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState("");
  const [cost, setCost] = useState("");
  const [brand, setBrand] = useState("");
  const [count, setCount] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [imageURL, setImageURL] = useState("");

  const { productId } = useParams();

  const uploadFormData = async () => {
    const updatedData = {
      productName: product,
      cost: cost,
      count: count,
      description: description,
      brand: brand,
      imageURL: imageURL,
    };
    if (image != "") {
      const file = image.files[0];
      let formData = new FormData();
      formData.append("image", file);
      try {
        setLoading(true);
        const { data } = await axios.post(
          `${BACKEND_API}/product/upload-image`,
          formData,
          { headers: { authorization: localStorage.getItem("store-token") } }
        );

        updatedData.imageURL = data.imageURL;
      } catch (err) {
        setLoading(false);
        toastNotifyError("Something went wrong.");
      }
    }

    try {
      setLoading(true);
      await axios.put(
        `${BACKEND_API}/product/update-details/${productId}`,
        updatedData,
        { headers: { authorization: localStorage.getItem("store-token") } }
      );

      toastNotifySuccess("Product Details updated.");
      navigate("/admin/home");
    } catch (err) {
      console.log(err);
      toastNotifyError("Something went wrong.");
    }

    setLoading(false);
  };

  const fetchProduct = async () => {
    const { data } = await axios.get(`${BACKEND_API}/product/${productId}`);
    const { productName, cost, count, brand, description, imageURL } =
      data.result;
    setBrand(brand);
    setCost(cost);
    setCount(count);
    setDescription(description);
    setProduct(productName);
    setImageURL(imageURL);
  };

  useEffect(() => {
    fetchProduct();
  }, []);
  return (
    <div>
      <AdminHeader />

      <div className="flex justify-center items-center min-h-[100vh] bg-blue-200">
        <div className="add-product-input-container mt-20 pt-4 bg-orange-200 p-5 w-[90%] rounded-lg shadow-lg sm:w-[600px]">
          <form>
            <div className="product-name-input text-lg">
              <label htmlFor="product-name">Product Name</label> <br />
              <input
                className="w-[100%] mt-1 mb-2 p-1 rounded-md"
                type="text"
                id="product-name"
                value={product}
                name="product-name"
                placeholder="enter product name..."
                onChange={(e) => {
                  setProduct(e.target.value);
                }}
              />
            </div>

            <div className="cost-input text-lg">
              <label htmlFor="cost">Cost</label> <br />
              <input
                className="w-[100%] mt-1 mb-2 p-1 rounded-md"
                type="text"
                value={cost}
                id="cost"
                name="cost"
                placeholder="enter cost..."
                onChange={(e) => {
                  setCost(e.target.value);
                }}
              />
            </div>

            <div className="brand-input text-lg">
              <label htmlFor="brand">Brand</label> <br />
              <input
                className="w-[100%] mt-1 mb-2 p-1 rounded-md"
                type="text"
                value={brand}
                id="brand"
                name="brand"
                placeholder="enter brand name..."
                onChange={(e) => {
                  setBrand(e.target.value);
                }}
              />
            </div>

            <div className="count-input text-lg">
              <label htmlFor="count">No.of Products</label> <br />
              <input
                className="w-[100%] mt-1 mb-2 p-1 rounded-md"
                type="text"
                value={count}
                id="count"
                name="count"
                placeholder="enter no.of products..."
                onChange={(e) => {
                  setCount(e.target.value);
                }}
              />
            </div>

            <div className="description-input text-lg">
              <label htmlFor="description">Description</label> <br />
              <textarea
                className="w-[100%] mt-1 mb-2 p-1 rounded-md resize-none"
                rows={4}
                id="description"
                value={description}
                name="description"
                placeholder="enter description..."
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
              />
            </div>

            <div className="image-input text-lg">
              <label htmlFor="image">Image</label> <br />
              <input
                className="w-[100%] mt-1 mb-2 p-1"
                type="file"
                id="image"
                ref={ref}
                name="file-input"
                onChange={(e) => {
                  setImage(e.target);
                }}
              />
            </div>

            <div className="btn flex justify-center">
              <Button
                loading={loading}
                className={"add-product-btn"}
                functionOnClick={uploadFormData}
                content={"Update Product"}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
