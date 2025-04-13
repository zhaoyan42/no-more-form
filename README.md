这个项目“不会”为您提供一个绝对完美的解决方案。它主要包含一个已经用于生产环境的简易验证框架，以及一些示例代码。以下我会逐步介绍为什么我们应该放弃form验证，以及如何实现一个更加简洁优雅的验证框架。

# Why

我们先来看一看一个不太复杂的例子：

![sample.png](docs%2Fsample.png)

针对这么一个简单的表单，我们需要做几个简单的验证：
1. Name 必填
2. Name 必须是中文
3. Email 必填
4. Email 必须是 qq.com 或者 163.com 邮箱
5. Email 为 live.com 时，给出一个!!!警告!!!，但不阻止提交
6. Count 必须在 3 和 10 之间
7. Count 必须是奇数
8. 如果有错误，应该阻止提交

## 验证框架

### 1. 不使用验证框架

```typescript jsx
import { useState } from "react";

const MyForm = () => {
   const [name, setName] = useState("");
   const [email, setEmail] = useState("");
   const [count, setCount] = useState(0);
   const [errors, setErrors] = useState({});

   const validate = () => {
      const newErrors = {};
      // 验证Name
      if (!name) {
         newErrors.name = "Name 必填";
      } else if (!/^[\u4e00-\u9fa5]+$/.test(name)) {
         newErrors.name = "Name 必须是中文";
      }

      // 验证Email
      if (!email) {
         newErrors.email = "Email 必填";
      } else if (!/^\S+@(qq\.com|163\.com)$/.test(email)) {
         if (/^\S+@live\.com$/.test(email)) {
            newErrors.email = "警告: live.com 可能注册失败"; // 这里是一个警告
         } else {
            newErrors.email = "Email 必须是 qq.com 或者 163.com 邮箱";
         }
      }

      // 验证Count
      if (count < 3 || count > 10) newErrors.count = "Count 必须在 3 和 10 之间";
      if (count % 2 === 0) newErrors.count = "Count 必须是奇数";
      setErrors(newErrors);
      return (
              Object.keys(newErrors).length === 0 ||
              newErrors.email === "警告: live.com 可能注册失败"
      ); // 这里用错误信息来判断
   };

   const handleSubmit = (e) => {
      e.preventDefault();
      if (validate()) {
         console.log("Form submitted:", { name, email, count });
      }
   };

   return (
           <form onSubmit={handleSubmit}>
              <div>
                 <label>Name:</label>
                 <input
                         type="text"
                         value={name}
                         onChange={(e) => setName(e.target.value)}
                 />
                 {errors.name && <span>{errors.name}</span>}
              </div>
              <div>
                 <label>Email:</label>
                 <input
                         type="email"
                         value={email}
                         onChange={(e) => setEmail(e.target.value)}
                 />
                 {errors.email && <span>{errors.email}</span>}
              </div>
              <div>
                 <label>Count:</label>
                 <button type="button" onClick={() => setCount(count - 1)}>-</button>
                 <input
                         type="number"
                         value={count}
                         onChange={(e) => setCount(parseInt(e.target.value) || 0)}
                         onWheel={(e) => {
                            e.preventDefault(); // 阻止页面滚动
                            const direction = e.deltaY < 0 ? 1 : -1;
                            setCount(count + direction);
                         }}
                         style={{ width: "50px", textAlign: "center", margin: "0 8px" }}
                 />
                 <button type="button" onClick={() => setCount(count + 1)}>+</button>
                 {errors.count && <span>{errors.count}</span>}
              </div>
              <button type="submit">Submit</button>
           </form>
   );
};
```

看起来完成得不错，但似乎validate函数耦合了太多的逻辑。我们试试用验证框架来改进一下。

### 2. react-hook-form

这是一个在Github上至今为止有 41k+ star的项目，它对原生的form表单进行了封装，提供了更加方便的API。 不少组件都是基于react-hook-form进行封装的。
但是它的验证方式依然是通过form元素的submit事件相应的回调函数来处理的。

我们用react-hook-form改进一下这个例子：

```typescript jsx
import { useState } from "react";
import { useForm } from "react-hook-form";

const MyForm = () => {
   const [name, setName] = useState("");
   const [email, setEmail] = useState("");
   const [count, setCount] = useState(0);

   const {
      register,
      handleSubmit,
      formState: { errors },
      setValue,
   } = useForm({
      defaultValues: { name, email, count }, // 默认值？我们待会儿会讲到
   });

   const submit = () => {
      console.log("Form submitted:", { name, email, count });
   };

   const validateEmail = (value) => {
      if (/^\S+@(qq\.com|163\.com)$/.test(value)) return true;
      if (/^\S+@live\.com$/.test(value)) return "警告: live.com 邮箱可能注册失败";
      return "Email 必须是 qq.com 或者 163.com 邮箱";
   };

   const validateCount = (value) => {
      if (value < 3 || value > 10) return "Count 必须在 3 和 10 之间";
      if (value % 2 === 0) return "Count 必须是奇数";
      return true;
   };

   // 参数中的data其实根本用不上，因为我们已经在组件中维护了name、email、count的状态
   const handleFormSubmit = (data, e) => {
      const hasErrors = Object.keys(errors).length > 0;
      if (hasErrors) {
         return;
      }

      submit();
   };

   const onInvalid = (errors, e) => {
      const hasLiveEmailWarning =
              errors.email?.message === "警告: live.com 邮箱可能注册失败"; // 仍然绕不开根据message判断
      if (hasLiveEmailWarning) {
         e.preventDefault();
         submit(); // 为了绕开警告，我们不得不在onInvalid中调用onSubmit，真奇怪
      }
   };

   return (
           <form onSubmit={handleSubmit(handleFormSubmit, onInvalid)}>
              <div>
                 <label>姓名:</label>
                 <input
                         {...register("name", {
                            required: "姓名不能为空",
                            validate: (value) =>
                                    /^[\u4e00-\u9fa5]+$/.test(value) || "姓名必须为中文",
                         })}
                         value={name}
                         onChange={(e) => {
                            setName(e.target.value);
                         }}
                 />
                 {errors.name && <span>{errors.name.message}</span>}
              </div>
              <div>
                 <label>邮箱:</label>
                 <input
                         {...register("email", {
                            required: "Email不能为空",
                            validate: validateEmail,
                         })}
                         value={email}
                         onChange={(e) => {
                            setEmail(e.target.value);
                         }}
                 />
                 {errors.email && <span>{errors.email.message}</span>}
              </div>
              <div>
                 <label>计数:</label>
                 <button
                         type="button"
                         onClick={() => {
                            setCount(count - 1);
                            setValue("count", count - 1); // 这里必须显式手动同步！！！
                         }}
                 >
                    -
                 </button>
                 <input
                         type="number"
                         value={count}
                         onChange={(e) => {
                            const newValue = parseInt(e.target.value) || 0;
                            setCount(newValue);
                            setValue("count", newValue); // 同步到react-hook-form
                         }}
                         onWheel={(e) => {
                            e.preventDefault(); // 阻止页面滚动
                            const direction = e.deltaY < 0 ? 1 : -1;
                            const newValue = count + direction;
                            setCount(newValue);
                            setValue("count", newValue); // 同步到react-hook-form
                         }}
                         {...register("count", {
                            validate: validateCount,
                         })}
                         style={{ width: "50px", textAlign: "center", margin: "0 8px" }}
                 />
                 <button
                         type="button"
                         onClick={() => {
                            setCount(count + 1);
                            setValue("count", count + 1); // 同步到react-hook-form
                         }}
                 >
                    +
                 </button>
                 {errors.count && <span>{errors.count.message}</span>}
              </div>
              <button type="submit">提交</button>
           </form>
   );
};
```

经过如此多的补丁，我们终于用上了react-hook-form，但是我们发现，几个如此简单的需求，我们竟然需要这么多的代码来实现。

这里我们简单总结一下使用react-hook-form遇到的问题：

1. 数据冗余：defaultValues的定义反映了一个问题，其实在整个表单中，存在两份数据：一份在hook内部，一份在外部state。验证发生的时候，使用的是hook
   内部的数据。让我们把话说明确一点，验证的根本不是我真正需要验证的数据(state)，而是另一份数据冗余（hook内）。

   ![2024-09-18-2343.svg](docs%2F2024-09-18-2343.svg)
   
   你不得不花费额外的精力去保证【hook中验证的数据】和【正在使用的state数据】是同一份数据，这一点在示例的Count中，尤为明显：
   
   在onChange、onWheel、onClick事件中，我们不得不手动同步数据到hook中。并且这个情况在数据修改的途径增多时（比如WebSocket），变得更加复杂，每个修改数据的地方都需要知道【应该同步数据】这件事。

   思考一下，我们到底是因为【按了按钮/滚了滚轮】所以需要进行验证，还是因为【数据被修改】所以需要进行验证？显然是后者。
   
   我知道有人会说，那为什么不直接使用hook中提供的数据呢？

   我们之所以要使用MVVM框架，很大程度上是因为我们希望能把数据（状态）作为一等公民，而数据（状态）其实就是我们页面的业务模型核心部分。

   如果是因为验证框架的问题导致我们不得不向框架妥协，使用框架提供的状态数据，那就本末倒置了。

   换句话说，验证框架应该依赖于业务模型，而不是业务模型依赖于验证框架。

2. 结果类型缺失：示例中的【建议】或者叫【警告】类型其实是一个较为常见的验证场景，但是form却用 true | string 来把【类型】和【消息】两个状态进行了合并，这样简化的模型导致我们无法从中区分出【建议】和【错误】。

   为了解决这个问题，我们不得不在onInvalid中通过message来判断是否是一个【建议】，这样的做法显然是不合理的。

   ```typescript jsx
   // return的类型是 true | string ，即使不考虑“警告”，也应该是两个维度：【状态】【消息】
   if (/^\S+@(qq\.com|163\.com)$/.test(value)) return true;
   if (/^\S+@live\.com$/.test(value)) return "警告: live.com 邮箱可能注册失败";
   return "Email 必须是 qq.com 或者 163.com 邮箱";
   ```

一定要究其根本原因，我认为，其实是因为form是Web 1.0时代基于“同步提交”或者叫“传统表单提交”实现的一个数据交互功能。

时代在进步，数据交互方式发生了改变（Ajax，WebSocket），界面变得复杂的同时，交互方式也在变得更复杂。form已经显得有些年迈吃力了。

如果我们继续使用它，确实仍然可以利用它的验证状态(稍后会解释这个概念)，但不得不强行的往form的验证模型上靠。但我认为这无异于在一个年久失修的代码上不断地堆叠补丁。

# What
## 当我们在做验证的时候，我们到底在做什么？

我非常喜欢杰弗逊大厦的故事：
1. 杰弗逊纪念堂的白色大理石墙面出现裂纹，变得斑驳陈旧。
2. 专家看到清洁工用水冲刷墙角，意识到清洁剂对建筑物有腐蚀作用。
3. 清洁工每天冲刷两次墙角，原因是墙角有鸟粪。
4. 大厦周围聚集了很多燕子，因为墙上有很多燕子爱吃的蜘蛛。
5. 蜘蛛多是因为墙上有蜘蛛喜欢吃的飞虫。
6. 飞虫在这里繁殖特别快，原因是大厦内的阳光充足，大量飞虫聚集在此，超常繁殖。

解决办法：关上整幢大厦的窗帘，减少阳光的照射，飞虫就不会大量繁殖，蜘蛛和燕子也就不会聚集在这里，从而减少鸟粪的污染，也就不需要刷墙，从而墙面也不容易被腐蚀开裂。

我们分析问题应该找到问题的关键，而通常出现代码写起来不协调，我第一个想到的就是<strong>业务模型与实现不一致</strong>

我们来重新梳理一下业务：

### 校验部分：主题、规则、结果、结果集

这部分用一句话概括就是 Result=Rule(Subject)  ResultSet=RuleSet(Subject)

1. 主题

被验证的对象。例如：用户输入的用户名、密码、邮箱等。需要注意的是，主题可以是值类型，也可以是一个对象，也可以是一个集合。我们不限定具体的类型

2. 规则

对于主题的判定方法。例如：当用户名长度小于 6 时，应该给出“结果”

3. 结果：

规则用于验证主题后的结论，包括结果类型和提示信息两部分，这里需要注意，类型包含“合法”、“非法”、“建议”，“建议”类型用于提示但并不阻拦用户。例如：{“合法”,“”} 或者 {“非法”,“用户名长度不能小于 6”} 或者 {“建议”,“用户名长度不能小于 6”}

4. 规则集：

多个规则的集合。因为我们通常需要对主题同时进行多个规则的验证。例如：用户名长度不能小于 6；用户名不能包含特殊字符。

5. 结果集：

规则集应用于主题后的结论集。通常包含了多个结果。例如：[{“非法”,“密码长度不能小于 12”},{“非法”,“密码必须包含数字”},{“建议”,“密码建议包含大写字符”}]

### 显示部分：状态、视觉呈现
1. 状态：

用于推导出界面是否应该的显示结果集，目前仅包括Dirty和Touched两种状态。Dirty表示主题数据已经被修改，Touched一般用于表示主题数据已经被用户操作过。这两种状态的目的是为了在用户操作后，及时展示验证结果。例如：当用户输入用户名后，用户名的状态应该是Dirty，当用户离开用户名输入框后，用户名本次验证的状态应该是Touched。

2. 视觉呈现：得到结果后，展示给用户的方式

决定界面展示**结果集**的形式。包括应该展示的位置，展示的方式，展示的内容等。例如：当遇到非法结果时，应该在输入框**下方**展示**红色字体**信息；当遇到建议结果时，应该在输入框**右侧**展示**黄色字体**提示信息。

# How
## 