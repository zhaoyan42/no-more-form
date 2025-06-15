// 验证分组信息类型定义

export type ValidationGroupType = "company" | "department" | "employee";

export interface ValidationGroupInfo {
  type: ValidationGroupType;
  id: string;
  name: string;
  parentId?: string; // 用于层级关系，比如员工属于哪个部门
}

export interface CompanyValidationGroup extends ValidationGroupInfo {
  type: "company";
}

export interface DepartmentValidationGroup extends ValidationGroupInfo {
  type: "department";
}

export interface EmployeeValidationGroup extends ValidationGroupInfo {
  type: "employee";
  parentId: string; // 部门ID
}

export type ValidationExtra =
  | CompanyValidationGroup
  | DepartmentValidationGroup
  | EmployeeValidationGroup;

// 工具函数：创建分组信息
export const createValidationGroup = {
  company: (id: string, name: string): CompanyValidationGroup => ({
    type: "company",
    id,
    name,
  }),

  department: (id: string, name: string): DepartmentValidationGroup => ({
    type: "department",
    id,
    name,
  }),

  employee: (
    id: string,
    name: string,
    departmentId: string,
  ): EmployeeValidationGroup => ({
    type: "employee",
    id,
    name,
    parentId: departmentId,
  }),
};

// 工具函数：按类型过滤验证组
export const isValidationGroupType = {
  company: (group: ValidationExtra): group is CompanyValidationGroup =>
    group.type === "company",

  department: (group: ValidationExtra): group is DepartmentValidationGroup =>
    group.type === "department",

  employee: (group: ValidationExtra): group is EmployeeValidationGroup =>
    group.type === "employee",
};
