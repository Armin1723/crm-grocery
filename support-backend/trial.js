const Lead = require("./models/lead.model")

const addTimeline = async () => {
    const leads = await Lead.find();

    leads.forEach(async (lead) => {
        lead.timeline = [
            {
                description: "Lead Added",
                on: lead.createdAt
            }
        ]

        await lead.save();
    });
}

module.exports = { addTimeline };