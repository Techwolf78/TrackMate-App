import { useEffect, useState } from "react";
import { db } from "../../firebaseConfig";
import { ref, get } from "firebase/database";
import FiltersSection from "../../components/SalesDashboard/FiltersSection";
import StatsSection from "../../components/SalesDashboard/StatsSection";
import RecentActivityTable from "../../components/SalesDashboard/RecentActivityTable";
import AllRecordsTable from "../../components/SalesDashboard/AllRecordsTable";
import { processVisitsData } from "../../utils/dashboardUtils";
import Loader from "../../components/SalesDashboard/Loader";

const SalesVisitDashboard = () => {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterCity, setFilterCity] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);
  const [citiesLoaded, setCitiesLoaded] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [filterMonth, setFilterMonth] = useState([]);

  useEffect(() => {
    const fetchVisits = async () => {
      try {
        const visitsRef = ref(db, "salesVisits");
        const snapshot = await get(visitsRef);
        if (snapshot.exists()) {
          const dataObj = snapshot.val();
          const data = Object.entries(dataObj).map(([id, value]) => ({
            id,
            ...value,
          }));
          setVisits(data);
        } else {
          setVisits([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchVisits();
  }, []);

const normalizeCity = (city) => {
  const trimmed = city.trim().toLowerCase();
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1); // e.g., "pune" → "Pune"
};

const loadCities = () => {
  if (!citiesLoaded) {
    const uniqueCities = [
      ...new Set(
        visits
          .map((v) => v["City"])
          .filter(Boolean)
          .map(normalizeCity)
      ),
    ].sort();
    setCityOptions(uniqueCities);
    setCitiesLoaded(true);
  }
};


  const {
    filteredVisits,
    totalVisits,
    successfulConversions,
    pendingFollowups,
    paginatedVisits,
    totalPages,
  } = processVisitsData({
    visits,
    filterCity,
    dateFrom,
    dateTo,
    filterMonth,
    currentPage,
    rowsPerPage: 10,
  });

  return (
    <>
      <style>
        {`
        @keyframes greenBlink {
          0%, 100% {
            background-color: #34D399;
          }
          50% {
            background-color: #065F46;
          }
        }

        .animate-green-blink {
          animation: greenBlink 1s infinite;
        }
      `}
      </style>

      <div className="min-h-screen bg-white p-4 sm:p-6 flex flex-col items-center">
        <div className="w-full max-w-7xl">
          <div className="mb-8 border-b pb-4">
            <h1 className="text-4xl font-semibold text-gray-800 text-center">
              Sales Visit Dashboard
            </h1>
            <p className="text-gray-500 text-center mt-1 sm:mt-2">
              Monitor sales visits, conversions, and follow-ups at a glance.
            </p>
          </div>

          {loading ? (
            <Loader />
          ) : (
            <>
              <FiltersSection
                loadCities={loadCities}
                filterCity={filterCity}
                setFilterCity={setFilterCity}
                setCurrentPage={setCurrentPage}
                dateFrom={dateFrom}
                setDateFrom={setDateFrom}
                dateTo={dateTo}
                setDateTo={setDateTo}
                filterMonth={filterMonth}
                setFilterMonth={setFilterMonth}
                cityOptions={cityOptions}
              />

              <StatsSection
                visits={filteredVisits}
                totalVisits={totalVisits}
                successfulConversions={successfulConversions}
                pendingFollowups={pendingFollowups}
              />

              <RecentActivityTable visits={filteredVisits} />

              <AllRecordsTable
                visits={paginatedVisits}
                currentPage={currentPage}
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default SalesVisitDashboard;
