import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, Card, Modal, Form, Input, message } from "antd";
import { logout, setUser } from "../../redux/slices/auth";
import { editProfile } from "../../apis/admin";

const AdminProfile = () => {
  const dispatch = useDispatch();
  const [profile, setProfile] = useState(null);
  const { user } = useSelector((state) => state.auth);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleEdit = () => {
    form.setFieldsValue({
      name: user?.name,
      email: user?.email,
      phone: user?.phone,
    });
    setIsModalVisible(true);
  };

  console.log(user);
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const res = await editProfile(values);
      message.success("Profile updated successfully");
      setIsModalVisible(false);
      dispatch(setUser(res.user));
      setProfile(res.user);
    } catch (error) {
      message.error(error.response?.data?.message || "Error updating profile");
    }
  };

  useEffect(() => {
    setProfile(user);
  }, [user]);

  return (
    <div className="min-h-screen flex justify-center items-center p-6">
      <Card
        className="w-full bg-emerald-200 max-w-md rounded-2xl shadow-2xl border-none"
        styles={{ padding: "2rem" }}>
        <div className="flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-3xl font-bold shadow-md mb-4">
            {profile?.name?.charAt(0)?.toUpperCase() || "A"}
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-1">
            {profile?.name || "Admin"}
          </h2>

          <p className="text-emerald-600 font-medium text-sm mb-6">
            {profile?.role || "Admin"}
          </p>

          <div className="w-full space-y-4 text-left bg-gray-50 rounded-xl p-5 border border-gray-100">
            <div>
              <p className="text-gray-500 text-sm">Email</p>
              <p className="font-semibold text-gray-800">
                {profile?.email || "N/A"}
              </p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">Phone</p>
              <p className="font-semibold text-gray-800">
                {profile?.phone || "N/A"}
              </p>
            </div>
          </div>

          <div className="w-full flex gap-3 mt-8">
            <Button
            style={{height: "40px"}}
              type="primary"
              block
              onClick={handleEdit}>
              Edit Profile
            </Button>

            <Button
            style={{height: "40px"}}
              danger
              block
              onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </Card>

      <Modal
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleSave}
        title={
          <span className="text-emerald-600 font-semibold">Edit Profile</span>
        }
        okText="Save Changes"
        okButtonProps={{
          className: "bg-emerald-500 hover:bg-emerald-600 border-none",
        }}>
        <Form form={form} layout="vertical">
          <Form.Item
            label="Full Name"
            name="name"
            rules={[{ required: true, message: "Please enter your name" }]}>
            <Input placeholder="Enter full name" />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please enter your email" },
              { type: "email", message: "Invalid email address" },
            ]}>
            <Input placeholder="Enter email" />
          </Form.Item>
          <Form.Item
            label="Phone"
            name="phone"
            rules={[
              { required: true, message: "Please enter your phone number" },
              {
                pattern: /^[0-9]{11}$/,
                message: "Enter a valid 11-digit phone number",
              },
            ]}>
            <Input placeholder="Enter phone number" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminProfile;
