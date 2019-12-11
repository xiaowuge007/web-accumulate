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


/*
* 深度优先遍历、广度优先遍历
* */
let treeArr = [
    {
        name: '1',
        children: [
            {
                name: '1-1',
                children: [{name:'1-1-1'}]
            },{
                name: '1-2',
                children: [{name:'1-2-1'},{name:'1-2-2'},{name:'1-2-3'}]
            }
        ]
    },{
        name: '2',
        children: [
            {
                name: '2-1',
                children: [{name:'2-1-1'},{name:'2-1-2'},{name:'2-1-3'}]
            },{
                name: '2-2',
                children: [{name:'2-2-1'},{name:'2-2-2'},{name:'2-2-3',children:[{name:'2-2-3-1'}]}]
            }
        ]
    },{
        name: '3',
        children: [
            {
                name: '3-1',
                children: [{name:'3-1-1'},{name:'3-1-2'},{name:'3-1-3'}]
            }
        ]
    }
]
//深度优先遍历(递归)
function each1(arr,newArr = []) {
    for(let i = 0;i< arr.length;i++){
        newArr.push({name:arr[i].name})
        if(arr[i].children){
            each1(arr[i].children,newArr)
        }
    }
    return newArr;
}
console.log(each1(treeArr))
//深度优先遍历(非递归)
function each2(arr) {
    arr = arr.map(val=>val)
    let newArr = [];
    while(arr.length){
        let item = arr.shift()
        newArr.push({name:item.name})
        if(item.children){
            for(let i = item.children.length-1;i>=0;i--){
                arr.unshift(item.children[i])
            }
        }
    }
    return newArr;
}
console.log(each2(treeArr))

//广度优先遍历
function each3(arr) {
    arr = arr.map(val=>val)
    let newArr = [];
    while(arr.length){
        let item = arr.shift()
        newArr.push({name:item.name})
        if(item.children){
            for(let i = 0;i<item.children.length;i++){
                arr.push(item.children[i])
            }
        }
    }
    return newArr;
}
console.log(each3(treeArr))

/*
* 冒泡排序及优化
* */
//普通冒泡排序
let arr2 = [3,5,1,4,2,6,9,7]
function sort1(arr) {
    for(let i = 0;i<arr.length;i++){
        for(let j =i+1;j<arr.length;j++){
            if(arr[i]>arr[j]){
                let val = arr[i];
                arr[i] = arr[j]
                arr[j] = val
            }
        }
    }
    return arr;
}
console.log(sort1(arr2))
//优化方案
//每次最大值放到最右后，会将本轮最后一个操作的位置作为下一轮的终点，可以减少不必要的一些冒泡
function sort2(arr) {
    let i = arr.length - 1;
    while (i > 0) {
        let pos = 0;
        for (let j = 0; j < i; j++) {
            if (arr[j] > arr[j + 1]) {
                pos = j;
                const temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
        i = pos;
    }
    console.log(arr);
}
sort2(arr2);

/*
* 面向对象的继承
* */
//1.原型继承
!function () {
    function Parent() {

    }
    Parent.prototype.name = 'tom'
    Parent.prototype.eat = function () {}
    function Children() {
    }
    Children.prototype = new Parent()
    Children.prototype.constructor = Children;
}();
/*
* 缺点：一个子类更改了父类原型上的引用类型，导致所有子类都更改
* 缺点：子类无法传参给父类
* */

//2.构造函数继承
!function () {
    function Parent(name) {
        this.name = name;
        this.eat = function () {}
    }
    function Children(name) {
        Parent.call(this,name)
    }
}();
/*
*补足方法1中的缺点
*缺点：不能继承原型属性
* */
//3.组合继承
(function () {
    function Parent(name) {
        this.name = name;
    }
    Parent.prototype.eat = function () {}
    Parent.prototype.arr = [1]
    function Children(name) {
        Parent.call(this,name)
    }
    Children.prototype = new Parent()
    Children.prototype.constructor = Children;
    let person = new Children('tom')
    let person2 = new Children('tom2')
    person.arr.push(2)
    //console.log(person2.arr)
})();
/*
*一般属性放在实例上，方法放在原型上继承
* 缺点：父类上的实例属性创建了两次，造成不必要的性能消耗
* 缺点：一个子类更改了父类原型上的引用类型，导致所有子类都更改
* */
//4.改进的组合继承（寄生组合继承）
(function () {
    function Parent(name) {
        this.name = name;
    }
    Parent.prototype.eat = function () {}
    Parent.prototype.arr = [1]
    function Children(name) {
        Parent.call(this,name)
    }
    Children.prototype.__proto__ = Parent.prototype;
    let person = new Children('tom')
    let person2 = new Children('tom2')
    person.arr.push(2)
    //console.log(person2.arr)
})();
/*
*改进了组合继承实例创建两次的问题
* 缺点：一个子类更改了父类原型上的引用类型，导致所有子类都更改
* */
//5.原型继承实现多继承
(function () {
    function Parent() {
    }
    Parent.prototype.eat = function () {}
    Parent.prototype.arr = [1]
    function Parent2() {
    }
    Parent.prototype.color = 'red';
    function Children(name) {
        Parent.call(this,name)
    }
    function inherit(child,...args) {
        let obj = {};
        args.forEach(val=>{
            obj = Object.assign(obj,val.prototype);
        })
        child.prototype.__proto__ = obj
    }
    //执行继承方法
    inherit(Children,Parent)
    let person = new Children('tom')
    let person2 = new Children('tom2')
    person.arr.push(2)
    console.log(person2.arr)//[1,2]
})();
/*
* 缺点：一个子类更改了父类原型上的引用类型，导致所有子类都更改
* */
//6.改造后的寄生继承
(function () {
    function Parent() {
    }
    Parent.prototype.eat = function () {}
    Parent.prototype.arr = [1]
    function Children(name) {
        function child(){
            Parent.call(this,name)
        }
        child.prototype.__proto__ = deepClone(Parent.prototype)
        return new child()
    }
    let person = new Children('tom')
    let person2 = new Children('tom2')
    person.arr.push(2)
    console.log(person2.arr) //[1]
    console.log(person instanceof Parent)//false
    console.log(person instanceof Children)//false
    console.log(person.constructor === person2.constructor)//false
    //深拷贝
    function deepClone(obj,hash = new WeakMap()) {
        //判断是否循环引用
        if (hash.has(obj)) return hash.get(obj);
        if(typeof obj === 'object' && obj !== null){
            var o = Object.prototype.toString.call(obj) === '[object Array]'?[]:{};
            hash.set(obj, o);
            for(let key in obj){
                if(typeof obj[key] === 'object'){
                    o[key] = deepClone(obj[key],hash)
                }else{
                    o[key] = obj[key]
                }
            }
            return o;
        }else{
            return obj;
        }
    }
})();
/*
* 基本上解决了以上的问题
* 缺点：子类的实例原型链上找不到父类构造函数，也找不到子类构造函数，且子类的构造函数不是同一个
* */
//7.extends关键字继承
(function () {
    class Parent {
        arr = [1]
        constructor(name){
            this.name = name
        }
        eat(){}
    }
    class Children extends Parent {
        constructor(name){
            super(name)
        }
    }
    let person = new Children('tom')
    let person2 = new Children('tom2')
    person.arr.push(2)
    console.log(person2)
})();
/*
* extends关键字继承的实现有些类似寄生组合方式，但是又有些不一样，extends把父类内部非函数属性放到放到子类实例上进行继承，函数放到原型上进行继承。
*而且没有改变继承关系，算是一种完美方案
* */
//8.es5实现extends关键字继承（忽略class 的prototype上定义的属性）
(function () {
    function Parent(name) {
        this.name = name;
    }
    Parent.prototype.eat = function () {}
    Parent.prototype.arr = [1]
    function Children(name) {
        Parent.call(this,name);
        for(let key in Parent.prototype){
            if(typeof Parent.prototype[key] !== 'function'){
                this[key] = deepClone(Parent.prototype[key]);
            }
        }
    }
    Children.prototype.__proto__ = Parent.prototype;
    let person = new Children('tom')
    let person2 = new Children('tom2')
    person.arr.push(2)
    console.log(person2.arr)//[1]
    //深拷贝
    function deepClone(obj,hash = new WeakMap()) {
        //判断是否循环引用
        if (hash.has(obj)) return hash.get(obj);
        if(typeof obj === 'object' && obj !== null){
            var o = Object.prototype.toString.call(obj) === '[object Array]'?[]:{};
            hash.set(obj, o);
            for(let key in obj){
                if(typeof obj[key] === 'object'){
                    o[key] = deepClone(obj[key],hash)
                }else{
                    o[key] = obj[key]
                }
            }
            return o;
        }else{
            return obj;
        }
    }
})();
/*
* 这种方式和extends还是有区别的，就是子类的实例上和原型上会有同名属性，不过父类实例只执行一次
* */
