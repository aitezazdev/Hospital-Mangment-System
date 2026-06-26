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
    const name = p?.user?.name?.toLowerCase() || "";
    const email = p?.user?.email?.toLowerCase() || "";
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
          className="border-gray-300 hover:border-teal-500 hover:text-teal-600"
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
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-5 mb-8">

        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">All Patients</h1>
        <p className="text-slate-500 text-sm mt-1">View and manage all registered patients</p>
      
      </div>

      <div className="relative w-2/3 mx-auto mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type="text"
          value={searchTerm}  
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by Name or Email"
          className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-200 bg-white shadow-sm placeholder-gray-400 text-gray-700 focus:ring-2 focus:ring-teal-400 focus:shadow-lg transition-all duration-300 ease-in-out"
        />
      </div>

      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="overflow-x-auto mt-4">
          <Table
            rowKey="_id"
            scroll={{ x: "max-content" }}
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
      </div>

      <Modal
        open={detailsVisible}
        onCancel={() => setDetailsVisible(false)}
        footer={null}
        centered
        title={
          <h2 className="text-xl font-bold text-teal-700">Patient Profile</h2>
        }>
        {selectedPatient && (
          <Descriptions bordered column={1} size="small">
            <Descriptions.Item label="Name">
              {selectedPatient.user?.name}
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
              {selectedPatient.age || "—"}
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
