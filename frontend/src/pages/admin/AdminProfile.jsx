import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Modal, Form, Input, message } from "antd";
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
    <div className="h-[70vh] flex justify-center items-center p-6">
      <div className="w-full bg-white max-w-md rounded-xl border border-zinc-200 p-8 shadow-sm">
        <div className="flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center text-slate-800 text-2xl font-bold border border-zinc-200 mb-4">
            {profile?.name?.charAt(0)?.toUpperCase() || "A"}
          </div>

          <h2 className="text-xl font-bold text-slate-800 mb-1">
            {profile?.name || "Admin"}
          </h2>

          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-6">
            {profile?.role || "Admin"}
          </p>

          <div className="w-full space-y-4 text-left bg-slate-50/50 rounded-xl p-5 border border-zinc-200">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Email Address
              </span>
              <span className="text-xs font-semibold text-slate-800 mt-1 block">
                {profile?.email || "N/A"}
              </span>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Phone Number
              </span>
              <span className="text-xs font-semibold text-slate-800 mt-1 block">
                {profile?.phone || "N/A"}
              </span>
            </div>
          </div>

          <div className="w-full flex gap-3 mt-8">
            <button
              className="flex-1 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold py-2.5 px-4 rounded-lg shadow-sm transition-colors cursor-pointer border-none text-center"
              onClick={handleEdit}>
              Edit Profile
            </button>

            <button
              className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold py-2.5 px-4 rounded-lg transition-colors cursor-pointer border-none text-center"
              onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </div>

      <Modal
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleSave}
        title={
          <span className="text-slate-800 font-bold text-sm uppercase tracking-wider">
            Edit Profile
          </span>
        }
        okText="Save Changes"
        okButtonProps={{
          className: "bg-teal-600 hover:bg-teal-700 border-none font-semibold text-xs py-1.5 px-3 rounded-lg",
        }}
        cancelButtonProps={{
          className: "hover:border-zinc-800 hover:text-slate-600 text-xs py-1.5 px-3 rounded-lg",
        }}>
        <Form form={form} layout="vertical" className="mt-4">
          <Form.Item
            label={<span className="text-xs font-semibold text-slate-600">Full Name</span>}
            name="name"
            rules={[{ required: true, message: "Please enter your name" }]}>
            <Input placeholder="Enter full name" className="hover:border-zinc-800 focus:border-zinc-800 rounded-lg text-xs py-2" />
          </Form.Item>
          <Form.Item
            label={<span className="text-xs font-semibold text-slate-600">Email</span>}
            name="email"
            rules={[
              { required: true, message: "Please enter your email" },
              { type: "email", message: "Invalid email address" },
            ]}>
            <Input placeholder="Enter email" className="hover:border-zinc-800 focus:border-zinc-800 rounded-lg text-xs py-2" />
          </Form.Item>
          <Form.Item
            label={<span className="text-xs font-semibold text-slate-600">Phone</span>}
            name="phone"
            rules={[
              { required: true, message: "Please enter your phone number" },
              {
                pattern: /^[0-9]{11}$/,
                message: "Enter a valid 11-digit phone number",
              },
            ]}>
            <Input placeholder="Enter phone number" className="hover:border-zinc-800 focus:border-zinc-800 rounded-lg text-xs py-2" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminProfile;
