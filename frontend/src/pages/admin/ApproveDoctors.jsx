import React, { useEffect, useState } from "react";
import { Table, Button, Empty, Spin, message, Popconfirm, Modal, Descriptions } from "antd";
import { Search } from "lucide-react";
import { approveDoctor, getNotApprovedDoctors, rejectDoctor } from "../../apis/admin";

const ApproveDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [detailsVisible, setDetailsVisible] = useState(false);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const res = await getNotApprovedDoctors();
      setDoctors(res.doctors || []);
    } catch (err) {
      message.error("Error fetching doctors");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchTerm), 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const filteredDoctors = doctors.filter((doc) => {
    const name = doc?.user?.name?.toLowerCase() || "";
    const specialization = doc?.specialization?.toLowerCase() || "";
    const search = debouncedSearch.toLowerCase();
    return name.includes(search) || specialization.includes(search);
  });

  const handleApprove = async (id) => {
    try {
      await approveDoctor(id);
      message.success("Doctor approved successfully");
      fetchDoctors();
    } catch (err) {
      message.error(err .response?.data?.message || "Error approving doctor");
    }
  };

  const handleDisapprove = async (id) => {
    try {
      await rejectDoctor(id);
      message.success("Doctor disapproved successfully");
      fetchDoctors();
    } catch (err) {
      message.error(err.response?.data?.message || "Error disapproving doctor");
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: ["user", "name"],
      render: (name) => <span className="font-medium text-gray-700">{name}</span>,
    },
    {
      title: "Email",
      dataIndex: ["user", "email"],
      render: (email) => <span className="text-gray-600">{email}</span>,
    },
    {
      title: "Specialization",
      dataIndex: "specialization",
      render: (text) => <span className="text-gray-600">{text}</span>,
    },
    {
      title: "Location",
      dataIndex: "location",
      render: (text) => <span className="text-gray-600">{text}</span>,
    },
    {
      title: "Actions",
      render: (_, record) => (
        <div className="flex gap-2">
          <Button
            className="border-gray-300 hover:border-emerald-500 hover:text-emerald-600"
            onClick={() => {
              setSelectedDoctor(record);
              setDetailsVisible(true);
            }}
          >
            Details
          </Button>

          <Popconfirm
            title="Approve this doctor?"
            onConfirm={() => handleApprove(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button className="border-gray-300 hover:border-green-500 hover:text-green-600">
              Approve
            </Button>
          </Popconfirm>

          <Popconfirm
            title="Disapprove this doctor?"
            onConfirm={() => handleDisapprove(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger className="border-gray-300 hover:border-red-500 hover:text-red-600">
              Reject
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl shadow-lg p-8 mb-8">
        <h1 className="text-3xl font-bold mb-2">Doctor Approvals</h1>
        <p className="opacity-90">Review and approve new doctors joining the platform</p>
      </div>

      <div className="relative w-2/3 mx-auto">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by Name or Specialization"
          className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-200 bg-white 
            shadow-sm placeholder-gray-400 text-gray-700 
            focus:outline-none focus:border-transparent 
            focus:ring-2 focus:ring-emerald-400 focus:shadow-lg
            transition-all duration-300 ease-in-out"
        />
      </div>

      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg p-6 border border-gray-100 mt-6">
        <div className="overflow-x-auto mt-4">
          <Table
            rowKey="_id"
            columns={columns}
            dataSource={filteredDoctors}
            loading={{ spinning: loading, indicator: <Spin size="large" /> }}
            className="rounded-lg shadow-sm"
            pagination={{ className: "mt-4" }}
            locale={{ emptyText: <Empty description="No doctors awaiting approval" /> }}
          />
        </div>
      </div>

      <Modal
        open={detailsVisible}
        onCancel={() => setDetailsVisible(false)}
        footer={null}
        centered
        title={
          <h2 className="text-xl font-bold text-emerald-600">Doctor Profile</h2>
        }>
        {selectedDoctor && (
          <Descriptions bordered column={1} size="small">
            <Descriptions.Item label="Name">
              {selectedDoctor.user?.name}
            </Descriptions.Item>
            <Descriptions.Item label="Email">
              {selectedDoctor.user?.email}
            </Descriptions.Item>
            <Descriptions.Item label="Phone">
              {selectedDoctor.user?.phone}
            </Descriptions.Item>
            <Descriptions.Item label="Specialization">
              {selectedDoctor.specialization}
            </Descriptions.Item>
            <Descriptions.Item label="Experience">
              {selectedDoctor.experience} years
            </Descriptions.Item>
            <Descriptions.Item label="Consultation Fee">
              Rs.{selectedDoctor.consultationFee}
            </Descriptions.Item>
            <Descriptions.Item label="Clinic Address">
              {selectedDoctor.clinicAddress}
            </Descriptions.Item>
            <Descriptions.Item label="Days Off">
              {selectedDoctor.daysOff?.join(", ") || "None"}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

    </div>
  );
};

export default ApproveDoctors;
