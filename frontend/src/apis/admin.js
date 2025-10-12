import api from "./axios";

export const fullList = async () => {
  try {
    const { data } = await api.get("/admin/full-list");
    return data;
  } catch (error) {
    const backendMessage =
      error?.response?.data?.message ||
      error?.message ||
      "error fetching dashboard list";
    throw new Error(backendMessage);
  }
};

export const getNotApprovedDoctors = async () => {
  try {
    const { data } = await api.get("/admin/doctors/not-approved");
    return data;
  } catch (error) {
    const backendMessage =
      error?.response?.data?.message ||
      error?.message ||
      "error getting not approved doctors list";
    throw new Error(backendMessage);
  }
};

export const approveDoctor = async (id) => {
  try {
    const { data } = await api.put(`/admin/doctors/${id}/approve`);
    return data;
  } catch (error) {
    const backendMessage =
      error?.response?.data?.message ||
      error?.message ||
      "error getting not approved doctors list";
    throw new Error(backendMessage);
  }
};

export const rejectDoctor = async (id) => {
  try {
    const { data } = await api.put(`/admin/doctors/${id}/cancel`);
    return data;
  } catch (error) {
    const backendMessage =
      error?.response?.data?.message ||
      error?.message ||
      "error getting not approved doctors list";
    throw new Error(backendMessage);
  }
};

export const getAllAppointmentsForAdmin = async () => {
  try {
    const { data } = await api.get("/admin/appointments");
    return data;
  } catch (error) {
    const backendMessage =
      error?.response?.data?.message ||
      error?.message ||
      "error getting not approved doctors list";
    throw new Error(backendMessage);
  }
};

export const allDoctors = async () => {
  try {
    const { data } = await api.get("/admin/doctors");
    return data;
  } catch (error) {
    const backendMessage =
      error?.response?.data?.message ||
      error?.message ||
      "error getting not approved doctors list";
    throw new Error(backendMessage);
  }
};

export const allPatients = async () => {
  try {
    const { data } = await api.get("/admin/patients");
    return data;
  } catch (error) {
    const backendMessage =
      error?.response?.data?.message ||
      error?.message ||
      "error getting not approved doctors list";
    throw new Error(backendMessage);
  }
};

export const editProfile = async (values) => {
  try {
    const { data } = await api.put("/admin/edit-profile", values);
    return data;
  } catch (error) {
    const backendMessage =
      error?.response?.data?.message ||
      error?.message ||
      "error getting not approved doctors list";
    throw new Error(backendMessage);
  }
};
