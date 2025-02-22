// src/components/CompanyList.jsx

import React from 'react';

const CompanyList = () => {
  const companies = [
    // Technology Companies
    "Google",
    "Microsoft",
    "Apple",
    "Amazon",
    "Facebook (Meta)",
    "Tesla",
    "IBM",
    "Adobe",
    "NVIDIA",
    "Oracle",
    "Intel",
    "Qualcomm",
    "SAP",
    "Salesforce",
    "Twitter",
    "Spotify",
    "Zoom Video Communications",
    "Slack Technologies",
    "Dropbox",
    "LinkedIn",

    // Consulting Companies
    "McKinsey & Company",
    "Boston Consulting Group (BCG)",
    "Bain & Company",
    "Deloitte",
    "PwC",
    "Ernst & Young (EY)",
    "KPMG",
    "Accenture",
    "Capgemini",
    "Grant Thornton",
    "Oliver Wyman",
    "Roland Berger",
    "A.T. Kearney",

    // Financial Companies
    "Goldman Sachs",
    "JPMorgan Chase",
    "Morgan Stanley",
    "Barclays",
    "Citigroup",
    "HSBC",
    "Bank of America Merrill Lynch",
    "Deutsche Bank",
    "RBC Capital Markets",
    "Nomura",

    // Manufacturing & Automobiles
    "Toyota",
    "Volkswagen",
    "Ford",
    "General Motors",
    "Hyundai",
    "BMW",
    "Honda",
    "Caterpillar",
    "3M",
    "Honeywell",

    // Startups
    "Airbnb",
    "Uber",
    "Lyft",
    "Stripe",
    "Instacart",
    "Snapchat",
    "ZoomInfo",
    "Peloton",
    "DoorDash",
    "Coinbase"
  ];

  return (
    <>
      {companies.map((company, index) => (
        <option key={index} value={company}>
          {company}
        </option>
      ))}
      <option value="Other">Other</option>
    </>
  );
};

export default CompanyList;
