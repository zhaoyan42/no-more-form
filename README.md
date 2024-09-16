# Why
## 目前主流的验证框架有哪些？它们的做了什么？
### 1. 原味form表单验证
原味form表单验证有两种方式：

HTML5 内置验证

通过input元素的type属性来控制的，例如：type="email"、type="number"、type="url"等。
但这种方式扩展性和提示性都不够好。我们不深入讨论。

```html
<form id="myForm">
    <label for="username">Username:</label>
    <input type="text" id="username" name="username" required minlength="5" maxlength="10">

    <label for="age">Age:</label>
    <input type="number" id="age" name="age" required min="0" max="100">

    <input type="submit" value="Submit">
</form>
```

另一种自定义的验证的结果是通过form元素的submit事件相应的回调函数来处理的。

```html 
<form id="myForm">
    <label for="username">Username:</label>
    <input type="text" id="username" name="username">

    <label for="age">Age:</label>
    <input type="number" id="age" name="age">

    <input type="submit" value="Submit">
</form>

<script>
    document.getElementById('myForm').addEventListener('submit', function(event) {
        const username = document.getElementById('username').value;
        const age = document.getElementById('age').value;

        let isValid = true;
        let errorMessage = '';

        if (username.length < 5 || username.length > 10) {
            isValid = false;
            errorMessage += 'Username must be between 5 and 10 characters.\n';
        }

        if (age < 0 || age > 100) {
            isValid = false;
            errorMessage += 'Age must be between 0 and 100.\n';
        }

        if (!isValid) {
            alert(errorMessage);
            event.preventDefault();
        }
    });
</script>
```

看起来很符合表单验证的需求对吗？我们来看看form的一些属性：
1. method：表单提交的方式，有get和post两种方式
2. action：表单提交的地址
3. target：表单提交后的目标窗口
4. enctype：表单提交的编码方式
5. accept-charset：表单提交的字符集

等等，这些属性在做什么？这些属性是用来控制表单提交的行为的，而不是用来控制表单验证的行为的。 
所以，原味form表单验证并不全是一个验证框架。你在目前的主流前端框架中使用它的时候甚至经常需要手动屏蔽掉浏览器的默认验证行为（刷新页面）。

在某一些复杂表单中，我们有时会期望验证表单中的一部分数据，而不是全部数据。
想象一下，你现在需要提交一个表单到服务器，在提交前验证其中订单信息和收货地址信息，但事先可以单独。

而当你仅仅保存订单信息（而不提交）的时候，你希望验证订单是否填写正确，但并不希望验证收货地址，因为那可能会让你的收货地址非预期的提示验证错误。


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