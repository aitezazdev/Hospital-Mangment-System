import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, Card, Modal, Form, Input, message } from "antd";
import { logoutUser, setUser } from "../../redux/slices/auth";
import { editProfile } from "../../apis/admin";

const AdminProfile = () => {
  const dispatch = useDispatch();
  const [profile, setProfile] = useState(null);
  const { user } = useSelector((state) => state.auth);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const handleLogout = () => {
    dispatch(logoutUser());
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
    <div className="h-[75vh] flex justify-center items-center p-6">
      <Card
        className="w-full bg-white max-w-md rounded-2xl shadow-xl border border-slate-100"
        styles={{ padding: "2rem" }}>
        <div className="flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-full bg-teal-50 flex items-center justify-center text-teal-600 text-3xl font-bold shadow-sm mb-4 border border-teal-100">
            {profile?.name?.charAt(0)?.toUpperCase() || "A"}
          </div>

          <h2 className="text-2xl font-bold text-slate-800 mb-1">
            {profile?.name || "Admin"}
          </h2>

          <p className="text-teal-600 font-semibold text-sm mb-6 uppercase tracking-wide">
            {profile?.role || "Admin"}
          </p>

          <div className="w-full space-y-4 text-left bg-slate-50 rounded-xl p-5 border border-slate-100">
            <div>
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Email</p>
              <p className="font-semibold text-slate-800">
                {profile?.email || "N/A"}
              </p>
            </div>

            <div>
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Phone</p>
              <p className="font-semibold text-slate-800">
                {profile?.phone || "N/A"}
              </p>
            </div>
          </div>

          <div className="w-full flex gap-3 mt-8">
            <Button
              style={{ height: "42px", borderRadius: "8px" }}
              type="primary"
              className="bg-teal-600 hover:bg-teal-700 border-none font-semibold"
              block
              onClick={handleEdit}>
              Edit Profile
            </Button>

            <Button
              style={{ height: "42px", borderRadius: "8px" }}
              danger
              className="hover:bg-red-50 font-semibold"
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
          <span className="text-teal-700 font-bold text-lg">Edit Profile</span>
        }
        okText="Save Changes"
        okButtonProps={{
          className: "bg-teal-600 hover:bg-teal-700 border-none font-semibold",
        }}
        cancelButtonProps={{
          className: "hover:border-teal-600 hover:text-teal-600",
        }}>
        <Form form={form} layout="vertical" className="mt-4">
          <Form.Item
            label="Full Name"
            name="name"
            rules={[{ required: true, message: "Please enter your name" }]}>
            <Input placeholder="Enter full name" className="hover:border-teal-500 focus:border-teal-500" />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please enter your email" },
              { type: "email", message: "Invalid email address" },
            ]}>
            <Input placeholder="Enter email" className="hover:border-teal-500 focus:border-teal-500" />
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
            <Input placeholder="Enter phone number" className="hover:border-teal-500 focus:border-teal-500" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminProfile;
