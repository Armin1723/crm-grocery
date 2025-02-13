const getClients = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const response = await fetch(`${process.env.CRM_BACKEND_URL}/api/v1/users?role=admin&page=${page}&limit=${limit}`);

    if (response.status !== 200) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch clients",
        });
    }

    const { users, totalResults, totalPages } = await response.json();
    
    res.status(200).json({  
        success: true,
        clients: users,
        totalResults,
        totalPages,
    }); 

};

module.exports = {
    getClients,
};