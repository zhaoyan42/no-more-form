import { aRuleResultOf } from "@/validation/hooks/use-rule-result.ts";
import type { Company, Department, Employee } from "../model/types";

// 员工验证规则
export const employeeNameRules = [
  (name: string) => {
    if (!name.trim()) {
      return aRuleResultOf.invalid("员工姓名不能为空");
    }
    if (name.length < 2) {
      return aRuleResultOf.invalid("员工姓名至少需要2个字符");
    }
    if (name.length > 50) {
      return aRuleResultOf.invalid("员工姓名不能超过50个字符");
    }
    return aRuleResultOf.valid();
  },
];

export const emailRules = [
  (email: string) => {
    if (!email.trim()) {
      return aRuleResultOf.invalid("邮箱地址不能为空");
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return aRuleResultOf.invalid("请输入有效的邮箱地址");
    }
    return aRuleResultOf.valid();
  },
];

export const salaryRules = [
  (salary: number) => {
    if (salary <= 0) {
      return aRuleResultOf.invalid("薪资必须大于0");
    }
    if (salary < 3000) {
      return aRuleResultOf.warning("薪资可能过低，请确认");
    }
    if (salary > 100000) {
      return aRuleResultOf.warning("薪资较高，需要额外审批");
    }
    return aRuleResultOf.valid();
  },
];

// 部门验证规则
export const departmentBudgetRules = [
  (budget: number) => {
    if (budget <= 0) {
      return aRuleResultOf.invalid("部门预算必须大于0");
    }
    return aRuleResultOf.valid();
  },
];

// 创建动态的邮箱唯一性验证规则
export const createEmailUniquenessRules = (
  allEmployees: Employee[],
  currentEmployeeId: string,
) => [
  (email: string) => {
    const duplicates = allEmployees.filter(
      (emp) => emp.id !== currentEmployeeId && emp.email === email,
    );
    if (duplicates.length > 0) {
      return aRuleResultOf.invalid("邮箱地址已被其他员工使用");
    }
    return aRuleResultOf.valid();
  },
];

// 创建部门验证规则
export const createDepartmentValidationRules = () => [
  (department: Department) => {
    const totalEmployeeSalary = department.employees.reduce(
      (sum, emp) => sum + emp.salary,
      0,
    );
    if (totalEmployeeSalary > department.budget) {
      return aRuleResultOf.invalid("员工薪资总和超出部门预算");
    }
    return aRuleResultOf.valid();
  },
  (department: Department) => {
    const managerEmployee = department.employees.find(
      (emp) => emp.id === department.manager,
    );
    if (!managerEmployee && department.employees.length > 0) {
      return aRuleResultOf.invalid("部门必须指定一个管理者");
    }
    return aRuleResultOf.valid();
  },
  (department: Department) => {
    const duplicateEmails = new Set();
    const duplicates = department.employees.filter((emp) => {
      if (duplicateEmails.has(emp.email)) {
        return true;
      }
      duplicateEmails.add(emp.email);
      return false;
    });

    if (duplicates.length > 0) {
      return aRuleResultOf.invalid("部门内不能有重复的邮箱地址");
    }
    return aRuleResultOf.valid();
  },
];

// 创建公司验证规则
export const createCompanyValidationRules = () => [
  (company: Company) => {
    if (!company.name.trim()) {
      return aRuleResultOf.invalid("公司名称不能为空");
    }
    return aRuleResultOf.valid();
  },
  (company: Company) => {
    if (company.totalBudget <= 0) {
      return aRuleResultOf.invalid("公司预算不能为0");
    }
    return aRuleResultOf.valid();
  },
  (company: Company) => {
    const totalDepartmentBudget = company.departments.reduce(
      (sum, dept) => sum + dept.budget,
      0,
    );
    if (totalDepartmentBudget > company.totalBudget) {
      return aRuleResultOf.invalid("各部门预算总和不能超过公司总预算");
    }
    return aRuleResultOf.valid();
  },
  (company: Company) => {
    const departmentNames = company.departments.map((dept) => dept.name);
    const uniqueNames = new Set(departmentNames);
    if (uniqueNames.size !== departmentNames.length) {
      return aRuleResultOf.invalid("部门名称不能重复");
    }
    return aRuleResultOf.valid();
  },
];
