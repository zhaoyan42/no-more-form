import type { Company } from "./types";

export const defaultCompanyData: Company = {
  name: "科技创新有限公司",
  totalBudget: 1000000,
  departments: [
    {
      id: "dept_1",
      name: "技术部",
      budget: 500000,
      manager: "",
      employees: [
        {
          id: "emp_1",
          name: "张三",
          email: "zhangsan@company.com",
          department: "技术部",
          role: "高级开发工程师",
          salary: 15000,
          startDate: "2023-01-15",
          skills: ["JavaScript", "React", "Node.js"],
        },
        {
          id: "emp_2",
          name: "李四",
          email: "lisi@company.com",
          department: "技术部",
          role: "前端工程师",
          salary: 12000,
          startDate: "2023-03-01",
          skills: ["Vue.js", "TypeScript", "CSS"],
        },
      ],
    },
    {
      id: "dept_2",
      name: "产品部",
      budget: 300000,
      manager: "",
      employees: [
        {
          id: "emp_3",
          name: "王五",
          email: "wangwu@company.com",
          department: "产品部",
          role: "产品经理",
          salary: 18000,
          startDate: "2022-08-20",
          skills: ["产品设计", "用户研究", "数据分析"],
        },
      ],
    },
  ],
};
