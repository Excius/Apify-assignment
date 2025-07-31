import createAxiosClient from "../utils/axios.js";

export const getActors = async (req, res) => {
  try {
    const axiosClient = createAxiosClient(req.apiKey);
    const response = await axiosClient.get("/acts");

    const actors = response.data.data.items;

    res.json({ actors });
  } catch (error) {
    console.error("Error fetching actors:", err.message);
    res.status(err.response?.status || 500).json({
      error: "Failed to fetch actors",
      details: err.response?.data || err.message,
    });
  }
};

export const getActorSchema = async (req, res) => {
  const actorId = req.params.id;

  if (!actorId) {
    return res.status(400).json({ error: "Actor ID is required" });
  }

  try {
    const axiosClient = createAxiosClient(req.apiKey);
    const response = await axiosClient.get(`/acts/${actorId}/builds/default`);

    res.json({ schema: JSON.parse(response.data.data.inputSchema) });
  } catch (err) {
    console.error("Error fetching schema:", err.message);
    res.status(err.response?.status || 500).json({
      error: "Failed to fetch actor schema",
      details: err.response?.data || err.message,
    });
  }
};

export const runActor = async (req, res) => {
  const actorId = req.params.id;
  const input = req.body.input;

  if (!actorId || input === undefined) {
    return res.status(400).json({ error: "Actor ID and input are required" });
  }

  try {
    // 1. Start the run asynchronously

    const axiosClient = createAxiosClient(req.apiKey);
    const runResp = await axiosClient.post(`/acts/${actorId}/runs`, input);
    const run = runResp.data.data;

    res.json({
      runId: run.id,
      status: run.status,
      defaultDatasetId: run.defaultDatasetId,
    });
  } catch (err) {
    console.error("Error running actor:", err.message);
    res.status(err.response?.status || 500).json({
      error: "Failed to run actor",
      details: err.response?.data || err.message,
    });
  }
};
