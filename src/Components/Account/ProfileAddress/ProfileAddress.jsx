import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  InputNumber,
  Checkbox,
  Pagination,
  Badge,
  Spin,
  message,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { cities } from "../Cities";
import { countries } from "../Countries";
import { states } from "./../States";
import "./ProfileAddress.css";
import {
  fetchGet,
  fetchPost,
  fetchPut,
  fetchDelete,
  updatefetchPut,
} from "../../FetchData";
import Cookies from "universal-cookie";
import AddressCard from "./AddressCard";
import deleteAllCookies from "../../Util";

const ProfileAddress = ({ isLogin, setisLogin }) => {
  const cookies = new Cookies();
  const { Option } = Select;
  const { Search } = Input;
  const [form] = Form.useForm();
  const [apiCalled, setapiCalled] = useState(false);
  const [addressAddMode, setaddressAddMode] = useState(false);
  const [addressEditMode, setaddressEditMode] = useState(false);
  const [pagination, setpagination] = useState({ page: 1, pageSize: 2 });
  const [total, setTotal] = useState(10);
  const [state, setstate] = useState([]);
  const [city, setcity] = useState([]);
  const [address, setAddress] = useState([]);
  const [addressId, setAddressId] = useState();

  useEffect(() => {
    if (isLogin) {
      getAddress(pagination.page, pagination.pageSize);
    } else {
      deleteAllCookies();
      setisLogin(false);
    }
  }, [isLogin]); // eslint-disable-line react-hooks/exhaustive-deps

  const onPageChange = (page, pageSize) => {
    getAddress(page, pageSize);
  };

  const getAddress = async (page, pageSize) => {
    setapiCalled(true);
    const response = await fetchGet(
      "https://shofferstop-userservice.herokuapp.com/users/address?" +
        new URLSearchParams({
          page: page,
          pageSize: pageSize,
        }),
      cookies.get("accessToken")
    );
    setpagination(response.pagination);
    setTotal(response.total);
    setAddress(response.addresses);
    setapiCalled(false);
  };

  const setAsDefault = async (addressId) => {
    setapiCalled(true);
    const response = await updatefetchPut(
      `https://shofferstop-userservice.herokuapp.com/users/address/default/${addressId}?` +
        new URLSearchParams({
          page: pagination.page,
          pageSize: pagination.pageSize,
        }),
      cookies.get("accessToken")
    );
    setpagination(response.pagination);
    setTotal(response.total);
    setAddress(response.addresses);
    setapiCalled(false);
  };

  const deleteAddress = async (addressId) => {
    setapiCalled(true);
    const response = await fetchDelete(
      `https://shofferstop-userservice.herokuapp.com/users/address/${addressId}?` +
        new URLSearchParams({
          page: pagination.page,
          pageSize: pagination.pageSize,
        }),
      cookies.get("accessToken")
    );
    message.success("Address has been deleted", 2);
    setpagination(response.pagination);
    setTotal(response.total);
    setAddress(response.addresses);
    setapiCalled(false);
  };

  const onFinish = async (values) => {
    let response;
    setapiCalled(true);
    if (addressEditMode) {
      values.defaultAddress = values.defaultAddress === true ? 1 : 0;
      response = await fetchPut(
        `https://shofferstop-userservice.herokuapp.com/users/address/${addressId}?` +
          new URLSearchParams({
            page: pagination.page,
            pageSize: pagination.pageSize,
          }),
        values,
        cookies.get("accessToken")
      );
      message.success("Address has been updated successfully", 2);
    } else {
      response = await fetchPost(
        "https://shofferstop-userservice.herokuapp.com/users/address?" +
          new URLSearchParams({
            page: pagination.page,
            pageSize: pagination.pageSize,
          }),
        values,
        cookies.get("accessToken")
      );
      message.success("Address has been created successfully", 2);
    }
    setpagination(response.pagination);
    setTotal(response.total);
    setAddress(response.addresses);
    setaddressAddMode(false);
    setaddressEditMode(false);
    form.resetFields();
    setAddressId("");
    setapiCalled(false);
  };

  const countryChanged = (value) => {
    form.setFieldValue("state", undefined);
    for (let i = 0; i < states.length; i++) {
      if (states[i].country_name === value) {
        setstate(states[i].state);
        break;
      }
    }
  };
  const stateChanged = (value) => {
    form.setFieldValue("city", undefined);
    for (let i = 0; i < cities.length; i++) {
      if (cities[i].state_name === value) {
        setcity(cities[i].city.split(","));
        break;
      }
    }
  };
  const setEditDataCalled = (val) => {
    form.setFieldsValue({ ...val });
    setaddressEditMode(true);
    setaddressAddMode(false);
    setAddressId(val.addressId);
  };

  const addressCancelCalled = () => {
    setaddressAddMode(false);
    setaddressEditMode(false);
    form.resetFields();
    setAddressId("");
  };

  const searchCalled = async (val) => {
    setapiCalled(true);
    const response = await fetchGet(
      "https://shofferstop-userservice.herokuapp.com/users/address/search?" +
        new URLSearchParams({
          search: val,
          page: pagination.page,
          pageSize: pagination.pageSize,
        }),
      cookies.get("accessToken")
    );
    setpagination(response.pagination);
    setTotal(response.total);
    setAddress(response.addresses);
    setapiCalled(false);
  };
  return (
    <div className="profile__address">
      {!addressAddMode && !addressEditMode && !apiCalled && (
        <>
          <div className="profile_add_address ">
            <Button
              className="address_card"
              type="dashed"
              block
              icon={<PlusOutlined />}
              onClick={() => {
                setaddressAddMode(true);
                setaddressEditMode(false);
                form.resetFields();
                setAddressId("");
              }}
            >
              Add Address
            </Button>
          </div>
          <Search
            style={{ margin: "20px 0px" }}
            placeholder="Search address..."
            loading={false}
            enterButton
            onSearch={searchCalled}
          />
        </>
      )}
      {!addressAddMode && !addressEditMode && address != null && !apiCalled && (
        <div className="address_card">
          {address.map((val, index) =>
            val.defaultAddress === 1 ? (
              <Badge.Ribbon
                text="default"
                className="profile_show_address"
                key={index + "default"}
              >
                <AddressCard
                  val={val}
                  setAsDefault={setAsDefault}
                  setaddressEditMode={() => setEditDataCalled(val)}
                  deleteAddressCalled={() => deleteAddress(val.addressId)}
                />
              </Badge.Ribbon>
            ) : (
              <AddressCard
                val={val}
                setAsDefault={setAsDefault}
                setaddressEditMode={() => setEditDataCalled(val)}
                deleteAddressCalled={() => deleteAddress(val.addressId)}
              />
            )
          )}
        </div>
      )}
      {!addressAddMode &&
        !addressEditMode &&
        address != null &&
        address.length !== 0 &&
        pagination !== null &&
        pagination.pageSize !== null &&
        pagination.page !== null &&
        !apiCalled &&
        total !== 0 && (
          <Pagination
            size="small"
            showQuickJumper
            pageSize={pagination.pageSize}
            current={pagination.page}
            total={total}
            pageSizeOptions={[2, 5, 10]}
            showSizeChanger={total > 10}
            onChange={onPageChange}
          />
        )}
      {(addressAddMode || addressEditMode) && (
        <>
          <Form
            name="profile_address"
            form={form}
            style={{ textAlign: "left" }}
            className="profile_edit_address_form"
            disabled={apiCalled}
            onFinish={onFinish}
            autoComplete="on"
          >
            <Form.Item
              name="country"
              label="Country/Region"
              labelCol={{ span: 24 }}
              rules={[{ required: true, message: "Please select the country" }]}
              className="address_input"
            >
              <Select
                showSearch
                placeholder="Select a country"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().includes(input.toLowerCase())
                }
                onChange={countryChanged}
              >
                {countries.map((val, index) => (
                  <Option key={val.name + index} value={val.name}>
                    {val.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              label="FullName"
              name="fullName"
              labelCol={{ span: 24 }}
              className="address_input"
              rules={[
                {
                  required: true,
                  message: "Please input your full name",
                },
              ]}
            >
              <Input type="text" placeholder=" Mayur Agarwal" />
            </Form.Item>
            <Form.Item
              name="mobile"
              label="Mobile Number"
              labelCol={{ span: 24 }}
              className="address_input"
              rules={[
                {
                  required: true,
                  message: "Please input your mobile number",
                },
              ]}
            >
              <InputNumber
                min={1000000000}
                max={999999999999999}
                maxLength={15}
                type="text"
                style={{ width: "100%" }}
                placeholder=" 998877665544"
              />
            </Form.Item>
            <Form.Item
              name="pincode"
              label="Pincode"
              labelCol={{ span: 24 }}
              className="address_input"
              rules={[
                {
                  required: true,
                  message: "Please input your pincode",
                },
              ]}
            >
              <InputNumber
                min={100000}
                max={999999}
                maxLength={6}
                type="text"
                style={{ width: "100%" }}
                placeholder=" 209102"
              />
            </Form.Item>
            <Form.Item
              name="houseAddress"
              label="Flat, House no., Building, Company, Apartment"
              labelCol={{ span: 24 }}
              className="address_input"
              rules={[
                {
                  required: true,
                  message: "Please input your address",
                },
              ]}
            >
              <Input type="text" placeholder="flatAddress" maxLength={512} />
            </Form.Item>
            <Form.Item
              name="state"
              label="State"
              labelCol={{ span: 24 }}
              rules={[{ required: true, message: "Please select a state" }]}
              className="address_input"
            >
              <Select
                showSearch
                placeholder="Select a state"
                optionFilterProp="children"
                disabled={form.getFieldValue("country") === undefined}
                filterOption={(input, option) =>
                  option.children.toLowerCase().includes(input.toLowerCase())
                }
                onChange={stateChanged}
              >
                {state.length !== 0 &&
                  state.map((val, index) => (
                    <Option key={val.id + index} value={val.state_name}>
                      {val.state_name}
                    </Option>
                  ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="city"
              label="Town/City"
              labelCol={{ span: 24 }}
              rules={[{ required: true, message: "Please select a city" }]}
              className="address_input"
            >
              <Select
                showSearch
                placeholder="Select a city"
                optionFilterProp="children"
                disabled={form.getFieldValue("state") === undefined}
                filterOption={(input, option) =>
                  option.children.toLowerCase().includes(input.toLowerCase())
                }
              >
                {city.map((val, index) => (
                  <Option key={val + index} value={val}>
                    {val}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="defaultAddress"
              valuePropName="checked"
              style={{ marginBottom: "2px" }}
            >
              <Checkbox checked={true}>Make this my default address</Checkbox>
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="profile-address-form-add_address-button"
                loading={apiCalled}
                block
              >
                {addressEditMode ? "Save Address" : "Add Address"}
              </Button>
              <Button
                htmlType="button"
                className="profile-address-form-cancel-button"
                loading={apiCalled}
                onClick={addressCancelCalled}
                block
              >
                Cancel
              </Button>
            </Form.Item>
          </Form>
        </>
      )}
      {apiCalled && <Spin tip="Loading..." />}
    </div>
  );
};

export default ProfileAddress;
