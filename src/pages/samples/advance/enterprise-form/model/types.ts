// 企业级表单的类型定义

export interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  role: string;
  salary: number;
  startDate: string;
  skills: string[];
  manager?: string;
}

export interface Department {
  id: string;
  name: string;
  budget: number;
  employees: Employee[];
  manager: string;
}

export interface Company {
  name: string;
  departments: Department[];
  totalBudget: number;
}

export interface EmployeeEditorProps {
  employee: Employee;
  onUpdate: (employee: Employee) => void;
  allEmployees: Employee[];
}

export interface DepartmentEditorProps {
  department: Department;
  onUpdate: (department: Department) => void;
  company: Company;
}

export interface CompanyEditorProps {
  company: Company;
  onUpdate: (company: Company) => void;
}
