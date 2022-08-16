import React, { useState } from "react";
import { Form, Input, Button, Row, Col, DatePicker, Select } from "antd";
import { MailOutlined, UserOutlined } from "@ant-design/icons";
import "./ProfileInformation.css";

const ProfileInformation = () => {
  const { Option } = Select;
  const [form] = Form.useForm();
  const [apiCalled, setapiCalled] = useState(false);
  const onFinish = (values) => {
    console.log(values);
  };
  return (
    <div className="profile__information">
      <Form
        name="normal_login"
        form={form}
        className="account-form"
        disabled={apiCalled}
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        autoComplete="on"
      >
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              name="firstName"
              rules={[
                {
                  required: true,
                  message: "Please input your firstName",
                },
              ]}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                type="text"
                placeholder="FirstName"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="lastName">
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                type="text"
                placeholder="LastName"
              />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item
          name="userName"
          rules={[
            {
              required: true,
              message: "Please input your Email!",
            },
          ]}
        >
          <Input
            prefix={<MailOutlined className="site-form-item-icon" />}
            type="email"
            placeholder="Email"
          />
        </Form.Item>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item label="Date of birth">
              <DatePicker />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="gender" label="Gender">
              <Select placeholder="Select your gender">
                <Option value="male">Male</Option>
                <Option value="female">Female</Option>
                <Option value="other">Other</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={apiCalled} block>
            Save Details
          </Button>
          <Button htmlType="button" block style={{ marginTop: "10px" }}>
            Change Password
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ProfileInformation;
