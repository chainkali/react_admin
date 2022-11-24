import store from 'store'
/*
* 进行local数据存储
* */

const USER_KEY = 'user_key';
export default {

    /**

     *
     * 保存user
     *
    saveUser(user){
        // localStorage.setItem('USER_KEY',JSON.stringify(user))
    },
     *
     * 获取user
     *
    getUser(){
        //解析USER_KEY，没有的返回空对象
        return JSON.stringify(localStorage.getItem(('USER_KEY') ||'{}'))
    },
     *
     * 删除user
     *
    removeUser(){
        localStorage.removeItem('USER_KEY')
    }

     */

    /**
     * 使用store库
     */
    saveUser(user){
        store.set(USER_KEY,user)
    },

    getUser(){
       return  store.get(USER_KEY)
    },

    removeUser(){
        store.remove(USER_KEY)
    }



}
