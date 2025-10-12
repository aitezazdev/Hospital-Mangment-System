import React, { useEffect, useState } from "react";
import { Tabs, Table, Button, Empty, Spin, message, Modal, Descriptions } from "antd";
import { Search } from "lucide-react";
import { allDoctors, approveDoctor, rejectDoctor } from "../../apis/admin";

const AllDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const res = await allDoctors();
      setDoctors(res.doctors || []);
    } catch (err) {
      console.error(err);
      setErrors(err.message || "Error fetching doctors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchTerm), 400);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const handleApprove = async (id) => {
    try {
      await approveDoctor(id);
      message.success("Doctor approved successfully");
      fetchDoctors();
    } catch (err) {
      message.error(err.response?.data?.message || "Error approving doctor");
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectDoctor(id);
      message.success("Doctor rejected successfully");
      fetchDoctors();
    } catch (err) {
      message.error(err.response?.data?.message || "Error rejecting doctor");
    }
  };

  const filteredDoctors = doctors
    .filter((doc) => {
      if (statusFilter === "approved") return doc.status === "approved";
      if (statusFilter === "rejected") return doc.status === "rejected";
      if (statusFilter === "pending") return doc.status === "pending";
      return true;
    })
    .filter((doc) => {
      const name = doc?.user?.name?.toLowerCase() || "";
      const spec = doc?.specialization?.toLowerCase() || "";
      return (
        name.includes(debouncedSearch.toLowerCase()) ||
        spec.includes(debouncedSearch.toLowerCase())
      );
    });

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
      render: (spec) => <span className="text-gray-600">{spec}</span>,
    },
    {
      title: "Status",
      render: (_, record) => {
        const statusColors = {
          approved: "bg-green-100 text-green-700 border-green-300",
          rejected: "bg-red-100 text-red-700 border-red-300",
          pending: "bg-orange-100 text-orange-700 border-orange-300",
        };
        return (
          <span
            className={`px-3 py-1 rounded-full border text-sm font-medium ${
              statusColors[record.status] || ""
            }`}
          >
            {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
          </span>
        );
      },
    },
    {
      title: "Actions",
      render: (_, record) => (
        <div className="flex gap-2">
          <Button
            onClick={() => {
              setSelectedDoctor(record);
              setDetailsVisible(true);
            }}
          >
            Details
          </Button>

          {record.status === "pending" && (
            <>
              <Button onClick={() => handleApprove(record._id)}>Approve</Button>
              <Button danger onClick={() => handleReject(record._id)}>
                Reject
              </Button>
            </>
          )}

          {record.status === "rejected" && (
            <Button
              type="primary"
              onClick={() => handleApprove(record._id)}
            >
              Re-Approve
            </Button>
          )}

          {record.status === "approved" && (
            <Button
              type="primary" danger
              onClick={() => handleReject(record._id)}
            >
              Reject
            </Button>
          )}
        </div>
      ),
    },
  ];

  const getEmptyText = () => {
    switch (statusFilter) {
      case "approved":
        return "No approved doctors found";
      case "rejected":
        return "No rejected doctors found";
      case "pending":
        return "No pending doctors found";
      default:
        return "No doctors available";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl shadow-lg p-8 mb-8">
        <h1 className="text-3xl font-bold mb-2">All Doctors</h1>
        <p className="opacity-90">Manage all registered doctors and their approval status</p>
      </div>

      <div className="relative w-2/3 mx-auto mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by Name or Specialization"
          className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-200 bg-white shadow-sm placeholder-gray-400 text-gray-700 focus:ring-2 focus:ring-emerald-400 focus:shadow-lg transition-all duration-300 ease-in-out"
        />
      </div>

      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <Tabs
          activeKey={statusFilter}
          onChange={setStatusFilter}
          items={[
            { key: "all", label: "All" },
            { key: "approved", label: "Approved" },
            { key: "pending", label: "Pending" },
            { key: "rejected", label: "Rejected" },
          ]}
        />
        <Table
          rowKey="_id"
          columns={columns}
          dataSource={filteredDoctors}
          loading={{ spinning: loading, indicator: <Spin size="large" /> }}
          className="rounded-lg shadow-sm"
          pagination={{ className: "mt-4" }}
          locale={{ emptyText: <Empty description={getEmptyText()} /> }}
        />
      </div>

      <Modal
        open={detailsVisible}
        onCancel={() => setDetailsVisible(false)}
        footer={null}
        centered
        title={<h2 className="text-xl font-bold text-emerald-600">Doctor Profile</h2>}
      >
        {selectedDoctor && (
          <Descriptions bordered column={1} size="small">
            <Descriptions.Item label="Name">{selectedDoctor.user?.name}</Descriptions.Item>
            <Descriptions.Item label="Email">{selectedDoctor.user?.email}</Descriptions.Item>
            <Descriptions.Item label="Specialization">{selectedDoctor.specialization}</Descriptions.Item>
            <Descriptions.Item label="Experience">{selectedDoctor.experience} years</Descriptions.Item>
            <Descriptions.Item label="Consultation Fee">Rs. {selectedDoctor.consultationFee}</Descriptions.Item>
            <Descriptions.Item label="Clinic Address">{selectedDoctor.clinicAddress}</Descriptions.Item>
            <Descriptions.Item label="Days Off">
              {selectedDoctor.daysOff?.join(", ") || "None"}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      {errors && (
        <p className="text-center text-red-500 mt-4 font-semibold">{errors}</p>
      )}
    </div>
  );
};

export default AllDoctors;
