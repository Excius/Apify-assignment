import createAxiosInstance from "../utils/axios.js";

async function validateKey(req, res) {
  const apiHeader = req.headers["authorization"];
  if (!apiHeader) {
    return res.status(400).json({ valid: false, error: "API key is required" });
  }

  const apiKey = apiHeader.split(" ")[1];

  try {
    const axiosClient = createAxiosInstance(apiKey);
    const resp = await axiosClient.get("/users/me");
    return res.json({
      valid: true,
      userId: resp.data.data.id,
      username: resp.data.data.username,
    });
  } catch (err) {
    return res.status(err.response?.status === 401 ? 401 : 500).json({
      valid: false,
      error: err.response?.data?.error?.message || err.message,
    });
  }
}

export { validateKey };
