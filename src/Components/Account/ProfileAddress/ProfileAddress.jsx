import React, { useState } from "react";
import { Form, Input, Button, Select, Card, InputNumber, Checkbox } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { cities } from "../Cities";
import { countries } from "../Countries";
import { states } from "./../States";
import "./ProfileAddress.css";
import { fetchPost } from "../../FetchData";
import Cookies from "universal-cookie";
const ProfileAddress = ({ addresses }) => {
  const cookies = new Cookies();
  const { Option } = Select;
  const [form] = Form.useForm();
  const [apiCalled, setapiCalled] = useState(false);
  const [addressAddMode, setaddressAddMode] = useState(false);
  const [addressEditMode, setaddressEditMode] = useState(false);
  const [state, setstate] = useState([]);
  const [city, setcity] = useState([]);
  const onFinish = async (values) => {
    console.log(values);
    const response = await fetchPost(
      "http://localhost:8090/users/address",
      values,
      cookies.get("accessToken")
    );
    console.log(response);
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
  return (
    <div className="profile__address">
      {!addressAddMode && (
        <div className="profile_add_address ">
          <Button
            className="address_card"
            type="dashed"
            block
            icon={<PlusOutlined />}
            onClick={() => setaddressAddMode(true)}
          >
            Add Address
          </Button>
        </div>
      )}
      {!addressAddMode &&
        addresses != null &&
        addresses.map((val, key) => (
          <Card className="profile_show_address" key={key}>
            {val}
          </Card>
        ))}
      {addressAddMode && (
        <>
          <Form
            name="profile_address"
            form={form}
            style={{ textAlign: "left" }}
            className="profile_edit_address_form"
            disabled={apiCalled}
            initialValues={{
              remember: true,
            }}
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
              <Input type="text" placeholder="flatAddress" />
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
                    <Option key={val.id} value={val.state_name}>
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
                Add Address
              </Button>
              <Button
                htmlType="button"
                className="profile-address-form-cancel-button"
                loading={apiCalled}
                onClick={() => setaddressAddMode(false)}
                block
              >
                Cancel
              </Button>
            </Form.Item>
          </Form>
        </>
      )}
    </div>
  );
};

export default ProfileAddress;
