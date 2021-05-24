
## JWT(JSON Web Token)

参考: 
https://www.jianshu.com/p/43d4d8c40cea
https://www.npmjs.com/package/jsonwebtoken

```
var jwt = require('jsonwebtoken');

var k = 'xianzhou';


var token = jwt.sign({
  data: 'foobar'
}, 'secret', { expiresIn: 60 * 60 });

console.log(token);


var verify = jwt.verify(token, 'secret');

console.log(verify)
```