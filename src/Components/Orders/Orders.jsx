import React, { useState, useEffect, useContext } from "react";
import {
  Card,
  Image,
  Typography,
  Pagination,
  Divider,
  Result,
  Skeleton,
} from "antd";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { fetchGet } from "../FetchData";
import { StoreContext } from "../../Store/data";
import OrderItemHeading from "./OrderItemHeading";
import deleteAllCookies from "../Util";
import "./Orders.css";

const { Text, Title } = Typography;

const Orders = ({ accountCall = false }) => {
  let navigate = useNavigate();
  const [apiCalled, setapiCalled] = useState(false);
  const [total, setTotal] = useState(10);
  const [orders, setOrders] = useState([]);
  const { isLogin, setisLogin, userId } = useContext(StoreContext);
  const [pagination, setpagination] = useState({ page: 1, pageSize: 5 });
  useEffect(() => {
    if (isLogin) {
      if (userId != null && userId !== undefined) getOrders();
    } else {
      deleteAllCookies();
      setisLogin(false);
    }
  }, [isLogin, userId]); // eslint-disable-line react-hooks/exhaustive-deps

  const onPageChange = (page, pageSize) => {
    getOrders(page, pageSize);
  };

  const getOrders = async (page = 0, pageSize = 0) => {
    setapiCalled(true);
    const response = await fetchGet(
      `https://shofferstopprodservice.azurewebsites.net/order?` +
        new URLSearchParams({
          userId: userId,
          page: page !== 0 ? page : pagination.page,
          pageSize: pageSize !== 0 ? pageSize : pagination.pageSize,
        })
    );
    setpagination(response.pagination);
    setTotal(response.total);
    setOrders([...response.orderItems]);
    setapiCalled(false);
  };

  return (
    <>
      {isLogin ? (
        <>
          <Title style={{ color: "red", fontSize: "20px" }}>Your Orders</Title>
          {!apiCalled ? (
            <div className="orders">
              <div>
                {orders.length > 0 ? (
                  <>
                    {orders.map((val, index) => (
                      <Card
                        className={accountCall ? "order_account" : "order_card"}
                        key={index}
                        size="small"
                        title={
                          <OrderItemHeading
                            date={val.date}
                            price={val.totalPrice}
                            fullName={val.fullName}
                            accountCall={accountCall}
                          />
                        }
                        extra={<Link to={`${val.id}`}>View Order Details</Link>}
                      >
                        {val.items.length > 0 &&
                          val.items.map((value, index) => (
                            <div key={index + "order"}>
                              <div
                                className="order_cardBody"
                                onClick={() =>
                                  navigate(`/product/${value.productName}`)
                                }
                              >
                                <div className="order_product_image">
                                  <Image
                                    width={80}
                                    height={80}
                                    src={value.productImage}
                                    preview={false}
                                    fallback="/image_not_available.png"
                                  />
                                </div>
                                <div className="order_product_detail">
                                  <Text strong>{value.productBrand}</Text>
                                  <Text type="secondary">
                                    {value.productName}
                                  </Text>
                                  <div>
                                    <Text strong>Qty:&nbsp;</Text>
                                    <Text strong type="danger">
                                      {value.productQuantity}
                                    </Text>
                                  </div>
                                  <Text strong type="success">
                                    ₹{value.discountedPrice}
                                  </Text>
                                </div>
                              </div>
                              <Divider />
                            </div>
                          ))}
                        {val.gifts.length > 0 &&
                          val.gifts.map((value, index) => (
                            <div key={index + "ordergift"}>
                              <div
                                className="order_cardBody"
                                onClick={() =>
                                  navigate(`/product/${value.productName}`)
                                }
                              >
                                <div className="order_product_image">
                                  <Image
                                    width={80}
                                    height={80}
                                    src={value.productImage}
                                    preview={false}
                                    fallback="/image_not_available.png"
                                  />
                                </div>
                                <div className="order_product_detail">
                                  <Text strong>{value.productBrand}</Text>
                                  <Text type="secondary">
                                    {value.productName}
                                  </Text>
                                  <div>
                                    <Text strong>Qty:&nbsp;</Text>
                                    <Text strong type="danger">
                                      {value.productQuantity}
                                    </Text>
                                  </div>
                                  <Text strong type="danger">
                                    Free Gift
                                  </Text>
                                </div>
                              </div>
                              <Divider />
                            </div>
                          ))}
                      </Card>
                    ))}
                  </>
                ) : (
                  <div
                    style={{
                      width: "80vw",
                      height: "75vh",
                      textAlign: "center",
                    }}
                  >
                    <Image
                      width="50vw"
                      height="50vh"
                      src="/orders.jpg"
                      preview={false}
                    />
                  </div>
                )}
              </div>
              {orders != null && orders.length > 0 && (
                <Pagination
                  size="small"
                  showQuickJumper
                  pageSize={pagination.pageSize}
                  current={pagination.page}
                  total={total}
                  pageSizeOptions={[5, 10, 20]}
                  showSizeChanger={total > 5}
                  onChange={onPageChange}
                />
              )}
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                flexWrap: "wrap",
                alignItems: "center",
                marginRight: "20px",
              }}
            >
              <Skeleton.Input
                active={true}
                style={{
                  marginTop: "0px",
                  height: "150px",
                  width: "550px",
                  minWidth: "300px",
                  marginBottom: "10px",
                }}
              />
              <Skeleton.Input
                active={true}
                style={{
                  marginTop: "0px",
                  height: "150px",
                  width: "550px",
                  minWidth: "300px",
                  marginBottom: "10px",
                }}
              />
              <Skeleton.Input
                active={true}
                style={{
                  marginTop: "0px",
                  height: "150px",
                  width: "550px",
                  minWidth: "300px",
                  marginBottom: "10px",
                }}
              />
              <Skeleton.Input
                active={true}
                style={{
                  marginTop: "0px",
                  height: "150px",
                  width: "550px",
                  minWidth: "300px",
                }}
              />
            </div>
          )}
        </>
      ) : (
        <Result
          status="403"
          title="Please login to view orders!!!"
          subTitle="Sorry, you are not authorized to access this page."
          extra={<Link to="/">Back Home</Link>}
        />
      )}
    </>
  );
};

export default Orders;
