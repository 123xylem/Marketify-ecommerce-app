/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import api from "../api";
import { useLocation, useParams } from "react-router-dom";
import { ProductBtn } from "../components/product/ProductBtn";
import { ResponseMessage } from "../components/ResponseMessage";
import ProductRelatedSidebar from "../components/product/ProductRelatedSidebar";
import ProductList from "../components/product/ProductList";
import { useQuery } from "@tanstack/react-query";

let relatedProducts = [];

const ProductDetail = () => {
  // const [loading, setLoading] = useState(true);
  // const [sucessMsg, setSuccessMsg] = useState(null);
  // const [errorMsg, setErrorMsg] = useState(null);
  // const [productData, setProductData] = useState(null);
  const { state } = useLocation();
  const { slug } = useParams();

  let url = state ? `/products/${state.item.id}/` : `/products/${slug}/`;

  const { isError, data, error } = useQuery({
    queryKey: ["product-detail", slug],
    queryFn: async () => {
      // alert(url);
      const response = await api.get(url);
      console.debug(response, "!!!");
      if (!response.status) {
        throw new Error("Network response was not ok");
      }
      return response.data;
    },
    staleTime: 60 * 1000 * 60,
  });

  if (isError) {
    return <span>Error: {error.message}</span>;
  }

  return (
    <>
      {data && (
        <div className="detail-container">
          <h1 className="product-title">{data.product.title}</h1>
          <div className="product-card">
            <img src={data.product.image} alt={data.product.image}></img>
            <p className="product-description">{data.product.description}</p>
            <p className="product-price">${data.product.price}</p>
            <div className="categories">
              {data.product.category
                ?.filter((x) => x != [])
                .map((cat) => (
                  <p className="category" key={`${cat?.id}-${data.product.id}`}>
                    {cat.title}
                  </p>
                ))}
            </div>
          </div>

          <ProductBtn
            className="add-to-cart-btn"
            productId={data.product.id}
          ></ProductBtn>
          <ProductBtn
            className="buy-now-btn"
            productId={data.product.id}
            buyNow="true"
          ></ProductBtn>
          <div className="product-sidebar">
            <h3>Related Products</h3>
            <ProductList products={data.related_products} />
          </div>
        </div>
      )}
    </>
  );
};

export default ProductDetail;
