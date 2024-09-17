# Why
## 目前主流前端框架下验证的实现方式
### 1. 原味form表单验证
原味form表单验证有两种方式：

通过input元素的type属性来控制的，例如：type="email"、type="number"、type="url"等。
但这种方式扩展性和颗粒度都不够好。我们不深入讨论。

```jsx
import React, { useRef, useState } from 'react';

const MyForm = () => {
    const formRef = useRef<HTMLFormElement>(null);
    const [errorMessage, setErrorMessage] = useState<string>('');

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault(); // 手动阻止默认行为

        if (formRef.current && !formRef.current.checkValidity()) {
            setErrorMessage('Form is invalid!');
        } else {
            setErrorMessage('');
            // Handle form submission
        }
    };

    return (
        <form ref={formRef} id="myForm" onSubmit={handleSubmit}>
            <label htmlFor="username">Username:</label>
            <input
                type="text"
                id="username"
                name="username"
                required
                minLength={5}
                maxLength={10}
            />

            <input type="submit" value="Submit" />

            {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
        </form>
    );
};

export default MyForm;
```

另一种自定义的验证的结果是通过form元素的submit事件相应的回调函数来处理的。

```jsx 
import React, { useState } from 'react';

const MyForm = () => {
    const [username, setUsername] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault(); // 甚至需要手动阻止默认行为
        let isValid = true;
        let errors = '';

        if (username.length < 5 || username.length > 10) {
            isValid = false;
            errors += 'Username must be between 5 and 10 characters.\n';
        }

        if (!isValid) {
            setErrorMessage(errors);
        } else {
            setErrorMessage('');
            // Handle form submission
        }
    };

    return (
        <form id="myForm" onSubmit={handleSubmit}>
            <label htmlFor="username">Username:</label>
            <input
                type="text"
                id="username"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />

            <input type="submit" value="Submit" />

            {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
        </form>
    );
};

export default MyForm;
```

其实从这里可以看出，在MVVM和SPA盛行的今天，原味from表单的验证的**提交**功能一般都不需要，你经常需要手动阻止默认行为。 
其实看起来我们没有充分的理由必须使用form标签和onSubmit事件，你完全可以完全不使用form标签。

### 2. react-hook-form

这是一个在Github上至今为止有 41k+ star的项目，它对原生的form表单进行了封装，提供了更加方便的API。 不少组件都是基于react-hook-form进行封装的。
但是它的验证方式依然是通过form元素的submit事件相应的回调函数来处理的。

```typescript jsx
import { useForm } from "react-hook-form";

export const MyForm = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            username: "test",
        },
    });

    const onSubmit = (data: any) => {
        console.log(data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <label htmlFor="username">Username:</label>
            <input
                type="text"
                id="username"
                {...register("username", {
                    required: true,
                    minLength: 5,
                    maxLength: 10,
                })}
            />
            {errors.username && (
                <span>Username must be between 5 and 10 characters.</span>
            )}

            <input type="submit" value="Submit" />
        </form>
    );
};
```

我认为，一个验证框架，应该外部挂载式的去验证已存在的数据，尽可能少地侵入已有的逻辑。

首先，defaultValues的定义说明，其实在react-hook-form中，真正在验证发生的时候，使用的是hook内部的数据。submit的时候，得到的也是内部数据。这会导致什么问题呢？

当你在组件中需要引用这个数据的时候，你需要通过hook的API来获取，这会导致你的代码和hook的API耦合在一起。

当然，你可以用过在外部定义一个state来保存这个数据:

```typescript jsx
import { useState } from "react";
import { useForm } from "react-hook-form";

export const Sample = () => {
    const [username, setUsername] = useState("test");
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm();

    const onSubmit = (data: any) => {
        console.log(data);
    };

    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setUsername(newValue);
        setValue("username", newValue);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <label htmlFor="username">Username:</label>
            <input
                type="text"
                id="username"
                value={username}
                {...register("username", {
                    required: true,
                    minLength: 5,
                    maxLength: 10,
                })}
                onChange={handleUsernameChange}
            />
            {errors.username && (
                <span>Username must be between 5 and 10 characters.</span>
            )}

            <input type="submit" value="Submit" />
        </form>
    );
};
```

但是这样的话，数据就会变为两份，一份在hook内部，一份在外部state，我们称之为冗余，只要存在冗余，就会涉及到同步的问题。

你不得不花费额外的精力去保证【验证的数据】和【最终提交的state数据】是同一份你数据，这一点在涉及到非标准表单组件等复杂情况的时候，会变得尤为明显。

其次，react-hook-form的register使用会侵入到你的jsx代码中，占用原本开放的onChange等等行为（上面这样简单处理后，甚至丢失了onChange的时候应该重新验证的特性）。
如果是一个非标准的表单组件，情况会更为复杂。这极大的违背了少侵入的原则，让我们的代码看起来像一锅意大利面。

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