# Why

回答这个问题之前，我们先来看一下前端表单验证的现状。

## 目前主流前端框架下验证的实现方式
### 1. 原味form表单验证
原味form表单验证有两种方式：

通过input元素的type属性来控制的，例如：type="email"、type="number"、type="url"等。
但这种方式扩展性和颗粒度都不够好。我们不深入讨论，有兴趣可以自行了解。

另一种自定义的验证的结果是通过form元素的submit事件相应的回调函数来处理的。

```jsx 
import React, { useState } from "react";

export const MyForm = () => {
    const [username, setUsername] = useState("");
    const [count, setCount] = useState(0);
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault(); // 甚至需要手动阻止默认行为
        let isValid = true;
        let errors = "";

        if (username.length < 5 || username.length > 10) {
            isValid = false;
            errors += "Username must be between 5 and 10 characters.\n";
        }
        
        if (count < 0) {
            isValid = false;
            errors += "Count must be greater than or equal to 0.\n";
        }

        if (!isValid) {
            setErrorMessage(errors);
        } else {
            setErrorMessage("");
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

            <button type="button" onClick={() => setCount((x) => x + 1)}>
                +
            </button>
            {count}
            <button type="button" onClick={() => setCount((x) => x - 1)}>
                -
            </button>

            <input type="submit" value="Submit" />

            {errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>}
        </form>
    );
};
```

其实从这里可以看出，原味from表单的验证的**提交**功能一般都不需要，你甚至经常需要手动阻止默认行为。 
其实我们没有充分的理由必须使用form标签和onSubmit事件，你完全可以完全不使用form标签，直接监听input的onClick事件更简单。

### 2. react-hook-form

这是一个在Github上至今为止有 41k+ star的项目，它对原生的form表单进行了封装，提供了更加方便的API。 不少组件都是基于react-hook-form进行封装的。
但是它的验证方式依然是通过form元素的submit事件相应的回调函数来处理的。

我们先用纯react-hook-form的方式来实现上面的例子：

```typescript jsx
import { useForm } from "react-hook-form";

export const MyForm = () => {
    const {
        register,
        handleSubmit,
        setValue,
        getValues,
        formState: { errors },
    } = useForm({
        defaultValues: {
            username: "test",
            count: 0,
        },
    });

    useEffect(() => {
        register("count", {
            validate: (value) =>
                value >= 0 || "Count must be greater than or equal to 0.",
        });
    }, [register]);
    
    const onSubmit = (data: any) => {
        console.log(data);
    };

    const incrementCount = () => {
        const currentCount = getValues("count");
        setValue("count", currentCount + 1);
    };

    const decrementCount = () => {
        const currentCount = getValues("count");
        setValue("count", currentCount - 1);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <label htmlFor="username">Username:</label>
            <input
                type="text"
                id="username"
                // 请注意这段侵入代码
                {...register("username", {
                    required: true,
                    minLength: 5,
                    maxLength: 10,
                })}
            />
            {errors.username && (
                <span>Username must be between 5 and 10 characters.</span>
            )}

            <button type="button" onClick={incrementCount}>
                +
            </button>
            <span>{getValues("count")}</span> {/* 这段代码真不“reactive” */}
            <button type="button" onClick={decrementCount}>
                -
            </button>
            {errors.count && <span>Count must be greater than or equal to 0.</span>}

            <input type="submit" value="Submit" />
        </form>
    );
};
```

似乎完成了工作，但是，hey，我们在用react对吗？为什么这样一个示例里面完全在使用事件驱动的方式在操作数据？这不是react的风格。

我们改进一下，可以用过在外部定义一个state来保存这个数据:

```typescript jsx
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

export const MyForm = () => {
    const [username, setUsername] = useState("test");
    const [count, setCount] = useState(0);
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm({
        // 请注意这个defaultValues
        defaultValues: {
            username: username,
            count: count,
        },
    });

    // 因为没有使用input，不得不在这里注册count
    useEffect(() => {
        register("count", {
            validate: (value) =>
                value >= 0 || "Count must be greater than or equal to 0.",
        });
    }, [register]);

    const onSubmit = (data: any) => {
        console.log(data);
    };

    const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(event.target.value);
    };

    const incrementCount = () => {
        setCount((prevCount) => {
            const newCount = prevCount + 1;
            setValue("count", newCount); // 同步更新 count 的值
            return newCount;
        });
    };

    const decrementCount = () => {
        setCount((prevCount) => {
            const newCount = prevCount - 1;
            setValue("count", newCount); // 同步更新 count 的值
            return newCount;
        });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <label htmlFor="username">Username:</label>
            <input
                type="text"
                id="username"
                value={username}
                // 请注意这段侵入代码                
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

            <button type="button" onClick={incrementCount}>
                +
            </button>
            <span>{count}</span>
            <button type="button" onClick={decrementCount}>
                -
            </button>
            {errors.count && <span>Count must be greater than or equal to 0.</span>}

            <input type="submit" value="Submit" />
        </form>
    );
};
```

因为研究得并不深，我能想到的最简单实现办法就这些了。当然，我们还可以使用某些UI库来用可能更少的代码实现这个功能，但是这些库的验证方式大多也是基于form，所以有这么几个本质问题并没有得到解决：

1. 数据冗余：defaultValues的定义反映了一个问题，其实在react-hook-form中，数据存在两份：一份在hook内部，一份在外部state。真正在验证发生的时候，使用的是hook
   内部的数据。换句话说，我验证的根本不是我真正需要验证的数据(state)。
![2024-09-18-2343.svg](docs%2F2024-09-18-2343.svg)
   
   你不得不花费额外的精力去保证【hook中验证的数据】和【正在使用的state数据】是同一份数据，这一点在涉及到非标准表单组件等复杂情况的时候，会变得尤为明显。


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