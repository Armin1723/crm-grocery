const Company = require("../models/company.model");

async function loadSubscriptionsToCache() {
  try {
    console.log("Loading subscription data into cache...");
    if (!global.subscriptionsCache) {
      global.subscriptionsCache = new Map();
    }

    const activeSubscriptions = await Company.find({
      subscriptionEndDate: { $gte: new Date() },
    });

    global.subscriptionsCache.clear();
    activeSubscriptions.forEach((company) => {
      global.subscriptionsCache.set(company._id.toString(), {
        endDate: company.subscriptionEndDate,
      });
    });

    console.log("Subscription cache loaded successfully.");  
  } catch (error) {
    console.error("Error loading subscription cache:", error);
  }
}

async function updateSubscriptionCache(companyId) {
  try {
    const company = await Company.findById(companyId);

    if (!company) {
      global.subscriptionsCache.delete(companyId);
      return;
    }

    if (new Date(company.subscriptionEndDate) < new Date()) {
      global.subscriptionsCache.delete(companyId);
    } else {
      global.subscriptionsCache.set(companyId.toString(), {
        endDate: company.subscriptionEndDate,
      });
    }

    console.log(`Subscription cache updated for company: ${companyId}`);
  } catch (error) {
    console.error("Error updating subscription cache:", error);
  }
}

module.exports = { loadSubscriptionsToCache, updateSubscriptionCache };
