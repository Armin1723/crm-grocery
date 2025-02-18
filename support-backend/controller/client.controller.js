require("dotenv").config();

const getClients = async (req, res) => {
  const { page = 1, limit = 10, sort = "name", sortType = "desc"} = req.query;
  const response = await fetch(
    `${process.env.CRM_BACKEND_URL}/api/v1/support/clients?page=${page}&limit=${limit}&sort=${sort}&sortType=${sortType}`,
    {
      headers: {
        "x-api-key": process.env.SUPPORT_API_KEY,
      },
    }
  );

  if (response.status !== 200) {
    const data = await response.json();
    return res.status(500).json({
      success: false,
      message: data.message || "Failed to fetch clients",
    });
  }

  const { clients, totalResults, totalPages } = await response.json();

  res.status(200).json({
    success: true,
    clients,
    page,
    totalResults,
    totalPages,
  });
};

const getClient = async (req, res) => {
  const { id } = req.params;
  const response = await fetch(
    `${process.env.CRM_BACKEND_URL}/api/v1/support/clients/${id}`,
    {
      headers: {
        "x-api-key": process.env.SUPPORT_API_KEY,
      },
    }
  );

  if (response.status !== 200) {
    const data = await response.json();
    return res.status(500).json({
      success: false,
      message: data.message || "Failed to fetch client",
    });
  }

  const data = await response.json();

  res.status(200).json({
    success: true,
    client: data.client,
  });
};

const activateClient = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await fetch(
      `${process.env.CRM_BACKEND_URL}/api/v1/support/clients/${id}/activate`,
      {
        method: "POST",
        headers: {
          "x-api-key": process.env.SUPPORT_API_KEY,
          "Content-Type": 'application/json'
        },
        body: JSON.stringify(req.body),
      }
    );

    if (response.status !== 200) {
      const data = await response.json();
      return res.status(500).json({
        success: false,
        message: data.message || "Failed to activate client",
      });
    }

    res.status(200).json({
      success: true,
      message: "Client activated successfully",
    });
  } catch (error) {
    throw {
      success: false,
      message: error.message || "Failed to activate client",
    };
  }
};

module.exports = {
  getClients,
  getClient,
  activateClient,
};
