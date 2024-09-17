const argon2 = require('@node-rs/argon2')

argon2.hash("Glayson", {
    memoryCost: 47104,
    timeCost: 1,
    parallelism: 1
}).then(console.log)

argon2.verify("$argon2id$v=19$m=47104,t=1,p=1$uXc08cUBdSd5AiIEz6A40g$NbhqsqDb1zxL8eF6tuffmIvXkmpQPh+hXv8pSmBr0EE", "glayson").then(console.log)