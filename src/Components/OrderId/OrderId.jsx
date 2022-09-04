import React, { useState, useEffect, useContext } from "react";
import { Card, Image, Typography, Divider, Timeline, Skeleton } from "antd";
import { SyncOutlined } from "@ant-design/icons";
import { useParams, useNavigate } from "react-router-dom";
import deleteAllCookies from "../Util";
import { StoreContext } from "../../Store/data";
import { fetchGet } from "../FetchData";
import "./OrderId.css";
import AddressCard from "../Account/ProfileAddress/AddressCard";

const { Text } = Typography;

const OrderId = () => {
  let navigate = useNavigate();
  const { orderId } = useParams();
  const [apiCalled, setapiCalled] = useState(false);
  const [orders, setOrders] = useState({});
  const { isLogin, setisLogin, userId } = useContext(StoreContext);
  const [orderDates, setOrderDates] = useState(["", "", "", ""]);
  const [orderDatesStatus, setOrderDatesStatus] = useState(["", "", "", ""]);

  useEffect(() => {
    if (isLogin) {
      if (
        userId != null &&
        userId !== undefined &&
        orderId != null &&
        orderId !== undefined
      )
        getOrders();
    } else {
      deleteAllCookies();
      setisLogin(false);
    }
  }, [isLogin, orderId, userId]); // eslint-disable-line react-hooks/exhaustive-deps

  const getOrders = async () => {
    setapiCalled(true);
    const response = await fetchGet(
      `https://shofferstop-prodservice.herokuapp.com/order/${orderId}?` +
        new URLSearchParams({
          userId: userId,
        })
    );
    setOrders({ ...response });
    setOrderDates(response.orderDates);
    setOrderDatesStatus(response.orderDatesStatus);
    setapiCalled(false);
  };
  return (
    <>
      {!apiCalled ? (
        <>
          {Object.keys(orders).length > 0 ? (
            <div className="orderId">
              <div className="orderId_address">
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <Text type="secondary">Ordered On: </Text>
                  <Text strong>{orders.date}</Text>
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <Text type="secondary">Order Total: </Text>
                  <Text strong type="success">
                    ₹{orders.totalPrice}
                  </Text>
                </div>
              </div>
              <div className="orderId_address">
                <AddressCard val={orders.address} />
              </div>
              <div className="orderId_status">
                <Card
                  className="orderId_order_status"
                  bodyStyle={{
                    display: "flex",
                    justifyContent: "center",
                    width: "90vw",
                    maxWidth: "800px",
                    minWidth: "300px",
                  }}
                >
                  <div className="orderId_status_div">
                    <Timeline mode="left">
                      <Timeline.Item
                        label={orderDates[0]}
                        dot={
                          orderDatesStatus[0] === "0" && (
                            <SyncOutlined
                              spin
                              style={{
                                color: "#1890FF",
                                fontSize: "14px",
                              }}
                            />
                          )
                        }
                        color={orderDatesStatus[0] === "-1" && "green"}
                      >
                        <Text strong>Order Placed</Text>
                      </Timeline.Item>
                      <Timeline.Item
                        label={orderDates[1]}
                        dot={
                          orderDatesStatus[1] === "0" && (
                            <SyncOutlined
                              spin
                              style={{
                                color: "#1890FF",
                                fontSize: "14px",
                              }}
                            />
                          )
                        }
                        color={orderDatesStatus[1] === "-1" ? "green" : "grey"}
                      >
                        <Text strong>Shipped</Text>
                      </Timeline.Item>
                      <Timeline.Item
                        label={orderDates[2]}
                        dot={
                          orderDatesStatus[2] === "0" && (
                            <SyncOutlined
                              spin
                              style={{
                                color: "#1890FF",
                                fontSize: "14px",
                              }}
                            />
                          )
                        }
                        color={orderDatesStatus[2] === "-1" ? "green" : "grey"}
                      >
                        <Text strong>Out For Delivery</Text>
                      </Timeline.Item>
                      <Timeline.Item
                        label={orderDates[3]}
                        dot={
                          orderDatesStatus[3] === "0" && (
                            <SyncOutlined
                              spin
                              style={{
                                color: "#1890FF",
                                fontSize: "14px",
                              }}
                            />
                          )
                        }
                        color={orderDatesStatus[3] === "-1" ? "green" : "grey"}
                      >
                        <Text strong>Delivered</Text>
                      </Timeline.Item>
                    </Timeline>
                  </div>
                </Card>
              </div>
              <div className="orderId_items">
                <Card className="order_card" size="small">
                  {orders.items.length > 0 &&
                    orders.items.map((value, index) => (
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
                            <Text type="secondary">{value.productName}</Text>
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
                  {orders.gifts.length > 0 &&
                    orders.gifts.map((value, index) => (
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
                            <Text type="secondary">{value.productName}</Text>
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
              </div>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "center",
                height: "75vh",
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
        </>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flexWrap: "wrap",
            alignItems: "center",
            marginTop: "50px",
          }}
        >
          <Skeleton.Input
            active={true}
            style={{
              marginTop: "0px",
              height: "100px",
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
              height: "250px",
              width: "550px",
              minWidth: "300px",
            }}
          />
        </div>
      )}
    </>
  );
};

export default OrderId;
