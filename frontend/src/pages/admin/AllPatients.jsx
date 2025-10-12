import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Empty,
  Spin,
  Modal,
  Descriptions,
} from "antd";
import { Search } from "lucide-react";
import { allPatients } from "../../apis/admin";

const AllPatients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const res = await allPatients();
      setPatients(res.patients || []);
    } catch (err) {
      console.error(err);
      setErrors(err.message || "Error fetching patients");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchTerm), 400);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const filteredPatients = patients.filter((p) => {
    const name = p?.name?.toLowerCase() || "";
    const email = p?.email?.toLowerCase() || "";
    return (
      name.includes(debouncedSearch.toLowerCase()) ||
      email.includes(debouncedSearch.toLowerCase())
    );
  });

  const columns = [
    {
      title: "Name",
      dataIndex: ["user", "name"],
      render: (name) => (
        <span className="font-medium text-gray-700">{name}</span>
      ),
    },
    {
      title: "Email",
      dataIndex: ["user", "email"],
      render: (email) => <span className="text-gray-600">{email}</span>,
    },
    {
      title: "Phone",
      dataIndex: ["user", "phone"],
      render: (phone) => <span className="text-gray-600">{phone || "—"}</span>,
    },

    {
      title: "Created At",
      dataIndex: "createdAt",
      render: (date) => (
        <span className="text-gray-500">
          {new Date(date).toLocaleDateString()}
        </span>
      ),
    },
    {
      title: "Actions",
      render: (_, record) => (
        <Button
          onClick={() => {
            setSelectedPatient(record);
            setDetailsVisible(true);
          }}>
          Details
        </Button>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto bg-emerald-600 text-white rounded-xl shadow-lg p-8 mb-8">
        <h1 className="text-3xl font-bold mb-2">All Patients</h1>
        <p className="opacity-90">View and manage all registered patients</p>
      </div>

      <div className="relative w-2/3 mx-auto mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type="text"
          value={searchTerm}  
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by Name or Email"
          className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-200 bg-white shadow-sm placeholder-gray-400 text-gray-700 focus:ring-2 focus:ring-indigo-400 focus:shadow-lg transition-all duration-300 ease-in-out"
        />
      </div>

      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <Table
          rowKey="_id"
          columns={columns}
          dataSource={filteredPatients}
          loading={{ spinning: loading, indicator: <Spin size="large" /> }}
          className="rounded-lg shadow-sm"
          pagination={{ className: "mt-4" }}
          locale={{
            emptyText: <Empty description="No patients found" />,
          }}
        />
      </div>

      <Modal
        open={detailsVisible}
        onCancel={() => setDetailsVisible(false)}
        footer={null}
        centered
        title={
          <h2 className="text-xl font-bold text-indigo-600">Patient Profile</h2>
        }>
        {selectedPatient && (
          <Descriptions bordered column={1} size="small">
            <Descriptions.Item label="Name">
              {selectedPatient.user?.name}
              {console.log(selectedPatient)}
            </Descriptions.Item>
            <Descriptions.Item label="Email">
              {selectedPatient.user?.email}
            </Descriptions.Item>
            <Descriptions.Item label="Phone">
              {selectedPatient.user?.phone || "—"}
            </Descriptions.Item>
            <Descriptions.Item label="Gender">
              {selectedPatient.gender || "—"}
            </Descriptions.Item>
            <Descriptions.Item label="Age">
              {selectedPatient.user?.age || "—"}
            </Descriptions.Item>
            <Descriptions.Item label="Registered On">
              {new Date(selectedPatient?.user.createdAt).toLocaleDateString()}
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

export default AllPatients;
