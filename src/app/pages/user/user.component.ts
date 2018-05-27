import { Component, OnInit } from '@angular/core';
import { Util } from '../../util/util';
import { Router } from '@angular/router';
import { MsgBoxService } from '../../components/msg-box/msg-box.service';
import { ProviderService } from '../../services/provider.service';
import { User } from '../../interfaces/user.interface';


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styles: []
})
export class UserComponent implements OnInit {

  title = "Usuarios";  
  collection: User[] = []
  id: string;
  idxSel: number;
  term: string;
  model: string =  Util.URL_USER;
  totalRecords: number;  

  constructor(private _ps:ProviderService, private router: Router, private _msg: MsgBoxService) {

    this._ps.getObjectsByFather(Util.URL_USER,"recordActive",0,"true").subscribe(
    res => {
      console.log(res);

      this._ps.refresToken(res);
      this.collection = res.users;
      this.totalRecords = res.totalRecords;         
      });

      this._msg.notify.subscribe(
      res => {
        if(res.type == Util.ACTION_DELETE && res.response == Util.OK_RESPONSE ){
            this._ps.deleteObject(Util.URL_USER,this.id).subscribe(
                res => { 
                    this._ps.refresToken(res);                                           
                    if(res.success == true) {
                        this._msg.show("", Util.MSJ_DELETE_SUCCESS, Util.ACTION_SUCCESS);                                            
                        this.collection.splice(this.idxSel,1); 
                    }
                }
            )
        }
      });
} 

ngOnInit() {
}

edit(id: string) {
    
  this.router.navigate(['/pages/editUser',id])

}


delete(idx:number ){
  this.id = this.collection[idx]._id;
  this.idxSel = idx;
  this._msg.show(Util.DELETE_TITLE ,Util.MSJ_DELETE_QUESTION, Util.ACTION_DELETE);

}

search() {
  if(this.term.length>0){
     this._ps.getObjects(Util.URL_USER,0 ,this.term ).subscribe(
         res => {
             this._ps.refresToken(res);
             this.collection = res.users;
             this.totalRecords = res.totalRecords;
         }   
     )       
 }else{
     this._ps.getObjects(Util.URL_USER).subscribe(
         res => {
            this._ps.refresToken(res); 
            this.collection = res.users;
            this.totalRecords = res.totalRecords;
         }
     );
 } 
}   

}