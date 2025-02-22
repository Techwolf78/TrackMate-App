// src/components/CollegeList.js

import React from 'react';

const CollegeList = () => {
  const colleges = [
    // Engineering Colleges
    "Indian Institute of Technology Bombay (IITB)",
    "University of Mumbai",
    "VJTI (Veermata Jijabai Technological Institute)",
    "Sardar Patel College of Engineering",
    "Dr. Babasaheb Ambedkar Technological University",
    "Institute of Chemical Technology",
    "College of Engineering Pune (COEP)",
    "Shivaji University",
    "MIT College of Engineering",
    "Ramaiah College of Engineering",
    "National Institute of Industrial Engineering (NITIE), Mumbai",
    "Mukesh Patel School of Technology Management and Engineering (MPSTME), Mumbai",
    "D.K.T.E. Society's Textile & Engineering Institute, Ichalkaranji",
    "KK Wagh Education Society's Institute of Engineering and Research, Nashik",
    "Indira College of Engineering and Management, Pune",
    "Sinhgad Institute of Technology, Pune",
    "Vishwakarma Institute of Technology, Pune",
    "DY Patil College of Engineering, Pune",
    "Bharati Vidyapeeth College of Engineering, Pune",
    "PDEA's College of Engineering, Pune",

    // MBA Colleges
    "SP Jain Institute of Management and Research (SPJIMR), Mumbai",
    "NMIMS School of Business Management, Mumbai",
    "Symbiosis Institute of Business Management (SIBM), Pune",
    "Indian Institute of Management (IIM), Ahmedabad",
    "Tata Institute of Social Sciences (TISS), Mumbai",
    "Welingkar Institute of Management Development and Research, Mumbai",
    "KJ Somaiya Institute of Management Studies and Research, Mumbai",
    "Institute of Management Development and Research (IMDR), Pune",
    "Balaji Institute of Modern Management (BIMM), Pune",
    "Indira Institute of Management, Pune",
    "MIT School of Business, Pune",
    "Bharati Vidyapeeth Institute of Management and Research, Navi Mumbai",
    "Jamnalal Bajaj Institute of Management Studies (JBIMS), Mumbai",
    "LBSIM (Lakshmibai College of Management), Mumbai",
    "International Management Institute (IMI), New Delhi",
    "Narsee Monjee Institute of Management Studies (NMIMS), Mumbai",
    "Mumbai Business School, Mumbai",
    "MICA (Mudra Institute of Communications), Ahmedabad"
  ];

  return (
    <>
      {colleges.map((college, index) => (
        <option key={index} value={college}>
          {college}
        </option>
      ))}
      <option value="Other">Other</option>
    </>
  );
};

export default CollegeList;
