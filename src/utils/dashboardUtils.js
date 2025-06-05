export const romanToNumber = (roman) => {
  const romanMap = {
    I: 1,
    II: 2,
    III: 3,
    IV: 4,
    V: 5,
    VI: 6,
    VII: 7,
    VIII: 8,
  };
  return romanMap[roman] || 0;
};

export const processVisitsData = ({
  visits,
  filterCity,
  dateFrom,
  dateTo,
  filterMonth,
  currentPage,
  rowsPerPage,
}) => {
  const filteredVisits = visits
    .filter((v) =>
      filterCity ? v["City"]?.toLowerCase() === filterCity.toLowerCase() : true
    )
    .filter((v) => {
      const rawDate = v["dateandtime"];
      if (!rawDate) return true;

      const parsedDate = new Date(rawDate.split(",")[0]);
      if (isNaN(parsedDate)) return true;

      if (dateFrom && parsedDate < new Date(dateFrom)) return false;
      if (dateTo && parsedDate > new Date(dateTo)) return false;
      if (filterMonth) {
        return parsedDate.getMonth() + 1 === Number(filterMonth);
      }
      return true;
    })
    .sort((a, b) =>
      (b["Visit Code"] || "").localeCompare(a["Visit Code"] || "", undefined, {
        numeric: true,
        sensitivity: "base",
      })
    );

  const totalVisits = filteredVisits.length;
  const successfulConversions = filteredVisits.filter(
    (v) => v["Visit Phase"]?.toLowerCase() === "closure"
  ).length;
  const pendingFollowups = filteredVisits.filter((v) =>
    v["Visit Phase"]?.toLowerCase().includes("follow")
  ).length;

  const totalPages = Math.ceil(filteredVisits.length / rowsPerPage);
  const paginatedVisits = filteredVisits.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return {
    filteredVisits,
    totalVisits,
    successfulConversions,
    pendingFollowups,
    paginatedVisits,
    totalPages,
  };
};

export const getAverage = (visits, key) => {
  const total = visits.reduce((sum, v) => sum + (Number(v[key]) || 0), 0);
  return visits.length > 0 ? (total / visits.length).toFixed(2) : "0.00";
};
