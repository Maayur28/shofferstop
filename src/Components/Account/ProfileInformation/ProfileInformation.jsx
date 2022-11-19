import React, { useState, useEffect, useContext } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  Typography,
  InputNumber,
  message,
} from "antd";
import { StoreContext } from "../../../Store/data";
import "./ProfileInformation.css";
import { fetchPut } from "../../FetchData";
import Cookies from "universal-cookie";

const { Title, Text } = Typography;

const ProfileInformation = ({ accountData, setaccountData }) => {
  const cookies = new Cookies();
  const { Option } = Select;
  const { setfirstName } = useContext(StoreContext);
  const [form] = Form.useForm();
  const [DD, setDD] = useState();
  const [MM, setMM] = useState();
  const [YYYY, setYYYY] = useState();
  const [profileEditMode, setprofileEditMode] = useState(false);
  const [apiCalled, setapiCalled] = useState(false);

  const onFinish = async (values) => {
    setapiCalled(true);
    if (
      DD == null ||
      DD === undefined ||
      MM == null ||
      MM === undefined ||
      YYYY == null ||
      YYYY === undefined
    ) {
      message.error("Please enter valid date of birth");
    }
    let dob = "";
    dob += DD;
    dob += "-";
    dob += MM;
    dob += "-";
    dob += YYYY;
    values.userDob = dob;
    const response = await fetchPut(
      `https://shofferstopuserservice.azurewebsites.net/users`,
      values,
      cookies.get("accessToken")
    );
    setaccountData({ ...response });
    setfirstName(response.firstName);
    cookies.set("firstName", response.firstName);
    setprofileEditMode(false);
    setapiCalled(false);
  };

  useEffect(() => {
    if (accountData != null && accountData.userDob != null) {
      let dob = accountData.userDob.split("-");
      setDD(dob[0]);
      setMM(dob[1]);
      setYYYY(dob[2]);
    }
  }, [accountData]);

  return (
    <div className="profile__information">
      <Text
        type="success"
        style={{
          cursor: "pointer",
          display: "flex",
          justifyContent: "flex-end",
        }}
        strong
        onClick={() => setprofileEditMode(true)}
      >
        Edit Profile
      </Text>
      <Form
        name="normal_login"
        form={form}
        className="account-form"
        disabled={apiCalled || !profileEditMode}
        onFinish={onFinish}
        initialValues={{ ...accountData }}
        autoComplete="on"
      >
        <Form.Item
          name="firstName"
          label="FirstName"
          labelCol={{ span: 24 }}
          className="address_input"
          rules={[
            {
              required: true,
              message: "Please input your firstName",
            },
          ]}
        >
          <Input type="text" placeholder="FirstName" />
        </Form.Item>
        <Form.Item
          name="lastName"
          label="LastName"
          labelCol={{ span: 24 }}
          className="address_input"
        >
          <Input type="text" placeholder="LastName" />
        </Form.Item>
        <Form.Item
          label="Date of birth"
          labelCol={{ span: 24 }}
          className="address_input"
        >
          <Input.Group compact>
            <InputNumber
              min={1}
              max={31}
              maxLength={2}
              style={{ width: "50px", textAlign: "center" }}
              placeholder="DD"
              onChange={setDD}
              controls={false}
              value={DD}
              required={true}
            />
            <Title level={5} style={{ margin: "0px 3px" }}>
              -
            </Title>
            <InputNumber
              min={1}
              max={12}
              maxLength={2}
              className="site-input-right"
              style={{
                width: "50px",
                textAlign: "center",
              }}
              placeholder="MM"
              controls={false}
              onChange={setMM}
              value={MM}
              required={true}
            />
            <Title level={5} style={{ margin: "0px 3px" }}>
              -
            </Title>
            <InputNumber
              min={1900}
              max={new Date().getFullYear() - 3}
              maxLength={4}
              className="site-input-right"
              style={{
                width: "60px",
                textAlign: "center",
              }}
              controls={false}
              placeholder="YYYY"
              onChange={setYYYY}
              value={YYYY}
              required={true}
            />
          </Input.Group>
        </Form.Item>
        <Form.Item
          name="userGender"
          label="Gender"
          labelCol={{ span: 24 }}
          className="address_input"
        >
          <Select placeholder="Select your gender">
            <Option value="male">Male</Option>
            <Option value="female">Female</Option>
            <Option value="other">Other</Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={apiCalled}
            block
            style={{ marginTop: "10px" }}
          >
            Save Details
          </Button>
          <Button
            htmlType="reset"
            block
            style={{ marginTop: "10px" }}
            onClick={() => {
              form.setFieldsValue({ ...accountData });
              setprofileEditMode(false);
              let dob = accountData.userDob.split("-");
              if (dob[0] !== DD || dob[1] !== MM || dob[2] !== YYYY) {
                setDD(dob[0]);
                setMM(dob[1]);
                setYYYY(dob[2]);
              }
            }}
          >
            Cancel
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ProfileInformation;
