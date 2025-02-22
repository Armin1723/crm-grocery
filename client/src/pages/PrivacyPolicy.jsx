import React from "react";
import NavAlt from "../components/shared/NavAlt";

const PrivacyPolicy = () => {
  const data = [
    {
      title: "Introduction",
      content:
        "This Privacy Policy describes how your personal information is collected, used, and shared when you visit or make a purchase from [domain] (the “Site”).",
    },
    {
      title: "Personal Information We Collect",
      content:
        "When you visit the Site, we automatically collect certain information about your device, including information about your web browser, IP address, time zone, and some of the cookies that are installed on your device. Additionally, as you browse the Site, we collect information about the individual web pages or products that you view, what websites or search terms referred you to the Site, and information about how you interact with the Site. We refer to this automatically-collected information as “Device Information”.",
    },
    {
      title: "We collect Device Information using the following technologies:",
      content:
        "“Cookies” are data files that are placed on your device or computer and often include an anonymous unique identifier. For more information about cookies, and how to disable cookies, visit http://www.allaboutcookies.org.",
    },
    {
      title: "How Do We Use Your Personal Information?",
      content:
        "We use the Order Information that we collect generally to fulfill any orders placed through the Site (including processing your payment information, arranging for shipping, and providing you with invoices and/or order confirmations). Additionally, we use this Order Information to:",
    },
    {
      title: "Sharing Your Personal Information",
      content:
        "We share your Personal Information with third parties to help us use your Personal Information, as described above. For example, we use Shopify to power our online store--you can read more about how Shopify uses your Personal Information here: https://www.shopify.com/legal/privacy.",
    },
    {
      title: "Behavioral Advertising",
      content:
        "As described above, we use your Personal Information to provide you with targeted advertisements or marketing communications we believe may be of interest to you. For more information about how targeted advertising works, you can visit the Network Advertising Initiative’s (“NAI”) educational page at http://www.networkadvertising.org/understanding-online-advertising/how-does-it-work.",
    },
    {
      title: "Your Rights",
      content:
        "If you are a European resident, you have the right to access personal information we hold about you and to ask that your personal information be corrected, updated, or deleted. If you would like to exercise this right, please contact us through the contact information below.",
      subHeading: "Data Retention",
      subContent:
        "When you place an order through the Site, we will maintain your Order Information for our records unless and until you ask us to delete this information.",
      bullets: [
        "If you are a European resident we note that we are processing your information in order to fulfill contracts we might have with you (for example if you make an order through the Site), or otherwise to pursue our legitimate business interests listed above. Additionally, please note that your information will be transferred outside of Europe, including to Canada and the United States.",
        "When you place an order through the Site, we will maintain your Order Information for our records unless and until you ask us to delete this information.",
        "If you are a European resident, you have the right to access personal information we hold about you and to ask that your personal information be corrected, updated, or deleted. If you would like to exercise this right, please contact us through the contact information below.",
        "Additionally, if you are a European resident we note that we are processing your information in order to fulfill contracts we might have with you (for example if you make an order through the Site), or otherwise to pursue our legitimate business interests listed above. Additionally, please note that your information will be transferred outside of Europe, including to Canada and the United States.",
      ],
    },
    {
      title: "Data Retention",
      content:
        "When you place an order through the Site, we will maintain your Order Information for our records unless and until you ask us to delete this information.",
    },
    {
      title: "Changes",
      content:
        "We may update this privacy policy from time to time in order to reflect, for example, changes to our practices or for other operational, legal or regulatory reasons.",
    },
    {
      title: "Contact Us",
      content:
        "For more information about our privacy practices, if you have questions, or if you would like to make a complaint, please contact us by e-mail at [email] or by mail using the details provided below:",
    },
  ];
  return (
    <div className="flex flex-col bg-[var(--color-primary)] !text-[var(--color-text)] h-screen overflow-y-auto">
      <NavAlt title="Privacy Policy" />
      <div className="flex-1 flex flex-col px-12 text-justify" >
        {data.map((item, index) => (
          <div
            key={index}
            className="p-6 bg-[var(--color-card)] border-b border-neutral-500/50"
          >
            <h2 className="text-xl font-bold my-3">‣ {item.title}</h2>
            <p className="text-[var(--color-text-light)]">{item.content}</p>
            {item.subHeading && (
              <h3 className="text-lg font-bold my-3 pl-4">{item.subHeading}</h3>
            )}
            {item.subContent && (
              <p className="text-[var(--color-text-light)] pl-4">{item.subContent}</p>
            )}
            {item.bullets && (
              <ul className="list-disc list-inside text-[var(--color-text-light)] pl-4">
                {item.bullets.map((bullet, index) => (
                  <li key={index}>{bullet}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PrivacyPolicy;
