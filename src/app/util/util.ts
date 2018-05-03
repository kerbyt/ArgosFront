import { FormControl } from "@angular/forms";


export class Util {
    //public static URL_SERVER = 'http://180.124.152.20:3001';
    public static URL_SERVER = 'http://localhost:3001';
    public static TOKEN = "token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyVG9la2VuIjp7Il9pZCI6IjVhZDk0NThlZWJhYmRlMDNiNDU4Yjk3MSIsIm5hbWUiOiJLZXJieXQiLCJsYXN0TmFtZSI6IkNhcG90ZSIsImVtYWlsIjoia2VyYnl0LmNhcG90ZUBnbWFpbC5jb20iLCJwYXNzd29yZCI6IiIsIl9fdiI6MCwicm9sZSI6IkFETUlOX1JPTEUifSwiaWF0IjoxNTI0MzQ1NzQxLCJleHAiOjE1NTU4ODE3NDF9.A4GejRK_F5lAsOpqNUhzimk-tVS7lgRvX8O7Vpju6fg"    
    public static  URL_TASKS  = `${ Util.URL_SERVER }/task` ;
    public static  URL_SUB_TASKS  = `${ Util.URL_SERVER }/subtask` ;
    public static  URL_POSITIONS  = `${ Util.URL_SERVER }/position` ;
    public static  URL_EMPLOYEE  = `${ Util.URL_SERVER }/employee` ;
    private static serie = [2, 3, 4, 5, 6, 7];
    
    

    private static isValidRUT(rut: string):boolean {

        rut  = rut.replace(/\.|\-/g,""); 
        
        if(rut.length<2) {
           return false;     
        }

        let temp = this.calulateDV(rut.substr(0,rut.length-1),0)
        let ultDigit = rut.substr(rut.length-1,rut.length)
        let m = Number(temp) % 11;
        let dvCalc = (11 - m);            
        let dv:any = 0;
        if(dvCalc == 11) {
            dv = 0;
        } else if(dvCalc == 10){
            dv = "K";    
        }else {
            dv = dvCalc;
        }    
        return String(dv).toLocaleLowerCase() === ultDigit ? true: false; 
        
    }    


    private static calulateDV(rut: string, i: number){
        
        let idx = (i+1)<=5? (i+1):0;  
        
        if(rut.length>1){
            let ult = rut.substr(rut.length-1,rut.length);
            let value = Number(ult) * Util.serie[i];
            let rutCut = rut.substr(0,rut.length-1);  
            return value + this.calulateDV(rutCut,idx);
        }else{
            return Number(rut) * Util.serie[i];  
        }    


    }


    public static rutValid( control:FormControl ):{[s:string]:boolean} {

        
        let rut: string = control.value;
     

         if(!Util.isValidRUT(rut)){
             return {
                     rutValid: false
                    }
         }

        return null;
    }
    


    public static formatRut(rut: string){

        rut  = rut.replace(/\.|\-/g,""); 

        if( rut.length < 3){
            return rut;  
        }
        
        let l = rut.length;

        return  this.getFormatRut(rut.substr(0,l-1)) + "-" + rut.substr(l-1,l) ;
    }

    private static getFormatRut(str: string): string {
       
        let l = str.length;        
        if(str.length <= 3){
          return str; 
        }else{
          return  this.getFormatRut(str.substr(0,l-3) )  +"."+ this.getFormatRut(str.substr(l-3,l) )  ;
        }
    
    }
    

    
}
