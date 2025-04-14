import Filter from "../../ui/Filter";

function DashboardFilter() {
  return (
    <Filter
      filterField="last"
      options={[
        { value: "7", label: "Next 7 days" },
        { value: "30", label: "Next 30 days" },
        { value: "90", label: "Next 90 days" },
      ]}
    />
  );
}

export default DashboardFilter;
