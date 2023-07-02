import { User } from '../models/user';
import { userEmail } from '../controllers/authUserController';


export const getUserId = async () => {
    const users =  await User.findAll();
    const user = users.find((person:any) => {
      return person.email === userEmail});

       
    if (!user){
       console.log("user not found")
       
    }
    return user?.id
}




export const extractDate = (date: string)=>{
    let  splitArray = date.substring(0,20)
    let Sdate = splitArray.replace('T', '||')

    return Sdate
}