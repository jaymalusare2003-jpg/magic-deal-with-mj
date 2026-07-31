import { CrudPage } from "@/components/shared/crud-page"
import type { CrudConfig } from "@/components/shared/crud-page"

export default async function CategoriesPage() {
  const config: CrudConfig = {
    table: "categories",
    title: "Categories",
    description: "Manage offer categories",
    searchKey: "name",
    columns: [
      { key: "name", header: "Name" },
      { key: "description", header: "Description" },
      { key: "icon", header: "Icon" },
    ],
    fields: [
      { name: "name", label: "Category Name", type: "text", required: true, placeholder: "e.g. Finance" },
      { name: "description", label: "Description", type: "textarea", colSpan: 2, placeholder: "Category description..." },
      { name: "icon", label: "Icon", type: "text", placeholder: "e.g. 💰" },
      { name: "color", label: "Color", type: "text", placeholder: "#2563eb" },
      { name: "ai_employee_ids", label: "AI Employees", type: "select", multiple: true, options: [
        { value: "offer-researcher", label: "AI Offer Researcher" },
        { value: "traffic-researcher", label: "AI Traffic Researcher" },
        { value: "seo-employee", label: "AI SEO Employee" },
        { value: "content-employee", label: "AI Content Employee" },
      ]},
      { name: "template_ids", label: "Template IDs", type: "select", multiple: true, options: [] },
      { name: "notes", label: "Notes", type: "textarea", placeholder: "Additional notes...", colSpan: 2 },
    ],
  }

  return <CrudPage config={config} />
}
