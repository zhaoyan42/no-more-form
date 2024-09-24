这个项目“不会”为您提供一个绝对完美的解决方案。它主要包含一个已经用于生产环境的简易验证框架，以及一些示例代码。以下我会逐步介绍为什么我们应该放弃form验证，以及如何实现一个更加简洁优雅的验证框架。

# Why

我们先来看一看一个不太复杂的例子：

![sample.png](docs%2Fsample.png)

针对这么一个简单的表单，我们需要做几个简单的验证：
1. Name 必须是中文
2. Email 必须是 qq.com 或者 163.com 邮箱
3. Count 必须在 3 和 10 之间
4. Count 必须是奇数
5. Email 为 live.com 时，给出一个警告，但不阻止提交
6. 提交时，如果有错误，阻止提交

## 验证框架

### 1. 不使用验证框架

```typescript jsx
import { useState } from 'react';

const MyForm = () => {
   const [name, setName] = useState('');
   const [email, setEmail] = useState('');
   const [count, setCount] = useState(0);
   const [errors, setErrors] = useState({});

   const validate = () => {
      const newErrors = {};
      // 验证Name
      if (!/^[\u4e00-\u9fa5]+$/.test(name)) newErrors.name = 'Name 必须是中文';
      // 验证Email
      if (!/^\S+@(qq\.com|163\.com)$/.test(email)) {
         if (/^\S+@live\.com$/.test(email)) {
            newErrors.email = 'Warning: live.com 可能注册失败';// 这里是一个警告
         } else {
            newErrors.email = 'Email 必须是 qq.com 或者 163.com 邮箱';
         }
      }
      // 验证Count
      if (count < 3 || count > 10) newErrors.count = 'Count 必须在 3 和 10 之间';
      if (count % 2 === 0) newErrors.count = 'Count 必须是奇数';
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0 || newErrors.email === 'Warning: live.com 可能注册失败'; // 这里用错误信息来判断
   };

   const handleSubmit = (e) => {
      e.preventDefault();
      if (validate()) {
         console.log('Form submitted:', { name, email, count });
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
                 <span>{count}</span>
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
                 <span>{count}</span>
                 <button
                         type="button"
                         onClick={() => {
                            setCount(count + 1);
                            setValue("count", count + 1); // 这里必须显式手动同步！！！
                         }}
                 >
                    +
                 </button>
                 {/* 为了能利用上框架，我们不得不使用隐藏的input来让验证生效 */}
                 <input
                         type="hidden"
                         {...register("count", {
                            validate: validateCount,
                         })}
                 />
                 {errors.count && <span>{errors.count.message}</span>}
              </div>
              <button type="submit">提交</button>
           </form>
   );
};
```

经过如此多的补丁，我们终于用上了react-hook-form，但是我们发现，几个如此简单的需求，我们竟然需要这么多的代码来实现。

这里我们简单总结一下使用react-hook-form遇到的问题：

1. 数据冗余：defaultValues的定义反映了一个问题，其实在整个表单中，存在两份数据：一份在hook内部，一份在外部state。真正在验证发生的时候，使用的是hook
   内部的数据。换句话说，我验证的根本不是我真正需要验证的数据(state)。

![2024-09-18-2343.svg](docs%2F2024-09-18-2343.svg)
   
   你不得不花费额外的精力去保证【hook中验证的数据】和【正在使用的state数据】是同一份数据，这一点在涉及到非标准表单组件等复杂情况的时候，会变得尤为明显。
   
   我知道有人会说，那为什么不直接使用hook中提供的数据呢？那么，请思考一个问题，为什么我们要使用react、vue、angular这样的框架？


2. 逻辑侵入：react-hook-form的register使用会侵入到你的组件jsx代码中，占用原本开放的onChange等等行为。在这个示例中，我不得不将onChange={handleUsernameChange}
   放到register后面来覆盖其默认onChange行为。如果是一个非标准的表单组件，情况会更为复杂。


3. UI依赖：form必须在界面上渲染出来，否则验证无法进行。想象一下，你的Tabs中有多个Tab，每个Tab中有一个子表单，而整个Tabs是一个大表单。你不得不将每个Tab渲染出来，然后通过css
   隐藏掉，这样大表单的验证才能进行，（我们甚至还没有讨论这样多层级大表单在无法嵌套的form标签下验证本身的复杂性）。

如此简单的一个验证，竟然让我们的代码看起来像是一大锅意大利面。

一定要究其根本原因，我认为，其实form的验证方式是基于Web 1.0时代的Post Get模型实现的一个数据交互功能，在的MVVM和SPA时代，我们只是使用了它的验证状态(稍后会解释这个概念)，但是却不得不绕过它的其它功能。

一个好的验证框架，应该从切面的去验证已存在的数据，尽可能少地侵入已有的其他逻辑。

那么，有什么办法可以优雅的解决上面的问题？是否会很复杂？

# What
## 当我们在做验证的时候，我们到底在做什么？
### 数据部分：主题、规则、结果、结果集

用一句话概括就是 Result=Rule(Subject)  ResultSet=RuleSet(Subject)

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

### 界面部分：状态、视觉呈现
1. 状态：

用于推导出界面是否应该的显示结果集，目前仅包括Dirty和Touched两种状态。Dirty表示主题数据已经被修改，Touched一般用于表示主题数据已经被用户操作过。这两种状态的目的是为了在用户操作后，及时展示验证结果。例如：当用户输入用户名后，用户名的状态应该是Dirty，当用户离开用户名输入框后，用户名本次验证的状态应该是Touched。

2. 视觉呈现：得到结果后，展示给用户的方式

决定界面展示**结果集**的形式。包括应该展示的位置，展示的方式，展示的内容等。例如：当遇到非法结果时，应该在输入框**下方**展示**红色字体**信息；当遇到建议结果时，应该在输入框**右侧**展示**黄色字体**提示信息。

# How
## 