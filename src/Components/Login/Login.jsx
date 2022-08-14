import React, { useState } from "react";
import { Modal, Button, Checkbox, Form, Input, message } from "antd";
import { LockOutlined, UserOutlined, MailOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import "./Login.css";
import fetchPost from "./../FetchData";
import Cookies from "universal-cookie";

const Login = (props) => {
  const cookies = new Cookies();
  const [isLogin, setisLogin] = useState(true);
  const [form] = Form.useForm();
  const onFinish = async (values) => {
    try {
      delete values.confirmPassword;
      const response = await fetchPost("http://localhost:8080/users", values);
      deleteAllCookies();
      for (let key in response) {
        cookies.set(key, response[key], { path: "/" });
      }
    } catch (err) {
      message.error(err.message);
    }
  };
  const deleteAllCookies = () => {
    const cookiesArray = cookies.getAll();
    if (cookiesArray != null) {
      for (let key in cookiesArray) {
        cookies.remove(key);
      }
    }
  };
  const validatePassword = (rule, value, callback) => {
    if (value.length < 5) {
      callback("Password too short!!!");
    } else {
      callback();
    }
  };
  return (
    <div className="login">
      <Modal
        className="login__modal"
        visible={props.loginModalVisible}
        title={isLogin ? "Welcome Back" : "Create An Account"}
        onCancel={props.loginModalCall}
        footer={null}
      >
        <Form
          name="normal_login"
          form={form}
          className="login-form"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          autoComplete="on"
        >
          {!isLogin ? (
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
          ) : null}
          <Form.Item
            name="email"
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
          <Form.Item
            name="password"
            hasFeedback
            rules={[
              {
                required: true,
                message: "Please input your Password!",
              },
              { validator: validatePassword },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          {!isLogin ? (
            <Form.Item
              name="confirmPassword"
              dependencies={["password"]}
              hasFeedback
              rules={[
                {
                  required: true,
                  message: "Please confirm your password!",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("The passwords does not match!")
                    );
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="site-form-item-icon" />}
                tpye="password"
                placeholder="Confirm Password"
              />
            </Form.Item>
          ) : null}
          <Form.Item style={{ marginBottom: "0px" }}>
            <Form.Item
              name="remember"
              valuePropName="checked"
              style={{ float: "left" }}
            >
              <Checkbox>Remember me</Checkbox>
            </Form.Item>
            {isLogin ? (
              <Link
                className="login-form-forgot"
                to=""
                style={{ marginTop: "5px", float: "right" }}
              >
                Forgot password
              </Link>
            ) : null}
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
              block
            >
              {isLogin ? "SignIn" : "SignUp"}
            </Button>
            {!isLogin ? (
              <div style={{ float: "left", marginTop: "10px" }}>
                Already have an account?&nbsp;&nbsp;
                <span
                  onClick={() => setisLogin(true)}
                  className="login__register_button"
                >
                  SignIn
                </span>
              </div>
            ) : (
              <div style={{ float: "left", marginTop: "10px" }}>
                Or&nbsp;&nbsp;
                <span
                  onClick={() => setisLogin(false)}
                  className="login__register_button"
                >
                  register now!
                </span>
              </div>
            )}
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Login;
