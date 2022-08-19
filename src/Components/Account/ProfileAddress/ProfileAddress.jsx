import React, { useState, useEffect } from "react";
import { Form, Input, Button, Row, Col, Select, Card, InputNumber } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { cities } from "../Cities";
import { countries } from "../Countries";
import "./ProfileAddress.css";
import { fetchGet } from "../../FetchData";
const ProfileAddress = ({ addresses }) => {
  const { Option } = Select;
  const [form] = Form.useForm();
  const [apiCalled, setapiCalled] = useState(false);
  const [addressEditMode, setaddressEditMode] = useState(false);
  const onFinish = (values) => {
    console.log(values);
  };
  return (
    <div className="profile__address">
      {!addressEditMode && (
        <div className="profile_add_address ">
          <Button
            className="address_card"
            type="dashed"
            block
            icon={<PlusOutlined />}
            onClick={() => setaddressEditMode(true)}
          >
            Add Address
          </Button>
        </div>
      )}
      {!addressEditMode &&
        addresses != null &&
        addresses.map((val, key) => (
          <Card className="profile_show_address" key={key}>
            {val}
          </Card>
        ))}
      {addressEditMode && (
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
              label="Country"
              rules={[{ required: true }]}
            >
              <Select
                showSearch
                placeholder="Select a country"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().includes(input.toLowerCase())
                }
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
                placeholder=" 209102"
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="button"
                className="profile-address-form-cancel-button"
                loading={apiCalled}
                onClick={() => setaddressEditMode(false)}
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
