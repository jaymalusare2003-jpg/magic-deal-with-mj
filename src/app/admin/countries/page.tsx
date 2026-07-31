import { CrudPage } from "@/components/shared/crud-page"
import type { CrudConfig } from "@/components/shared/crud-page"

export default async function CountriesPage() {
  const config: CrudConfig = {
    table: "countries",
    title: "Countries",
    description: "Manage countries and geo-targeting",
    searchKey: "name",
    columns: [
      { key: "code", header: "Code" },
      { key: "name", header: "Country" },
      { key: "region", header: "Region" },
      { key: "language", header: "Language" },
      { key: "currency", header: "Currency" },
      {
        key: "active",
        header: "Active",
        render: (row: any) => <span className={row.active ? "text-green-600 font-medium" : "text-red-600 font-medium"}>{row.active ? "Yes" : "No"}</span>,
      },
    ],
    fields: [
      { name: "code", label: "Country Code", type: "text", required: true, placeholder: "e.g. US" },
      { name: "name", label: "Country Name", type: "text", required: true, placeholder: "e.g. United States" },
      { name: "region", label: "Region", type: "text", placeholder: "e.g. North America" },
      { name: "language", label: "Language", type: "text", placeholder: "e.g. en" },
      { name: "currency", label: "Currency Code", type: "text", placeholder: "e.g. USD" },
      { name: "currency_symbol", label: "Currency Symbol", type: "text", placeholder: "e.g. $" },
      { name: "active", label: "Active", type: "switch" },
    ],
  }

  return <CrudPage config={config} />
}
