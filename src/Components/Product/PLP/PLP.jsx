import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchGet } from "../../FetchData";
import {
  Card,
  message,
  Typography,
  Divider,
  Select,
  Collapse,
  Slider,
  Pagination,
  Skeleton,
} from "antd";
import "./PLP.css";

const { Title, Text, Paragraph } = Typography;
const { Meta } = Card;
const { Option } = Select;
const { Panel } = Collapse;

const PLP = () => {
  let navigate = useNavigate();
  const { categoryId } = useParams();
  const [apiCalled, setapiCalled] = useState(false);
  const [products, setProducts] = useState([]);
  const [pagination, setpagination] = useState({ page: 1, pageSize: 12 });
  const [total, setTotal] = useState(10);
  const [brand, setBrand] = useState([]);
  const [brandValue, setbrandValue] = useState([]);
  const [priceValue, setPriceValue] = useState([]);
  const [minPrice, setminPrice] = useState(0);
  const [maxPrice, setmaxPrice] = useState(0);
  const filteredOptions = brand.filter((o) => !brandValue.includes(o));
  const [sortByvalue, setsortByValue] = useState("popularity");

  const sortBy = [
    { label: "Popularity", value: "popularity" },
    { label: "Price: High to Low", value: "htol" },
    { label: "Price: Low to High", value: "ltoh" },
    { label: "Better Discount", value: "betterDiscount" },
  ];
  const onPageChange = (page, pageSize) => {
    setBrand([]);
    setminPrice(0);
    setmaxPrice(0);
    let filter = {};
    filter.brand = brandValue.toString;
    getProduct(page, pageSize, "", filter);
  };

  const pdpCalled = (name) => {
    navigate(`/${name}`);
  };

  const onClearAll = () => {
    setbrandValue([]);
    setPriceValue([]);
    setminPrice(0);
    setmaxPrice(0);
    let filter = {};
    getProduct(pagination.page, pagination.pageSize, "", filter);
  };

  const sortByOptions = [];
  for (let i = 0; i < sortBy.length; i++) {
    sortByOptions.push(
      <Option key={sortBy[i].label + i} value={sortBy[i].value}>
        {sortBy[i].label}
      </Option>
    );
  }

  const handleSortByChange = (value) => {
    setsortByValue(value);
    let filter = {};
    filter.brand = brandValue.toString();
    filter.price = priceValue.toString();
    getProduct(pagination.page, pagination.pageSize, value, filter);
  };

  const onPriceChange = (val) => {
    let filter = {};
    setPriceValue(val);
    filter.brand = brandValue.toString();
    filter.price = val.toString();
    getProduct(pagination.page, pagination.pageSize, sortByvalue, filter);
  };

  useEffect(() => {
    setbrandValue([]);
    let filter = {};
    getProduct(pagination.page, pagination.pageSize, sortByvalue, filter);
  }, [categoryId]);

  useEffect(() => {
    if (brandValue.length > 0) {
      let filter = {};
      filter.brand = brandValue.toString();
      getProduct(pagination.page, pagination.pageSize, sortByvalue, filter);
    }
  }, [brandValue]);

  const getProduct = async (page, pageSize, sortBy = "", filter = {}) => {
    setapiCalled(true);
    setProducts([]);
    try {
      const response = await fetchGet(
        `https://shofferstop-prodservice.herokuapp.com/product/category/${categoryId}?` +
          new URLSearchParams({
            sortBy: sortBy.length > 0 ? sortBy : sortByvalue,
            filter: JSON.stringify(filter),
            page: page,
            pageSize: pageSize,
          })
      );
      setpagination(response.pagination);
      setTotal(response.total);
      setBrand([...response.brands]);
      setProducts(constructProd(response.products));
      setapiCalled(false);
    } catch (err) {
      message.error(err.message);
    }
  };

  const constructProd = (products) => {
    let minPrice = Math.min(),
      maxPrice = Math.max();
    if (products != null && products.length > 0) {
      products.forEach((val) => {
        if (val.discountedPrice < minPrice) {
          minPrice = val.discountedPrice;
        }
        if (val.discountedPrice > maxPrice) {
          maxPrice = val.discountedPrice;
        }
        if (val.prodImage) {
          let images = val.prodImage.replace("[", "");
          images = images.replace("]", "");
          images = images.split(",");
          if (images[0].includes("http://img5a")) {
            images[0] = images[0].replace("http://img5a", "https://rukminim1");
          }
          if (images[0].includes("http://img6a")) {
            images[0] = images[0].replace("http://img6a", "https://rukminim1");
          }
          val.prodImage = images[0].substring(1, images[0].length - 1);
        }
      });
      setminPrice(minPrice);
      setmaxPrice(maxPrice);
    }
    return products;
  };
  let options = [];

  for (let i = 0; i < brand.length; i++) {
    const value = brand[i];
    options.push({
      label: `Long Label: ${value}`,
      value,
    });
  }

  return (
    <div className="plp">
      <div className="plp_top_divier">
        <div className="plp_left_filters">
          <Title level={4} style={{ margin: "0px" }}>
            Filters
          </Title>
          <Title
            level={4}
            style={{ margin: "0px", cursor: "pointer" }}
            type="danger"
            onClick={onClearAll}
          >
            {brandValue.length > 0 || priceValue.length > 0
              ? "Clear all"
              : null}
          </Title>
        </div>
        <div className="sortBy_selectDiv">
          <span className="sortBy_selectDiv_text">Sort By :&nbsp;</span>
          <Select
            defaultValue="Popularity"
            onChange={handleSortByChange}
            style={{
              float: "right",
              width: 180,
            }}
          >
            {sortByOptions}
          </Select>
        </div>
      </div>
      <Divider style={{ margin: "10px 0px" }} />
      <div className="plp_main_content">
        <div className="plp_left">
          {!apiCalled ? (
            <Card
              style={{ marginTop: "10px", width: 250 }}
              bodyStyle={{ padding: "0px" }}
            >
              <Collapse defaultActiveKey={["1"]} ghost expandIconPosition="end">
                <Panel header="Brand" key="1" style={{ textAlign: "left" }}>
                  <Select
                    mode="multiple"
                    placeholder="Choose Brands..."
                    value={brandValue}
                    onChange={setbrandValue}
                    style={{
                      width: "100%",
                    }}
                  >
                    {filteredOptions.map((item) => (
                      <Select.Option key={item} value={item}>
                        {item}
                      </Select.Option>
                    ))}
                  </Select>
                </Panel>
                <Panel header="Price" key="2" style={{ textAlign: "left" }}>
                  <Slider
                    range
                    defaultValue={[minPrice, maxPrice]}
                    min={minPrice}
                    max={maxPrice}
                    onAfterChange={onPriceChange}
                  />
                </Panel>
              </Collapse>
            </Card>
          ) : (
            <Skeleton.Input
              active={true}
              style={{ marginTop: "10px", width: "250px", height: "150px" }}
            />
          )}
        </div>
        <div className="plp_right">
          <div className="plp_right_content">
            {!apiCalled ? (
              products.map((val, index) => (
                <Card
                  hoverable
                  className="plp_product"
                  key={index}
                  style={{ textAlign: "center" }}
                  onClick={() => pdpCalled(val.productName)}
                  cover={
                    <img
                      alt={val.productName}
                      src={val.prodImage}
                      style={{
                        padding: "25px 25px",
                        width: "100%",
                        height: "200px",
                      }}
                    />
                  }
                  actions={[]}
                >
                  <Meta
                    style={{ textAlign: "left" }}
                    title={
                      val.prodBrand == null || val.prodBrand === undefined
                        ? "Brand not available"
                        : val.prodBrand
                    }
                    description={
                      <Paragraph ellipsis={true}>{val.productName}</Paragraph>
                    }
                  />
                  <div style={{ textAlign: "left" }}>
                    <Text
                      strong
                      style={{ fontSize: "16px", marginRight: "5px" }}
                    >
                      ₹{val.discountedPrice}
                    </Text>
                    {val.discountedPrice !== val.retailPrice && (
                      <>
                        <Text
                          delete
                          type="secondary"
                          style={{ fontSize: "14px", marginRight: "5px" }}
                        >
                          ₹{val.retailPrice}
                        </Text>
                        <Text
                          type="success"
                          strong
                          style={{ fontSize: "14px" }}
                        >
                          {Math.round(
                            ((val.retailPrice - val.discountedPrice) /
                              val.retailPrice) *
                              100
                          )}
                          % off
                        </Text>
                      </>
                    )}
                  </div>
                </Card>
              ))
            ) : (
              <div style={{ display: "flex", flexWrap: "wrap" }}>
                <Skeleton.Input
                  active={true}
                  className="plp_product"
                  style={{ marginTop: "0px", height: "200px" }}
                />
                <Skeleton.Input
                  active={true}
                  className="plp_product"
                  style={{ marginTop: "0px", height: "200px" }}
                />
                <Skeleton.Input
                  active={true}
                  className="plp_product"
                  style={{ marginTop: "0px", height: "200px" }}
                />
                <Skeleton.Input
                  active={true}
                  className="plp_product"
                  style={{ marginTop: "0px", height: "200px" }}
                />
                <Skeleton.Input
                  active={true}
                  className="plp_product"
                  style={{ marginTop: "0px", height: "200px" }}
                />
                <Skeleton.Input
                  active={true}
                  className="plp_product"
                  style={{ marginTop: "0px", height: "200px" }}
                />
                <Skeleton.Input
                  active={true}
                  className="plp_product"
                  style={{ marginTop: "0px", height: "200px" }}
                />
                <Skeleton.Input
                  active={true}
                  className="plp_product"
                  style={{ marginTop: "0px", height: "200px" }}
                />
              </div>
            )}
          </div>
          <Pagination
            showQuickJumper
            pageSize={pagination.pageSize}
            current={pagination.page}
            total={total}
            pageSizeOptions={[12, 15, 18]}
            showSizeChanger={total > 10}
            onChange={onPageChange}
          />
        </div>
      </div>
    </div>
  );
};

export default PLP;
