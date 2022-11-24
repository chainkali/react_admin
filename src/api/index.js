
import ajax from "./ajax";

/*统一暴露
export default {
    xxx(){

    },

    yyy(){

    }
}
**/
/**
 * 包含应用中所有接口请求函数的模块每个函数的返回值都是promise
 */

// 分别暴露
//登录
/**
 * export function reqLogin(username,password){
   return ajax('/login',{username,password},'POST')
}
 */
// export const reqLogin=(username,password)=> {return ajax('/login', {username, password}, 'POST')}
export const reqLogin=(username,password)=>ajax('/login', {username,password}, 'POST')
export const reqAddUser=(user)=>ajax('/manage/user/add',user,'POST')

