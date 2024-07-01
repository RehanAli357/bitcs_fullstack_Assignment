import axios from "axios";

const commonAxios = async (ep, type, data, other) => {
  try {
    return axios({
      method: type,
      url: "http://localhost:5000/" + ep,
      data: data,
      headers: { Authorization: `Bearer ${other}` },
    })
      .then((response) => {
        return response;
      })
      .catch((error) => {
        return error;
      });
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export default commonAxios;
