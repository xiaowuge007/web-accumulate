/*
* 1.防抖与节流
*   防抖：高频率事件下，只执行一次
*   节流：高频率事件下，某个时间内只执行一次
* */

//防抖
function fn1() {
    let timer;
    return function () {
        if(timer){
            clearTimeout(timer)
        }
        timer = setTimeout(()=>{
            console.log('防抖。。。')
        },300)
    }
}
$("#fn1").on('click',fn1())

//节流
function fn2() {
    let flag;
    let timer;
    return function () {
        if(flag){
            return;
        }
        flag = true;
        timer = setTimeout(()=>{
            flag = false;
            console.log('节流。。。')
        },1000)
    }
}
$("#fn2").on('click',fn2())

/*
* 2.观察者模式、发布订阅模式
* 2.1 在观察者模式中，观察者是知道Subject的，Subject一直保持对观察者进行记录。
*   然而，在发布订阅模式中，发布者和订阅者不知道对方的存在。它们只有通过消息代理进行通信
* */
//观察者模式
function Subject() {//主题
    this.sub = [];
    this.add = observer => {
        this.sub.push(observer)
    }
    this.next = msg => {
        this.sub.forEach(observer=>{
            observer.update(msg)
        })
    }
}
function Observer(){
    this.update = msg=>{
        console.log(msg)
    }
}
//创建主题和观察者
let subject = new  Subject();
let observer = new  Observer();
//添加观察者
subject.add(observer);
//发送信息
subject.next('新消息');

//发布订阅模式
function Dep() {
    this.sub = {};
    this.emit = (name,msg) =>{
        if(this.sub[name]){
            this.sub[name].forEach(fn=>{
                fn(msg)
            })
        }
    }
    this.on = (name,fn)=>{
        this.sub[name] = this.sub[name] || [];
        this.sub[name].push(fn)
    }
}
//创建中间件
var dep = new Dep()
//创建订阅者
dep.on('news',msg=>{
    console.log(msg)
})
//发布信息
dep.emit('news','重大新闻')


/*
* 3.用js自定义一个事件，可以监听和移除
* */
function MyEvent() {
    this.sub = {}
    this.onceSub = {}
    //监听事件
    this.on = (name,fn)=>{
        this.sub[name] = this.sub[name] || [];
        this.sub[name].push(fn)
    }
    //触发事件
    this.emit = (name,...arg)=>{
        let arr = ['sub','onceSub']
        arr.forEach(key=>{
            if(this[key][name]){
                this[key][name].forEach(fn=>{
                    fn(...arg)
                })
                if(key === 'onceSub'){
                    delete this[key][name]
                }
            }
        })
    }
    //移除事件
    this.remove = (name,fn) =>{
        let arr = ['sub','onceSub']
        arr.forEach( key=>{
            if(this[key][name]){
                if(fn){
                    this[key][name] = this[key][name].filter(val=>{
                        return val !== fn;
                    })
                }else{
                    delete this[key][name];
                }
            }
        })
    }
    //只执行一次事件
    this.once = (name,fn) =>{
        this.onceSub[name] = this.onceSub[name] || [];
        this.onceSub[name].push(fn)
    }
}

function onceClick() {
    console.log('once:click')
}
function handlerClick() {
    console.log('click')
}
function handlerClick2() {
    console.log('click2')
}
let event = new MyEvent();
//监听事件
event.on('click',handlerClick)
event.on('click',handlerClick2)
event.once('click',onceClick)
//触发事件
event.emit('click');// click click2 once:click
//移除事件
event.remove('click',handlerClick2)

event.emit('click') //click

/*
* 4.js 链式调用
* */

//链式调用
function Person() {
    this.event = [];
    this.isInit = false;
    this.eat = (food) =>  {
        let fn = () => {
            console.log('eat:'+food)
        }
        this.addEvent(fn)
        return this;
    }
    this.drink = (food) =>  {
        let fn = () => {
            console.log('drink:'+food)
        }
        this.addEvent(fn)
        return this;
    }
    this.go = (address) => {
        let fn = () => {
            console.log('go:'+address)
        }
        this.addEvent(fn)
        return this;
    }
    this.sleep = (time) =>  {
        this.init()
        this.event.push(()=>{
            let timer = setTimeout(()=>{
                console.log('sleep:'+(time/1000)+'s');
                this.next()
                clearTimeout(timer)
            },time)
        })
        return this;
    }
    this.addEvent = (fn) =>{
        this.init()
        this.event.push(()=>{
            fn()
            this.next()
        })
    }
    this.next = () => {
        if(this.event.length>0){
            let fn = this.event.shift();
            fn();
        }else{
            this.isInit = false;
        }
    }
    this.init = () => {
        if(!this.isInit){
            this.isInit = true;
            Promise.resolve().then(()=>{
                this.next()
            })
        }
    }
}
let person = new Person()
person.eat('午饭').drink('可乐').sleep(5000).go('商场')
setTimeout(()=>{
    person.eat('晚饭')
})
//eat:午饭 drink:可乐 sleep:5s go:商场 eat:晚饭
