/**
 * Created by elotoma on 2017/2/26.
 */

//循环队列
function CircleQueue(size){
}
CircleQueue.prototype = {

    //初始化队列
    initQueue : function(size){
        this.size = size;
        this.list = new Array();
        this.capacity = size + 1;
        this.head = 0;
        this.tail = 0;

    },

    //压入队列
    enterQueue : function(ele){
        if(typeof ele == "undefined" || ele == ""){
            return;
        }
        var pos = (this.tail + 1) % this.capacity;
        if(pos == this.head){//判断队列是否已满
            return;
        }else{
            this.list[this.tail] = ele;
            this.tail = pos;
        }
    },
    enterQueues : function(eles) {
        for(var i = 0; i < eles.length; i++) {
            this.enterQueue(eles[i]);
        }
    },

    //从队列中取出头部数据
    delQueue : function(){
        if(this.tail == this.head){ //判断队列是否为空
            return 'empty';
        }else{
            var ele = this.list[this.head];
            this.head = (this.head + 1) % this.capacity;
            return ele;
        }
    },
    delQueues : function(num) {
        var tmp_arr = new Array();
        for(var i = 0; i < num; i++) {
            tmp_arr.push(this.delQueue());
        }
        return tmp_arr;
    },
    delQueueTo : function(ele) {
        var tmp_arr = new Array();
        var el;
        while(true) {
            el = this.delQueue();
            tmp_arr.push(el);
            if(el === ele ) {
                break;
            }
        }

        return tmp_arr;
    },

    //查询队列中是否存在此元素，存在返回下标，不存在返回-1
    find : function(ele){
        var pos = this.head;
        while(pos != this.tail){
            if(this.list[pos] == ele){
                return pos;
            }else{
                pos = (pos + 1) % this.capacity;
            }
        }
        return -1;
    },

    //返回队列中的元素个数
    queueSize : function(){
        return (this.tail - this.head + this.capacity) % this.capacity;
    },

    //清空队列
    clearQueue : function(){
        this.head = 0;
        this.tail = 0;
    },

    //判断队列是否为空
    isEmpty : function(){
        if(this.head == this.tail){
            return true;
        }else{
            return false;
        }
    },

    showQueue : function() {
        var pos = this.head;
        var strq = '';
        while (pos != this.tail) {
            strq += this.list[pos] + '';
            pos = (pos + 1) % this.capacity;
        }
        console.log(strq);
    },

}

module.exports = CircleQueue;



