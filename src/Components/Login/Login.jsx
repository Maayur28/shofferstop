import React, { useState, useContext } from "react";
import { Modal, Button, Checkbox, Form, Input, message } from "antd";
import { LockOutlined, UserOutlined, MailOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import "./Login.css";
import { fetchPost } from "./../FetchData";
import Cookies from "universal-cookie";
import { StoreContext } from "../../Store/data";
import deleteAllCookies from "../Util";

const Login = ({ loginModalVisible, setloginModalVisible, setfirstName }) => {
  const cookies = new Cookies();
  const { setisLogin } = useContext(StoreContext);
  const [createAccount, setcreateAccount] = useState(false);
  const [apiCalled, setapiCalled] = useState(false);
  const [form] = Form.useForm();
  const onFinish = async (values) => {
    try {
      if (values.confirmPassword != null) {
        delete values.confirmPassword;
      }
      setapiCalled(true);
      const response = await fetchPost(
        `http://localhost:8090/users/${createAccount ? "register" : "login"}`,
        values
      );
      deleteAllCookies();
      for (let key in response) {
        cookies.set(key, response[key], { path: "/" });
        if (key === "firstName") {
          setfirstName(response[key]);
        }
      }
      form.resetFields();
      setloginModalVisible(false);
      setapiCalled(false);
      setisLogin(true);
    } catch (err) {
      setapiCalled(false);
      message.error(err.message);
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
        visible={loginModalVisible}
        title={!createAccount ? "Welcome Back" : "Create An Account"}
        onCancel={() => setloginModalVisible(false)}
        footer={null}
      >
        <Form
          name="normal_login"
          form={form}
          className="login-form"
          disabled={apiCalled}
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          autoComplete="on"
        >
          {createAccount ? (
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
          {createAccount ? (
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
            {!createAccount ? (
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
              loading={apiCalled}
              block
            >
              {!createAccount ? "SignIn" : "SignUp"}
            </Button>
            {createAccount ? (
              <div style={{ float: "left", marginTop: "10px" }}>
                Already have an account?&nbsp;&nbsp;
                <span
                  onClick={() => setcreateAccount(false)}
                  className="login__register_button"
                >
                  SignIn
                </span>
              </div>
            ) : (
              <div style={{ float: "left", marginTop: "10px" }}>
                Or&nbsp;&nbsp;
                <span
                  onClick={() => setcreateAccount(true)}
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
