import { ReactElement, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
import { Column } from "react-table";
import AdminSidebar from "../../components/admin/AdminSidebar";
import TableHOC from "../../components/admin/TableHOC";
import { Skeleton } from "../../components/Loader";
import { useAllProductsQuery } from "../../redux/api/productAPI";
import { RootState, server } from "../../redux/store";
import { CustomError } from "../../types/api-types";
import { User } from "../../types/types";
import { useSelector } from "react-redux";

interface DataType {
  photo: ReactElement;
  name: string;
  price: number;
  stock: number;
  action: ReactElement;
}

const columns: Column<DataType>[] = [
  {
    Header: "Photo",
    accessor: "photo",
  },
  {
    Header: "Name",
    accessor: "name",
  },
  {
    Header: "Price",
    accessor: "price",
  },
  {
    Header: "Stock",
    accessor: "stock",
  },
  {
    Header: "Action",
    accessor: "action",
  },
];

const arr: Array<DataType> = [];

const Products = () => {

  const { user, loading } = useSelector(
    (state: RootState) => state.userReducer
  )

  const { data, isLoading, isError, error } = useAllProductsQuery(user?._id!);

  const [rows, setRows] = useState<DataType[]>(arr);

  if(isError) {
    const err = error as CustomError;
    toast.error(err.data.message);
  }

  useEffect(() => {
    if(data) {
      setRows(data.products.map( i => ({
        photo: <img src={`${server}/${i.photo}`} />,
        name: i.name,
        price: i.price,
        stock: i.stock,
        action: <Link to={`/admin/product/${i._id}`}>Manage</Link>
      })))
    }
  }, [data]);


  const Table = TableHOC<DataType>(
    columns,
    rows,
    "dashboard-product-box",
    "Products",
    rows.length > 6
  )();

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main>{isLoading ? <Skeleton length={20} /> : Table}</main>
      <Link to="/admin/product/new" className="create-product-btn">
        <FaPlus />
      </Link>
    </div>
  );
};

export default Products;
