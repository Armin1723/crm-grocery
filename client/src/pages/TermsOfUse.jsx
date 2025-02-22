import React from 'react'
import NavAlt from '../components/shared/NavAlt'

const TermsOfUse = () => {
  const data = [
    {
      heading: "Introduction",
      content:
        "This Privacy Policy describes how your personal information is collected, used, and shared when you visit or make a purchase from [domain] (the “Site”).",
    },
    {
      heading: "Personal Information We Collect",
      content:
        "When you visit the Site, we automatically collect certain information about your device, including information about your web browser, IP address, time zone, and some of the cookies that are installed on your device. Additionally, as you browse the Site, we collect information about the individual web pages or products that you view, what websites or search terms referred you to the Site, and information about how you interact with the Site. We refer to this automatically-collected information as “Device Information”.",
    },
    {
      heading: "We collect Device Information using the following technologies:",
      content:
        "“Cookies” are data files that are placed on your device or computer and often include an anonymous unique identifier. For more information about cookies, and how to disable cookies, visit http://www.allaboutcookies.org.",
        subHeading: "Log Files",
        subContent:
          "Log files track actions occurring on the Site, and collect data including your IP address, browser type, Internet service provider, referring/exit pages, and date/time stamps.",

        bullets: [
          "Web beacons, tags, and pixels are electronic files used to record information about how you browse the Site.",
          "Additionally when you make a purchase or attempt to make a purchase through the Site, we collect certain information from you, including your name, billing address, shipping address, payment information (including credit card numbers), email address, and phone number.  We refer to this information as “Order Information”.",
          "When we talk about “Personal Information” in this Privacy Policy, we are talking both about Device Information and Order Information.",
          "We use the Order Information that we collect generally to fulfill any orders placed through the Site (including processing your payment information, arranging for shipping, and providing you with invoices and/or order confirmations). Additionally, we use this Order Information to communicate with you.",
          "We use the Device Information that we collect to help us screen for potential risk and fraud (in particular, your IP address), and more generally to improve and optimize our Site (for example, by generating analytics about how our customers browse and interact with the Site, and to assess the success of our marketing and advertising campaigns).",
        ],
    },
    {
      heading: "How Do We Use Your Personal Information?",
      content:
        "We use the Order Information that we collect generally to fulfill any orders placed through the Site (including processing your payment information, arranging for shipping, and providing you with invoices and/or order confirmations). Additionally, we use this Order Information to:",
    },
    {
      heading: "Sharing Your Personal Information",
      content:
        "We share your Personal Information with third parties to help us use your Personal Information, as described above. For example, we use Shopify to power our online store--you can read more about how Shopify uses your Personal Information here: https://www.shopify.com/legal/privacy.",
    },
    {
      heading: "Behavioral Advertising",
      content:
        "As described above, we use your Personal Information to provide you with targeted advertisements or marketing communications we believe may be of interest to you. For more information about how targeted advertising works, you can visit the Network Advertising Initiative’s (“NAI”) educational page at http://www.networkadvertising.org/understanding-online-advertising/how-does-it-work.",
    },
    {
      heading: "Your Rights",
      content
        : "If you are a European resident, you have the right to access personal information we hold about you and to ask that your personal information be corrected, updated, or deleted. If you would like to exercise this right, please contact us through the contact information below.",
      subHeading: "Data Retention",
      subContent:
        "When you place an order through the Site, we will maintain your Order Information for our records unless and until you ask us to delete this information.",
      bullets: [
        "If you are a European resident we note that we are processing your information in order to fulfill contracts we might have with you (for example if you make an order through the Site), or otherwise to pursue our legitimate business interests listed above. Additionally, please note that your information will be transferred outside of Europe, including to Canada and the United States.",
        "When you place an order through the Site, we will maintain your Order Information for our records unless and until you ask us to delete this information.",
        "If you are a European resident, you have the right to access personal information we hold about you and to ask that your personal information be corrected, updated, or deleted. If you would like to exercise this right, please contact us through the contact information below.",
        "Additionally, if you are a European resident we note that we are processing your information in order to fulfill contracts we might have with you (for example if you make an order through the Site), or otherwise to pursue our legitimate business interests listed above. Additionally, please note that your information will be transferred outside of Europe, including to Canada and the United States.",
      ],
    }
  ]

  return (
    <div className='flex flex-col bg-[var(--color-primary)] !text-[var(--color-text)] h-screen overflow-y-auto text-justify'>
      <NavAlt title="Terms of Use"/>
      <div className='flex-1 flex flex-col px-12 '>
        {data.map((item, index) => (
          <div key={index} className='p-6 bg-[var(--color-card)] border-b border-neutral-500/50'>
            <h2 className='text-xl font-bold'>{item.heading}</h2>
            <p className='mt-3 text-[var(--color-text-light)]'>{item.content}</p>
            {item.subHeading && <h3 className='text-lg font-bold mt-3'>{item.subHeading}</h3>}
            {item.subContent && <p className='mt-3 text-[var(--color-text-light)]'>{item.subContent}</p>}
            {item.bullets && (
              <ul className='list-disc pl-6 mt-3'>
                {item.bullets.map((bullet, index) => (
                  <li key={index} className='text-[var(--color-text-light)]'>{bullet}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default TermsOfUse