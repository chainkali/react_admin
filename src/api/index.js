
import ajax from "./ajax";
import jsonp from "jsonp";
import {message} from "antd";

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
// const BASE = 'http://localhost:5000'
const BASE = ''
// 分别暴露
//登录
/**
 * export function reqLogin(username,password){
   return ajax('/login',{username,password},'POST')
}
 */
// export const reqLogin=(username,password)=> {return ajax('/login', {username, password}, 'POST')}
// export const reqLogin=(username,password)=>ajax('/login', {username,password}, 'POST')
    // 获取所有角色的列表
// export const reqRoles = () => ajax(BASE + '/manage/manage/list')
// // 添加角色
// export const reqAddRole = (roleName) => ajax(BASE + '/manage/manage/add', {roleName}, 'POST')
// // 添加角色
// export const reqUpdateRole = (manage) => ajax(BASE + '/manage/manage/update', manage, 'POST')
/////////
//登录请求
export const reqLoginAdmin=(username,password)=>ajax('/sys/loginAdmin', {username,password}, 'POST')
export const reqLoginUser=(username,password)=>ajax('/sys/loginUser', {username,password}, 'POST')

//查询所有manege
export const reqManages = (page,pageSize) => ajax(BASE + `/admin/getAdmin/${page}/${pageSize}`)
//添加或者更新manege
export const reqAddOrUpdateManage = (manage) => ajax(BASE + '/admin/saveOrUpdateAdmin', manage, 'POST')
//删除manege
export const reqDeleteManage = (id) => ajax(BASE + '/admin/deleteAdmin', {id}, 'POST')
//查询指定manege,name
export const reqManage = (adminName,page,pageSize) => ajax(BASE + `/admin/getAdmin/${page}/${pageSize}`,{adminName},'GET')


//查询所有user
export const reqUsers = (page,pageSize) => ajax(BASE + `/user/getUser/${page}/${pageSize}`)
//添加或者更新user
export const reqAddOrUpdateUser = (user) => ajax(BASE + '/user/saveOrUpdateUser', user, 'POST')
//删除user
export const reqDeleteUser = (id) => ajax(BASE + '/user/deleteUser', {id}, 'POST')
//查询指定user,name
export const reqUser = (userName,page,pageSize,) => ajax(BASE + `/user/getUser/${page}/${pageSize}`,{userName},'GET')

//查询所有物资
export const reqGoods = (page,pageSize) => ajax(BASE + `/goods/getGoods/${page}/${pageSize}`)
//添加或者更新物资
export const reqAddOrUpdateGood = (goods) => ajax(BASE + '/goods/saveOrUpdateGoods', goods, 'POST')
//删除物资
export const reqDeleteGood = (id) => ajax(BASE + '/goods/deleteGoods', {id}, 'POST')
//查询指定物资
export const reqGood = (goods,page,pageSize) => ajax(BASE + `/goods/getGoods/${page}/${pageSize}`,{goods},'GET')

//查询所有被检测者
export const reqNaRecords = (page,pageSize) => ajax(BASE + `/na-record/getNaRecords/${page}/${pageSize}`)
//添加或者更新被检测者
export const reqAddOrUpdateNaRecord = (naRecord) => ajax(BASE + '/na-record/saveOrUpdateNaRecord', naRecord, 'POST')
//删除被检测者
export const reqDeleteNaRecord = (id) => ajax(BASE + '/na-record/deleteNaRecord', {id}, 'POST')
//查询指定被检测者
export const reqNaRecord = (userName,result,sex,idCard,page,pageSize) => ajax(BASE + `/na-record/getNaRecords/${page}/${pageSize}`, {
    userName,
    result,
    sex,
    idCard
},'GET')


//查询所有检测点
export const reqNaLocations = (page,pageSize) => ajax(BASE + `/na-location/getLocation/${page}/${pageSize}`)
//添加或者更新检测点
export const reqAddOrUpdateNaLocation = (nalocation) => ajax(BASE + '/na-location/saveOrUpdateNaLocation', nalocation, 'POST')
//删除检测点
export const reqDeleteNaLocation = (id) => ajax(BASE + '/na-location/deleteNaLocation', {id}, 'POST')
//查询指定检测点
export const reqNaLocation = (location,status,page,pageSize) => ajax(BASE + `/na-location/getLocation/${page}/${pageSize}`,{location,status},'GET')

//查询所有医护人员
export const reqPersons = (page,pageSize) => ajax(BASE + `/na-staff/getStaff/${page}/${pageSize}`)
//查询所有locations
export const reqLocations = () => ajax(BASE + '/na-location/getLocation/1/100000')
//添加或者更新医护人员
export const reqAddOrUpdatePerson = (Person) => ajax(BASE + '/na-staff/saveOrUpdateNaStaff', Person, 'POST')
//删除医护人员
export const reqDeletePerson = (id) => ajax(BASE + '/na-staff/deleteNaStaff', {id}, 'POST')
//查询指定user,name
// export const reqPerson = (staffName) => ajax(BASE + '/na-staff/getStaff/1/1000000',{staffName},'GET')
//查询指定医护人员,nalocation
export const reqPerson = (name,na_location,page,pageSize) => ajax(BASE + `/na-staff/getStaff/${page}/${pageSize}`,{name,na_location},'GET')


export const weather=()=>ajax('https://restapi.amap.com/v3/weather/weatherInfo?city=320205&key=bad7a0010b58161fde45a0ea26a0534e','GET')


// 获取一级/二级分类的列表
export const reqCategorys = (parentId) => ajax(BASE + '/manage/category/list', {parentId})

// 添加分类
export const reqAddCategory = (categoryName, parentId) => ajax(BASE + '/manage/category/add', {categoryName, parentId}, 'POST')

// 更新分类
export const reqUpdateCategory = ({categoryId, categoryName}) => ajax(BASE + '/manage/category/update', {categoryId, categoryName}, 'POST')

// 获取一个分类
export const reqCategory = (categoryId) => ajax(BASE + '/manage/category/info', {categoryId})

// 获取商品分页列表
export const reqProducts = (pageNum, pageSize) => ajax(BASE + '/manage/product/list', {pageNum, pageSize})

// 更新商品的状态(上架/下架)
export const reqUpdateStatus = (productId, status) => ajax(BASE + '/manage/product/updateStatus', {productId, status}, 'POST')


/*
搜索商品分页列表 (根据商品名称/商品描述)
searchType: 搜索的类型, productName/productDesc
 */
export const reqSearchProducts = ({pageNum, pageSize, searchName, searchType}) => ajax(BASE + '/manage/product/search', {
    pageNum,
    pageSize,
    [searchType]: searchName,
})

// 搜索商品分页列表 (根据商品描述)
/*export const reqSearchProducts2 = ({pageNum, pageSize, searchName}) => ajax(BASE + '/manage/product/search', {
  pageNum,
  pageSize,
  productDesc: searchName,
})*/

// 删除指定名称的图片
export const reqDeleteImg = (name) => ajax(BASE + '/manage/img/delete', {name}, 'POST')

// 添加/修改商品
export const reqAddOrUpdateProduct = (product) => ajax(BASE + '/manage/product/' + ( product._id?'update':'add'), product, 'POST')
// 修改商品
// export const reqUpdateProduct = (product) => ajax(BASE + '/manage/product/update', product, 'POST')


// 获取所有角色的列表
export const reqRoles = () => ajax(BASE + '/manage/manage/list')
// 添加角色
export const reqAddRole = (roleName) => ajax(BASE + '/manage/manage/add', {roleName}, 'POST')
// 添加角色
export const reqUpdateRole = (role) => ajax(BASE + '/manage/manage/update', role, 'POST')


// 获取所有用户的列表
// export const reqUsers = () => ajax(BASE + '/manage/user/list')
// 删除指定用户
// export const reqDeleteUser = (userId) => ajax(BASE + '/manage/user/delete', {userId}, 'POST')
// // 添加/更新用户
// export const reqAddOrUpdateUser = (user) => ajax(BASE + '/manage/user/'+(user._id ? 'update' : 'add'), user, 'POST')


/*
* jsonp请求的接口请求函数
* */
export const reqWeather=(city)=>{
    return new Promise((resolve,reject)=>{
        const key="bad7a0010b58161fde45a0ea26a0534e"
        const url=`https://restapi.amap.com/v3/weather/weatherInfo?city=${city}&key=${key}`
        jsonp(url,{},(err,data)=>{
            console.log(data)
            if (!err && data.status==='1'){
                const {city, province, reporttime, temperature, weather, winddirection,windpower}=data.lives[0]
                resolve({city, province, reporttime, temperature, weather, winddirection,windpower})
                // console.log("jsonp请求的数据：")
                // console.log(data.lives)
                // console.log(data.lives[0].city)
            }else {
                message.error('获取天气失败！')
            }
        })
    })
}
reqWeather(320205)




