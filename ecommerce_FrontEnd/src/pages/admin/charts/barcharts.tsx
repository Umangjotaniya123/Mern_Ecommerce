import toast from "react-hot-toast";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { BarChart } from "../../../components/admin/Charts";
import { useBarQuery } from "../../../redux/api/dashboardAPI";
import { CustomError } from "../../../types/api-types";
import { Skeleton } from "../../../components/Loader";
import { getLastMonths } from "../../../utils/features";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";

const { last12Months, last6Months } = getLastMonths();

const Barcharts = () => {

  const { user, loading } = useSelector(
    (state: RootState) => state.userReducer
  )

  const { isLoading, data, error, isError } = useBarQuery(user?._id!);

  const charts = data?.charts!;

  if (isError) {
    const err = error as CustomError;
    toast.error(err.data.message);
  };

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="chart-container">
        <h1>Bar Charts</h1>
        {isLoading ? <Skeleton length={20} /> :
          <>
            <section>
              <BarChart
                title_1="Products"
                data_1={charts.products}
                title_2="Users"
                data_2={charts.users}
                labels={last6Months}
                bgColor_1={`hsl(260, 50%, 30%)`}
                bgColor_2={`hsl(360, 90%, 90%)`}
              />
              <h2>Top Products & Top Customers</h2>
            </section>

            <section>
              <BarChart
                horizontal={true}
                title_1="Orders"
                data_1={charts.orders}
                data_2={[]}
                title_2=""
                bgColor_1={`hsl(180, 40%, 50%)`}
                bgColor_2=""
                labels={last12Months}
              />
              <h2>Orders throughout the year</h2>
            </section>
          </>
        }
      </main>
    </div>
  );
};

export default Barcharts;
