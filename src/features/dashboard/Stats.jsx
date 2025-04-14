import { HiOutlineBriefcase, HiOutlineChartPie } from "react-icons/hi";
import { HiOutlineBanknotes, HiOutlineCreditCard } from "react-icons/hi2";
import Stat from "./Stat";
import { formatCurrency } from "../../utils/helpers";

function Stats({ orders, paidOrders, numDays }) {
  // 1. Número total de pedidos
  const numOrders = orders?.length;

  // 2. Ventas totales (de cualquier pedido)
  const totalSales = orders?.reduce((acc, cur) => acc + cur.total_amount, 0);

  // 3. Pedidos pagados
  const numPaidOrders = paidOrders?.length;

  // 4. Porcentaje de pagos realizados
  const paidPercentage = numOrders
    ? Math.round((numPaidOrders / numOrders) * 100)
    : 0;

  return (
    <>
      <Stat
        title="Total Orders"
        color="blue"
        icon={<HiOutlineBriefcase />}
        value={numOrders}
      />
      <Stat
        title="Total Sales"
        color="green"
        icon={<HiOutlineBanknotes />}
        value={formatCurrency(totalSales)}
      />
      <Stat
        title="Paid Orders"
        color="indigo"
        icon={<HiOutlineCreditCard />}
        value={numPaidOrders}
      />
      <Stat
        title="Paid %"
        color="yellow"
        icon={<HiOutlineChartPie />}
        value={`${paidPercentage}%`}
      />
    </>
  );
}

export default Stats;
