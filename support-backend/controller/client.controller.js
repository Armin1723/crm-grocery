const getClients = async (req, res) => {
    const response = await fetch(`${process.env.CRM_BACKEND_URL}/api/v1/users?role=admin`);