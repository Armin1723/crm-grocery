const cron = require("node-cron");  
const { loadSubscriptionsToCache } = require("../helpers/subscriptionCache");

const dailySubscriptionsCacheLoadCron = () => {
// Load the daily subscriptions cache
cron.schedule("0 0 * * *", async () => {
    loadSubscriptionsToCache();
  });
};

module.exports = dailySubscriptionsCacheLoadCron;
